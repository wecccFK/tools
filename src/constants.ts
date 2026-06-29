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
  {
    id: 'uuid-generator',
    name: { zh: 'UUID 生成器', en: 'UUID Generator' },
    description: { zh: '生成 UUID v4/v7、ULID', en: 'Generate UUID v4/v7 and ULID' },
    category: 'Developer',
    tags: ['uuid', 'ulid', 'id', 'dev'],
    seoTitle: {
      zh: 'UUID/ULID 生成器 - Momo工具箱',
      en: 'UUID/ULID Generator - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线 UUID v4/v7、ULID 生成工具，支持批量、大小写、连字符控制。基于 crypto 安全随机数，本地生成。',
      en: 'Online UUID v4/v7 and ULID generator with batch, case, and hyphen controls. Uses crypto-secure randomness, fully local.',
    },
    tutorial: {
      zh: '选择 UUID 版本（v4 纯随机 / v7 时间排序 / ULID 字典序友好），调整数量和格式选项，点击生成。',
      en: 'Choose UUID version (v4 random / v7 time-ordered / ULID lexicographically sortable), adjust count and format options, click generate.',
    },
  },
  {
    id: 'color-converter',
    name: { zh: '颜色格式转换', en: 'Color Converter' },
    description: { zh: 'HEX/RGB/HSL/HSV 互转', en: 'Convert HEX/RGB/HSL/HSV' },
    category: 'Developer',
    tags: ['color', 'design', 'dev'],
    seoTitle: {
      zh: '颜色格式转换工具 - Momo工具箱',
      en: 'Color Converter - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线颜色格式转换工具，支持 HEX、RGB、HSL、HSV 互转，带取色器与滑块。所有转换在浏览器本地完成。',
      en: 'Online color format converter supporting HEX, RGB, HSL, and HSV with picker and sliders. All conversions run locally.',
    },
    tutorial: {
      zh: '点击色块使用浏览器取色器，或拖动 RGB/HSL 滑块调整，点击任一格式卡片复制对应值。',
      en: 'Click the swatch to use the browser color picker, or drag RGB/HSL sliders to adjust. Click any format card to copy its value.',
    },
  },
  {
    id: 'unit-converter',
    name: { zh: '单位换算器', en: 'Unit Converter' },
    description: { zh: '长度/重量/温度等换算', en: 'Length, mass, temperature, and more' },
    category: 'Productivity',
    tags: ['unit', 'convert', 'productivity'],
    seoTitle: {
      zh: '单位换算器 - Momo工具箱',
      en: 'Unit Converter - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线单位换算工具，支持长度、重量、温度、数据存储、速度、面积、时间、角度等 8 大类。本地计算。',
      en: 'Online unit converter supporting 8 categories: length, mass, temperature, data, speed, area, time, and angle. Local calculation.',
    },
    tutorial: {
      zh: '选择类别，输入数值，选择源单位和目标单位，结果实时显示。点击交换按钮可反向换算。',
      en: 'Pick a category, enter a value, choose source and target units, result updates in real time. Click swap to reverse.',
    },
  },
  {
    id: 'status-code-lookup',
    name: { zh: 'HTTP 状态码查询', en: 'HTTP Status Code Lookup' },
    description: { zh: '60+ 状态码速查与说明', en: 'Lookup 60+ HTTP status codes' },
    category: 'Developer',
    tags: ['http', 'status', 'dev'],
    seoTitle: {
      zh: 'HTTP 状态码查询工具 - Momo工具箱',
      en: 'HTTP Status Code Lookup - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线 HTTP 状态码查询工具,涵盖 1xx/2xx/3xx/4xx/5xx 共 60+ 条,支持搜索与分类筛选,中英双语说明。',
      en: 'Online HTTP status code lookup covering 1xx/2xx/3xx/4xx/5xx, 60+ entries with search and category filter, bilingual descriptions.',
    },
    tutorial: {
      zh: '在搜索框输入状态码、名称或描述关键词,结果实时过滤。点击分类标签可筛选 1xx-5xx。点击任一卡片复制状态码。',
      en: 'Type a code, name, or description keyword to filter results in real time. Click category chips to filter 1xx-5xx. Click any card to copy the code.',
    },
  },
  {
    id: 'pomodoro-timer',
    name: { zh: '番茄钟', en: 'Pomodoro Timer' },
    description: { zh: '25/5/15 经典计时', en: '25/5/15 classic timer' },
    category: 'Productivity',
    tags: ['pomodoro', 'timer', 'productivity'],
    seoTitle: {
      zh: '番茄钟计时器 - Momo工具箱',
      en: 'Pomodoro Timer - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线番茄钟计时器,25 分钟专注 + 5/15 分钟休息,支持自定义时长、浏览器通知、今日完成数统计。数据本地存储。',
      en: 'Online Pomodoro timer with 25 min focus + 5/15 min break, custom durations, browser notifications, and daily stats. Data stored locally.',
    },
    tutorial: {
      zh: '选择专注/短休/长休模式,点击开始。完成时浏览器会自动通知。展开"自定义时长"可调整 1-120 分钟。',
      en: 'Pick Focus / Short Break / Long Break and click Start. Browser will notify on completion. Expand "Custom durations" to set 1-120 minutes.',
    },
  },
  {
    id: 'image-splitter',
    name: { zh: '图片分割', en: 'Image Splitter' },
    description: { zh: '朋友圈 9 宫格 / 4 宫格切图', en: '4/9 grid for Instagram,朋友圈' },
    category: 'Image',
    tags: ['image', 'split', 'grid', 'instagram'],
    seoTitle: {
      zh: '图片分割工具 - 朋友圈九宫格切割 - Momo工具箱',
      en: 'Image Splitter - Instagram Grid Cutter - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线图片分割工具,支持 1×3 / 2×2 / 3×3 / 2×3 等多种切割方式,一键打包 ZIP 下载。本地处理,图片不上传。',
      en: 'Online image splitter supporting 1×3 / 2×2 / 3×3 / 2×3 grids, one-click ZIP download. Processed locally, never uploaded.',
    },
    tutorial: {
      zh: '上传图片,选择切割方式(如 3×3 九宫格),点击"开始切割"。预览后可单击任一切片下载,或点"下载全部 ZIP"一次打包。',
      en: 'Upload an image, pick a grid (e.g., 3×3), click Split. Click any slice to download individually, or "Download All ZIP" for a one-click bundle.',
    },
  },
  {
    id: 'aes-tool',
    name: { zh: 'AES 加解密', en: 'AES Encrypt/Decrypt' },
    description: { zh: 'AES-256-GCM/CBC 本地加解密', en: 'AES-256-GCM/CBC local encryption' },
    category: 'Developer',
    tags: ['aes', 'encrypt', 'crypto', 'security'],
    seoTitle: {
      zh: 'AES 加解密工具 - AES-256-GCM/CBC - Momo工具箱',
      en: 'AES Encrypt/Decrypt - AES-256-GCM/CBC - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线 AES 加解密工具,支持 AES-256-GCM(推荐)与 CBC 模式,密码派生(PBKDF2)或直接 hex 密钥,完全本地处理,密钥不上传。',
      en: 'Online AES tool supporting AES-256-GCM (recommended) and CBC modes, password-derived (PBKDF2) or direct hex key. Fully local, key never uploaded.',
    },
    tutorial: {
      zh: '选择加密/解密、模式(GCM 推荐)、密钥来源(密码或 hex)。加密时输入明文得到 base64 密文,解密时反向,粘贴密文得到明文。',
      en: 'Pick encrypt/decrypt, mode (GCM recommended), key source (password or hex). For encryption, input plaintext to get base64 ciphertext; reverse for decryption.',
    },
  },
  {
    id: 'screen-recorder',
    name: { zh: '屏幕录制', en: 'Screen Recorder' },
    description: { zh: '可调质量/分辨率/帧率/格式', en: 'Quality/Resolution/FPS/Format adjustable' },
    category: 'Productivity',
    tags: ['screen', 'record', 'video', 'media'],
    seoTitle: {
      zh: '屏幕录制工具 - 自定义质量/分辨率/帧率/格式 - Momo工具箱',
      en: 'Screen Recorder - Custom Quality/Resolution/FPS/Format - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线屏幕录制工具,支持自定义码率、分辨率(720p/1080p/1440p)、帧率(10-240 FPS)、视频格式(WebM/MP4),可选系统音频/麦克风,完全本地处理。',
      en: 'Online screen recorder with custom bitrate, resolution (720p/1080p/1440p), frame rate (10-240 FPS), video format (WebM/MP4), optional system audio/mic. Fully local.',
    },
    tutorial: {
      zh: '选择质量(码率)、分辨率、帧率、视频格式、音频来源后点击"开始录制"。浏览器会弹出共享对话框选择屏幕/窗口/标签页。点"停止"后可预览并下载。',
      en: 'Pick bitrate, resolution, FPS, video format, audio source and click "Start Recording". Browser prompts for screen/window/tab to share. Click "Stop" to preview and download.',
    },
  },
  {
    id: 'clock',
    name: { zh: '全屏时钟', en: 'Fullscreen Clock' },
    description: { zh: '时钟/秒表/倒计时,可全屏', en: 'Clock / Stopwatch / Countdown, fullscreen' },
    category: 'Productivity',
    tags: ['clock', 'time', 'stopwatch', 'countdown', 'fullscreen'],
    seoTitle: {
      zh: '全屏时钟 - 系统时间/秒表/倒计时 - Momo工具箱',
      en: 'Fullscreen Clock - Time/Stopwatch/Countdown - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线全屏时钟工具,支持系统时间显示、秒表计时、倒计时定时,可一键全屏放大为大字号时钟,适合演示、会议、学习。完全本地运行,无需联网。',
      en: 'Online fullscreen clock with system time, stopwatch and countdown timer. One-click fullscreen with large digits for presentations, meetings and study. Fully local.',
    },
    tutorial: {
      zh: '选择模式:时钟(显示系统时间)、秒表(计时)、倒计时(定时)。点"全屏"按钮可放大为大字号时钟。秒表支持计次;倒计时到点会响起提示音。',
      en: 'Pick mode: Clock (system time), Stopwatch (counting up), or Countdown. Click "Fullscreen" for large-digit view. Stopwatch supports laps; Countdown plays a sound at zero.',
    },
  },
  {
    id: 'random-group',
    name: { zh: '随机分组', en: 'Random Grouping' },
    description: { zh: '名单随机分组,Web Crypto 安全', en: 'Shuffle names into groups, Web Crypto' },
    category: 'Productivity',
    tags: ['random', 'group', 'shuffle', 'team', 'lottery'],
    seoTitle: {
      zh: '随机分组工具 - 名单随机分配 - Momo工具箱',
      en: 'Random Grouping Tool - Shuffle Names into Groups - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线随机分组工具,支持按组数或每组人数分配,使用 Web Crypto API 提供密码学安全随机性,完全本地处理,适合课堂分组、活动抽奖、团队任务分配。',
      en: 'Online random grouping tool. Split names by group count or per-group size using cryptographically secure Web Crypto API. Fully local, ideal for classroom, raffles and team tasks.',
    },
    tutorial: {
      zh: '选择"按组数分"或"按每组人数",设置组数/人数,在文本框输入名单(每行一项),点"随机分组"即可。结果以彩色卡片显示,可一键复制。',
      en: 'Pick "By group count" or "By group size", set the number, enter names (one per line) and click "Shuffle & Group". Results show in colored cards; one-click copy.',
    },
  },
  {
    id: 'image-matting',
    name: { zh: 'AI 抠图', en: 'AI Background Removal' },
    description: { zh: 'ISNet 神经网络抠图,支持批量', en: 'ISNet neural network matting, batch supported' },
    category: 'Image',
    tags: ['ai', 'matting', 'background-removal', 'isnet', 'image'],
    seoTitle: {
      zh: 'AI 抠图工具 - ISNet 神经网络背景移除 - Momo工具箱',
      en: 'AI Background Removal - ISNet Neural Network - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线 AI 抠图工具,基于 ISNet 神经网络,完全在浏览器中运行,不上传图片。支持快速/标准两种模型、PNG/WebP 输出、批量处理、ZIP 打包下载。首次加载约 40-80MB 模型,缓存后离线可用。',
      en: 'Online AI background removal tool powered by ISNet neural network. Runs entirely in the browser, no uploads. Fast/Standard models, PNG/WebP output, batch processing with ZIP download. ~40-80MB model cached for offline reuse.',
    },
    tutorial: {
      zh: '选择 AI 模型(快速/标准)和输出格式(PNG/WebP),拖拽或点击上传图片。AI 自动识别主体并移除背景,结果可预览对比并下载。批量模式支持多张同时处理并打包 ZIP。',
      en: 'Pick AI model (Fast/Standard) and output format (PNG/WebP), drop or click to upload. AI detects subject and removes background automatically. Batch mode processes multiple images and downloads as ZIP.',
    },
  },
];

export const CATEGORIES: (Tool['category'] | 'All')[] = ['All', 'Text', 'Developer', 'Image', 'Productivity', 'Entertainment'];

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find(tool => tool.id === id);
}
