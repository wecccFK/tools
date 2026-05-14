# MOMO Toolbox (MOMO工具箱)

**English Version** | [中文版](./README.md)

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache_2.0-yellow.svg)](LICENSE)

MOMO Toolbox is a one-stop online platform tailored for you, designed to simplify your daily digital tasks. Whether it is text conversion, image processing, or developer debugging, you can find the right tools here—no download needed, just click and use.

---

## 🔥 Key features

The project covers a variety of practical tools designed for modern workflows, with **Multi-language (EN/ZH)** auto-switching and **Dark Mode** support.

### 1. 🖼️ Image Processing (Image)
- **AI Cutout**: One-click background removal with intelligent AI detection. Supports manual brush and eraser modes.
- **EXIF Viewer/Stripper**: View and strip sensitive metadata like camera models and GPS locations from photos.
- **Aspect Ratio**: Easily calculate the perfect aspect ratio for images, videos, and layouts.

### 2. 💻 Developer Suite (Developer)
- **API Token Speed Test**: Streaming benchmarking. Compare response times and generation speeds across models in one click.
- **AI Regex Generator**: Describe what you want in plain language and get a regular expression instantly.
- **Code Snippet Image**: Create beautiful, syntax-highlighted code images for sharing.
- **JSON Formatter**: Prettify, compress, and validate JSON data structures.

### 3. ✍️ Text Writing (Text)
- **AI Text Enhancer**: Improve professional tone, creativity, or fluency with integrated LLM power.
- **Markdown Editor**: Real-time editor with geek-friendly formatting and export options.
- **Case Converter**: Toggle between UPPERCASE, lowercase, CamelCase, and more.

### 4. 🚀 Productivity
- **Local Password Gen**: Generate high-entropy, random passwords completely offline.
- **Pomodoro Timer**: Boost focus with the 25/5 minute work/break technique.
- **Unit Converter**: Precision conversion between length, weight, temperature, and more.

### 5. 🎮 Entertainment
- **Classic Games**: Includes Snake, Gobang (AI), International Chess, and Chinese Chess—ready to play instantly.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18 + Vite 6
- **Styling**: Tailwind CSS 4 & Lucide React
- **Animation**: Motion (Framer Motion)
- **Routing**: React Router 7 (Single Page Application architecture)
- **Deployment**: Optimized for Vercel/Cloud Run with SPA routing fallback (No More 404s).

---

## ✨ Recent Updates

### Mobile Experience Optimization
- **Viewport Optimization**: Allow user scaling, support notch screen adaptation
- **Touch Interaction Optimization**: Remove tap highlights, optimize scrolling experience
- **Responsive Layout**: Optimize mobile card height and spacing
- **PWA Support**: Support adding to home screen, offline access

### SEO Optimization
- **Structured Data**: Add JSON-LD format structured data
- **Semantic Tags**: Add H1 tags and semantic HTML
- **Sitemap**: Complete website map including all tools and static pages
- **Open Graph**: Optimize social media sharing effects

### Performance Optimization
- **Component Lazy Loading**: All heavy tools use React.lazy for code splitting
- **Build Optimization**: Optimize Vite configuration, reduce bundle size
- **Ad Auto Refresh**: Auto refresh ads on route changes
- **Google Analytics**: Integrate website analytics

### AI Integration
- **IMA Skills**: Integrate Tencent IMA notes and knowledge base management
- **AI Content Detection**: AI content detection tool based on language patterns

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+

### Development
1. **Clone and Install**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Setup your Gemini API Key in the environment settings to unlock AI features:
   ```env
   GEMINI_API_KEY=your_key
   ```

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

---

## 🛡️ Privacy & Security

We highly respect your privacy. Unless necessary for AI features (where data is encrypted during transit and NOT stored), the vast majority of computations (Matting, Hashing, Password Gen, etc.) are performed **locally in your browser**. Your data is never uploaded, keeping your sensitive information in your own hands.

---

## 📬 Contact

If you have suggestions, feedback, or need custom features, feel free to reach out:

- **Email**: 1902243211@qq.com

---

## 📜 License
Licensed under the **Apache-2.0** License.

---
*Created by MOMO Toolbox STUDIO.*
