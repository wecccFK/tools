import type { Tool } from './types';

// 高频 10 个工具（阶段 1 先搬这些）
export const TOOLS: Tool[] = [
  {
    id: 'json-formatter',
    name: { zh: 'JSON 格式化', en: 'JSON Formatter' },
    description: { zh: '格式化、压缩、校验 JSON 数据', en: 'Format, minify and validate JSON data' },
    category: 'Developer',
    tags: ['json', 'formatting', 'dev'],
    seoTitle: {
      zh: 'JSON 格式化工具 - Momo工具箱',
      en: 'JSON Formatter - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线 JSON 格式化工具，支持美化、压缩、校验。所有数据本地处理，不上传服务器。',
      en: 'Online JSON formatter with beautify, minify and validate. All data processed locally.',
    },
    tutorial: {
      zh: '粘贴 JSON 文本到输入框，点击"格式化"美化，点击"压缩"压缩，点击"校验"检查语法错误。',
      en: 'Paste JSON text into the input, click "Format" to beautify, "Minify" to compress, or "Validate" to check syntax.',
    },
  },
  {
    id: 'markdown-editor',
    name: { zh: 'Markdown 编辑器', en: 'Markdown Editor' },
    description: { zh: '实时预览、导出 HTML', en: 'Live preview, export to HTML' },
    category: 'Text',
    tags: ['markdown', 'editor', 'writing'],
    seoTitle: {
      zh: 'Markdown 编辑器 - Momo工具箱',
      en: 'Markdown Editor - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线 Markdown 编辑器，支持实时预览、导出 HTML、GFM 扩展语法。',
      en: 'Online Markdown editor with live preview, HTML export, and GFM syntax.',
    },
    tutorial: {
      zh: '在左侧输入 Markdown 文本，右侧实时预览渲染效果。支持表格、代码块、任务列表等 GFM 语法。',
      en: 'Type Markdown on the left, see the rendered preview on the right. Supports GFM syntax like tables, code blocks, and task lists.',
    },
  },
  {
    id: 'qr-generator',
    name: { zh: '二维码生成', en: 'QR Code Generator' },
    description: { zh: '生成带 Logo 的二维码', en: 'Generate QR codes with logo' },
    category: 'Productivity',
    tags: ['qr', 'generator', 'productivity'],
    seoTitle: {
      zh: '二维码生成器 - Momo工具箱',
      en: 'QR Code Generator - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线二维码生成工具，支持自定义颜色、Logo、容错等级。生成图片可直接下载。',
      en: 'Online QR code generator with custom colors, logo, and error correction. Download as image.',
    },
    tutorial: {
      zh: '输入文本或链接，调整颜色和容错等级，可选上传 Logo。点击下载保存二维码图片。',
      en: 'Enter text or URL, adjust colors and error correction level, optionally upload a logo. Click download to save the QR image.',
    },
  },
  {
    id: 'password-generator',
    name: { zh: '密码生成器', en: 'Password Generator' },
    description: { zh: '强随机密码生成', en: 'Strong random password generator' },
    category: 'Productivity',
    tags: ['password', 'security', 'generator'],
    seoTitle: {
      zh: '随机密码生成器 - Momo工具箱',
      en: 'Random Password Generator - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线密码生成器，可自定义长度、字符类型。所有密码本地生成，不上传服务器。',
      en: 'Online password generator with custom length and character types. Generated locally, never uploaded.',
    },
    tutorial: {
      zh: '选择密码长度和包含的字符类型（大小写字母、数字、符号），点击生成按钮。点击复制按钮复制到剪贴板。',
      en: 'Choose password length and character types (upper/lower case, digits, symbols), click generate. Click copy to copy to clipboard.',
    },
  },
  {
    id: 'base64',
    name: { zh: 'Base64 编解码', en: 'Base64 Encode/Decode' },
    description: { zh: '编码解码文本和文件', en: 'Encode and decode text and files' },
    category: 'Developer',
    tags: ['base64', 'encoding', 'dev'],
    seoTitle: {
      zh: 'Base64 编解码工具 - Momo工具箱',
      en: 'Base64 Encode/Decode - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线 Base64 编码解码工具，支持文本和文件。UTF-8 安全，本地处理。',
      en: 'Online Base64 encoder and decoder for text and files. UTF-8 safe, processed locally.',
    },
    tutorial: {
      zh: '在输入框输入文本，自动进行编码或解码。使用切换按钮改变方向。支持 UTF-8 中文文本。',
      en: 'Enter text in the input box to automatically encode or decode. Use the toggle button to switch direction. UTF-8 supported.',
    },
  },
  {
    id: 'url-encoder',
    name: { zh: 'URL 编解码', en: 'URL Encode/Decode' },
    description: { zh: 'URL 编码解码转换', en: 'URL encode and decode conversion' },
    category: 'Developer',
    tags: ['url', 'encoding', 'dev'],
    seoTitle: {
      zh: 'URL 编解码工具 - Momo工具箱',
      en: 'URL Encode/Decode - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线 URL 编码解码工具，支持 encodeURIComponent 和 decodeURIComponent。',
      en: 'Online URL encoder and decoder, supports encodeURIComponent and decodeURIComponent.',
    },
    tutorial: {
      zh: '输入 URL 或文本，点击编码或解码按钮。使用切换按钮改变方向。',
      en: 'Enter URL or text, click encode or decode button. Use the toggle button to switch direction.',
    },
  },
  {
    id: 'timestamp',
    name: { zh: '时间戳转换', en: 'Timestamp Converter' },
    description: { zh: 'Unix 时间戳互转', en: 'Unix timestamp conversion' },
    category: 'Developer',
    tags: ['timestamp', 'time', 'dev'],
    seoTitle: {
      zh: 'Unix 时间戳转换工具 - Momo工具箱',
      en: 'Unix Timestamp Converter - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线 Unix 时间戳转换工具，支持秒级和毫秒级，互转可读时间。',
      en: 'Online Unix timestamp converter, supports seconds and milliseconds, converts to readable time.',
    },
    tutorial: {
      zh: '输入时间戳自动转换为可读时间，或输入日期时间反向获取时间戳。支持秒级和毫秒级。',
      en: 'Enter a timestamp to convert to readable time, or enter a date-time to get the timestamp. Supports seconds and milliseconds.',
    },
  },
  {
    id: 'hash-generator',
    name: { zh: '哈希生成器', en: 'Hash Generator' },
    description: { zh: 'MD5 / SHA256 等哈希计算', en: 'MD5, SHA256 hash calculation' },
    category: 'Developer',
    tags: ['hash', 'md5', 'sha256', 'dev'],
    seoTitle: {
      zh: '哈希生成器 - Momo工具箱',
      en: 'Hash Generator - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线哈希计算工具，支持 MD5、SHA1、SHA256、SHA512 等算法。本地计算，安全可靠。',
      en: 'Online hash calculator supporting MD5, SHA1, SHA256, SHA512. Calculated locally, safe and reliable.',
    },
    tutorial: {
      zh: '输入文本，选择哈希算法（MD5、SHA1、SHA256、SHA512），自动计算结果。点击结果复制到剪贴板。',
      en: 'Enter text, select hash algorithm (MD5, SHA1, SHA256, SHA512), result is calculated automatically. Click result to copy.',
    },
  },
  {
    id: 'jwt-decoder',
    name: { zh: 'JWT 解码器', en: 'JWT Decoder' },
    description: { zh: '解码 JWT Token', en: 'Decode JWT tokens' },
    category: 'Developer',
    tags: ['jwt', 'auth', 'decoder', 'dev'],
    seoTitle: {
      zh: 'JWT 解码器 - Momo工具箱',
      en: 'JWT Decoder - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线 JWT 解码工具，解析 Header 和 Payload。本地解码，不上传 Token。',
      en: 'Online JWT decoder, parses Header and Payload. Decoded locally, token never uploaded.',
    },
    tutorial: {
      zh: '粘贴 JWT Token（三段式，以.分隔）到输入框，自动解码 Header 和 Payload 为 JSON。',
      en: 'Paste a JWT token (three parts separated by dots) into the input, Header and Payload are decoded to JSON automatically.',
    },
  },
  {
    id: 'img-compress',
    name: { zh: '图片压缩', en: 'Image Compressor' },
    description: { zh: '本地压缩图片体积', en: 'Compress images locally' },
    category: 'Image',
    tags: ['image', 'compress', 'optimizer'],
    seoTitle: {
      zh: '图片压缩工具 - Momo工具箱',
      en: 'Image Compressor - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线图片压缩工具，支持 JPG/PNG/WebP，可调质量。所有压缩在浏览器本地完成，不上传图片。',
      en: 'Online image compressor supporting JPG/PNG/WebP with adjustable quality. All compression done locally in browser.',
    },
    tutorial: {
      zh: '上传图片（拖拽或点击），调整质量滑块，预览压缩效果，点击下载保存压缩后的图片。',
      en: 'Upload an image (drag-drop or click), adjust quality slider, preview the result, click download to save.',
    },
  },
];

export const CATEGORIES: (Tool['category'] | 'All')[] = ['All', 'Text', 'Developer', 'Image', 'Productivity', 'Entertainment'];

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find(tool => tool.id === id);
}
