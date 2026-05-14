import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3001;

  // JSON parsing and static serving
  app.use(express.json());
  
  // Ensure model directories exist
  const PUBLIC_DIR = path.join(process.cwd(), 'public');
  const MODELS_DIR = path.join(PUBLIC_DIR, 'models');
  const WASM_DIR = path.join(PUBLIC_DIR, 'wasm');
  [MODELS_DIR, WASM_DIR].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  // Lazy-loading and Caching Middleware for Models & WASM
  app.get(['/models/*', '/wasm/*'], async (req, res, next) => {
    const filePath = path.join(PUBLIC_DIR, req.path);
    
    // If file exists on disk, serve it normally (next() -> express.static)
    if (fs.existsSync(filePath)) {
      return next();
    }

    // Otherwise, attempt to fetch and cache it from the trusted mirror
    let remoteUrl = '';
    if (req.path.startsWith('/models/')) {
        // e.g. /models/Xenova/modnet/config.json
        const parts = req.path.replace('/models/', '');
        const segments = parts.split('/');
        if (segments.length >= 3) {
            // Reconstruct: https://hf-mirror.com/user/repo/resolve/main/path/to/file
            const [user, repo, ...rest] = segments;
            remoteUrl = `https://hf-mirror.com/${user}/${repo}/resolve/main/${rest.join('/')}`;
        }
    } else if (req.path.startsWith('/wasm/')) {
        const fileName = path.basename(req.path);
        remoteUrl = `https://fastly.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/${fileName}`;
    }

    if (!remoteUrl) return next();

    console.log(`Lazy-cache: Fetching ${remoteUrl} for ${req.path}...`);
    try {
      const response = await axios.get(remoteUrl, {
        responseType: 'arraybuffer',
        timeout: 60000,
        maxRedirects: 5,
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });

      // Ensure subdirectory exists
      const fileDir = path.dirname(filePath);
      if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });

      // Write to disk
      fs.writeFileSync(filePath, response.data);
      console.log(`Lazy-cache: Successfully cached ${req.path}`);

      // Serve the content
      const contentType = response.headers['content-type'];
      if (typeof contentType === 'string') res.setHeader('Content-Type', contentType);
      res.send(response.data);
    } catch (error: any) {
      console.error(`Lazy-cache error for ${req.path}:`, error.message);
      // Fallback to next (likely will result in 404 or index.html)
      next();
    }
  });

  // Serve static files from public
  app.use(express.static(PUBLIC_DIR));

  // API Proxy Route for Web Asset Extractor
  app.get("/api/proxy", async (req, res) => {
    const targetUrl = req.query.url as string;
    
    if (!targetUrl) {
      return res.status(400).json({ error: "URL parameter is required" });
    }

    // Validate URL format and protocol
    try {
      const url = new URL(targetUrl);
      if (!['http:', 'https:'].includes(url.protocol)) {
        return res.status(400).json({ error: "Only HTTP and HTTPS protocols are allowed" });
      }
    } catch (e) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    try {
      const response = await axios.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': '*/*',
          // Many sites block requests without a referer or with a cross-origin referer. 
          // Setting it to the target domain's root can sometimes bypass this.
          'Referer': new URL(targetUrl).origin,
        },
        timeout: 15000,
        maxRedirects: 5,
        responseType: 'arraybuffer' // Handle both text and binary data
      });

      res.set('Access-Control-Allow-Origin', '*');
      
      // Forward the original content-type
      const contentType = response.headers['content-type'];
      if (typeof contentType === 'string') {
        res.set('Content-Type', contentType);
      }

      // Forward content-length if available
      const contentLength = response.headers['content-length'];
      if (typeof contentLength === 'string' || typeof contentLength === 'number') {
        res.set('Content-Length', String(contentLength));
      }

      res.send(response.data);
    } catch (error: any) {
      console.error(`Proxy error for ${targetUrl}:`, error.message);
      res.status(500).json({ 
        error: "Failed to fetch content from the target URL",
        message: error.message 
      });
    }
  });

  // Dedicated Streaming Proxy for AI Speed Test
  app.post("/api/ai-proxy", async (req, res) => {
    const { url, method, headers, body } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      // Use fetch on the server side to easily handle streaming
      const response = await fetch(url, {
        method: method || 'POST',
        headers: headers || {},
        body: JSON.stringify(body)
      });

      // Forward status and headers
      res.status(response.status);
      
      const responseHeaders = response.headers;
      const contentType = responseHeaders.get('content-type');
      if (contentType) res.setHeader('Content-Type', contentType);

      // Handle streaming
      if (response.body) {
          const reader = response.body.getReader();
          while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(value);
          }
      }
      res.end();
    } catch (error: any) {
      console.error(`AI Proxy error for ${url}:`, error.message);
      res.status(500).json({ 
        error: "Failed to proxy AI request",
        message: error.message 
      });
    }
  });

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the dist folder
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // For any request that doesn't match a static file or API route, serve index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
