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
    keywords: {
      zh: ['JSON 格式化', 'JSON 美化', 'JSON 校验', 'JSON 压缩', 'JSON 在线工具', 'JSON 解析', 'JSON 转换', 'JSON 验证器', 'JSON 树形视图', 'JSON 缩进', 'JSON 错误检查', 'JSON 编辑器', 'JSON 排序', 'JSON 转义', 'JSON 在线解析'],
      en: ['json formatter', 'json beautifier', 'json validator', 'json minify', 'json pretty print', 'json parser', 'json online', 'format json online', 'json viewer', 'json tree view', 'json indent', 'json syntax check', 'json editor online', 'json sorter', 'json escape'],
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
    keywords: {
      zh: ['Markdown 编辑器', 'Markdown 预览', 'MD 编辑器', 'Markdown 在线', 'GFM 语法', 'Markdown 转 HTML', 'Markdown 工具', '实时预览', 'Markdown 表格', 'Markdown 代码块', 'Markdown 任务列表', 'Markdown 导出', 'Markdown 排版', 'Markdown 渲染', 'Markdown 写作'],
      en: ['markdown editor', 'markdown preview', 'md editor online', 'gfm markdown', 'markdown to html', 'markdown live preview', 'online markdown', 'markdown viewer', 'markdown table', 'markdown code block', 'markdown task list', 'markdown export html', 'markdown renderer', 'markdown writer', 'markdown to pdf'],
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
    keywords: {
      zh: ['二维码生成', '二维码制作', 'QR 码生成', '带 Logo 二维码', '彩色二维码', '二维码下载', '二维码在线', 'QR Code', 'WiFi 二维码', '网址二维码', '二维码高清', '二维码容错', 'vCard 二维码', '二维码图片', '扫码生成'],
      en: ['qr code generator', 'qr code maker', 'qr code with logo', 'qr code online', 'barcode generator', 'custom qr code', 'qr code creator', 'generate qr code', 'wifi qr code', 'url qr code', 'qr code high resolution', 'qr code error correction', 'vcard qr code', 'qr code image', 'qr code scanner'],
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
    keywords: {
      zh: ['密码生成器', '随机密码', '强密码生成', '密码制作', '密码强度', '安全密码', '密码在线', '随机字符', '密码长度', '密码管理', '高强度密码', '密码创建', '随机字符串', '密码检查', '不可破解密码'],
      en: ['password generator', 'random password', 'strong password generator', 'password maker', 'secure password', 'random string generator', 'password creator', 'password generator online', 'password length', 'password strength', 'high entropy password', 'password creator online', 'random alphanumeric', 'password checker', 'unhackable password'],
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
    keywords: {
      zh: ['Base64 编码', 'Base64 解码', 'Base64 转换', 'Base64 在线', 'Base64 加密', 'Base64 图片', '文本编码', '解码工具', 'Base64 转文本', '文本转 Base64', 'Base64 字符串', 'Base64 编码器', 'Base64 解码器', 'Base64 转换器', 'Base64 算法'],
      en: ['base64 encode', 'base64 decode', 'base64 converter', 'base64 online', 'base64 encoder', 'base64 decoder', 'base64 to text', 'text to base64', 'base64 string', 'base64 to image', 'base64 image encoder', 'base64 file encoder', 'base64 url', 'utf-8 base64', 'base64 binary'],
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
    keywords: {
      zh: ['URL 编码', 'URL 解码', '网址编码', 'URL 转义', '百分号编码', 'URL 在线', 'URL 转换', '编码解码', 'encodeURIComponent', 'decodeURIComponent', 'URL 中文编码', 'URL 特殊字符', 'URL 编码器', 'URL 解码器', 'URI 编码'],
      en: ['url encode', 'url decode', 'url encoder online', 'url decoder', 'uri component', 'percent encoding', 'urlencode', 'urldecode', 'url escape', 'url special characters', 'url encoding utf-8', 'encodeuri', 'decodeuri', 'url percent encoder', 'uri encoder'],
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
    keywords: {
      zh: ['时间戳转换', 'Unix 时间戳', '时间戳在线', '时间戳工具', 'epoch 转换', '毫秒时间戳', '时间戳日期', '时间转换', '时间戳格式化', '时间戳转日期', '日期转时间戳', 'Unix 时间', '秒级时间戳', '时间戳查询', '时间戳校验'],
      en: ['unix timestamp', 'timestamp converter', 'epoch converter', 'unix time converter', 'timestamp to date', 'date to timestamp', 'epoch time', 'unix timestamp online', 'timestamp formatter', 'millisecond timestamp', 'timestamp parser', 'seconds timestamp', 'timestamp to human date', 'unix epoch', 'timestamp decoder'],
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
    keywords: {
      zh: ['哈希生成', 'MD5 计算', 'SHA256', 'SHA1', 'SHA512', '散列值', '哈希在线', '加密哈希', '哈希算法', '消息摘要', 'SHA 计算', 'MD5 在线', '哈希校验', '文件哈希', 'SHA-256 计算'],
      en: ['hash generator', 'md5 hash', 'sha256 calculator', 'sha1 generator', 'sha512 online', 'hash calculator', 'hash function', 'message digest', 'sha hash', 'hash online', 'md5 generator', 'hash checker', 'file hash', 'sha-256 hash', 'crypto hash'],
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
    keywords: {
      zh: ['JWT 解码', 'JWT 在线', 'Token 解析', 'JWT 查看器', 'JWT Payload', 'JWT 调试', 'JSON Web Token', '令牌解析', 'JWT Header', 'JWT 签名', 'JWT 验证', 'JWT 转 JSON', 'JWT 解密', 'JWT 分析', 'JWT 读取'],
      en: ['jwt decoder', 'jwt parser', 'jwt decode online', 'jwt debugger', 'jwt viewer', 'json web token decoder', 'jwt inspector', 'jwt token decoder', 'jwt header payload', 'jwt signature', 'jwt verifier', 'jwt to json', 'jwt reader', 'jwt analyzer', 'jwt unpack'],
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
    keywords: {
      zh: ['图片压缩', '图片压缩工具', '在线压缩图片', 'JPG 压缩', 'PNG 压缩', 'WebP 转换', '图片优化', '图片减小', '图片体积压缩', '压缩图片到指定大小', '批量压缩', '图片质量调节', '图片瘦身', '压缩照片', '图片大小减小'],
      en: ['image compressor', 'compress image online', 'jpg compressor', 'png compressor', 'webp converter', 'image optimizer', 'reduce image size', 'compress photo', 'image size reducer', 'batch image compressor', 'image quality reducer', 'compress image to 100kb', 'image shrinker', 'photo compressor', 'compress png'],
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
    keywords: {
      zh: ['UUID 生成', 'UUID v4', 'UUID v7', 'ULID 生成', '唯一 ID', 'GUID 生成', '随机 UUID', 'UUID 在线', 'UUID 批量生成', 'UUID 格式化', 'UUID 校验', 'UUID 转换', 'UUID 去连字符', 'UUID 大小写', 'UUID 转换器'],
      en: ['uuid generator', 'uuid v4', 'uuid v7', 'ulid generator', 'guid generator', 'unique id generator', 'random uuid', 'uuid online', 'uuid batch generator', 'uuid formatter', 'uuid validator', 'uuid converter', 'uuid without hyphens', 'uuid uppercase', 'uuid to binary'],
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
    keywords: {
      zh: ['颜色转换', '颜色格式', 'HEX RGB', 'RGB 转换', 'HSL 转换', '颜色码', '取色器', '颜色在线', 'HEX 转 RGB', 'RGB 转 HEX', 'HSV 转换', '颜色选择器', '颜色对照表', '颜色值查询', '颜色拾取'],
      en: ['color converter', 'hex to rgb', 'rgb to hex', 'hsl converter', 'color picker online', 'color code converter', 'hex color', 'color format', 'hsv converter', 'rgb to hsl', 'hsl to hex', 'color code lookup', 'color value', 'color tool', 'hex to hsl'],
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
    keywords: {
      zh: ['单位换算', '单位转换', '长度换算', '重量换算', '温度转换', '面积换算', '速度换算', '在线换算', '米转英尺', '公斤转磅', '摄氏转华氏', '数据存储换算', '角度换算', '时间换算', '公制转换'],
      en: ['unit converter', 'metric conversion', 'length converter', 'weight converter', 'temperature converter', 'area calculator', 'speed converter', 'unit calculator', 'meters to feet', 'kg to lbs', 'celsius to fahrenheit', 'data storage converter', 'angle converter', 'time converter', 'metric to imperial'],
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
    keywords: {
      zh: ['HTTP 状态码', '状态码查询', '404 500', 'HTTP 响应码', '状态码大全', 'HTTP Code', '状态码速查', '错误码', 'HTTP 错误', '1xx 2xx 3xx 4xx 5xx', '状态码含义', '301 302', '403 404', '502 503 504', '状态码列表'],
      en: ['http status codes', 'http status lookup', 'http response codes', '404 status code', '500 server error', 'http code reference', 'http status list', 'http error codes', 'http errors', '1xx 2xx 3xx 4xx 5xx', 'status code meaning', '301 302 redirect', '403 forbidden', '502 503 504', 'http status cheat sheet'],
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
    keywords: {
      zh: ['番茄钟', '番茄工作法', '25 分钟计时', '专注计时器', '番茄时钟', '工作计时', '专注力工具', '番茄在线', '25 5 计时器', '短休长休', '专注模式', '时间管理', '番茄倒计时', '学习计时', '工作定时器'],
      en: ['pomodoro timer', 'pomodoro technique', 'focus timer', '25 minute timer', 'productivity timer', 'tomato timer', 'work timer', 'pomodoro online', '25 5 timer', 'short break long break', 'focus mode', 'time management', 'pomodoro countdown', 'study timer', 'work session timer'],
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
    keywords: {
      zh: ['图片分割', '九宫格切图', '朋友圈九宫格', '图片切割', '网格切图', 'Instagram 切图', '图片切片', '九宫格', '3x3 切图', '2x2 切图', '图片排版', '批量切片', '图片打格', '社交图片', '朋友圈排版'],
      en: ['image splitter', 'instagram grid', '9 grid cutter', 'image grid', 'split image online', 'photo grid maker', 'image slicer', 'grid photo splitter', '3x3 grid', '2x2 grid', 'image cut', 'photo splitter', 'instagram grid maker', 'image crop grid', 'social media grid'],
    },
    tutorial: {
      zh: '上传图片,选择切割方式(如 3×3 九宫格),点击"开始切割"。预览后可单击任一切片下载,或点"下载全部 ZIP"一次打包。',
      en: 'Upload an image, pick a grid (e.g., 3×3), click Split. Click any slice to download individually, or "Download All ZIP" for a one-click bundle.',
    },
  },
  {
    id: 'aes-tool',
    name: { zh: '对称加密工具', en: 'Symmetric Encryption' },
    description: { zh: 'AES-256-GCM/CBC 与国密 SM4 本地加解密', en: 'AES-256-GCM/CBC & SM4 local encryption' },
    category: 'Developer',
    tags: ['aes', 'sm4', 'encrypt', 'crypto', 'security', '国密'],
    seoTitle: {
      zh: '对称加密工具 - AES-256 / SM4 - Momo工具箱',
      en: 'Symmetric Encryption - AES-256 / SM4 - Momo Toolbox',
    },
    seoDescription: {
      zh: '在线对称加密工具,支持 AES-256-GCM(推荐)、CBC 与国密 SM4-ECB/CBC 模式,密码派生或直接 hex 密钥,完全本地处理,密钥不上传。',
      en: 'Online symmetric encryption tool supporting AES-256-GCM (recommended), CBC, and Chinese standard SM4-ECB/CBC modes. Password-derived or direct hex key. Fully local, key never uploaded.',
    },
    keywords: {
      zh: ['AES 加密', 'SM4 加密', '国密加密', '对称加密', 'AES-256', '加密工具', '解密工具', '在线加密', 'AES-GCM', 'AES-CBC', 'SM4-ECB', 'SM4-CBC', '密码加密', '密文转换', '加密解密'],
      en: ['aes encryption', 'sm4 encryption', 'symmetric encryption', 'aes-256-gcm', 'encrypt online', 'decrypt online', 'crypto tool', 'chinese standard sm4', 'aes-cbc', 'sm4-cbc', 'sm4-ecb', 'encrypt decrypt', 'cipher tool', 'aes decryptor', 'sm4 decryptor'],
    },
    tutorial: {
      zh: '选择加密/解密、算法(AES-GCM 推荐 / SM4-CBC 国密)、密钥来源(密码或 hex)。加密时输入明文得到 base64 密文,解密时反向,粘贴密文得到明文。',
      en: 'Pick encrypt/decrypt, algorithm (AES-GCM recommended / SM4-CBC Chinese standard), key source (password or hex). For encryption, input plaintext to get base64 ciphertext; reverse for decryption.',
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
    keywords: {
      zh: ['屏幕录制', '录屏', '在线录屏', '屏幕录制工具', '录制视频', 'WebM 录制', 'MP4 录制', '录屏软件', '录制桌面', '录制窗口', '系统音频录制', '麦克风录制', '高清录屏', '1080p 录制', '录屏下载'],
      en: ['screen recorder', 'screen capture', 'record screen online', 'screen recording tool', 'webm recorder', 'mp4 recorder', 'screen video capture', 'online screen recorder', 'desktop recorder', 'window recorder', 'system audio recorder', 'microphone recorder', '1080p recording', 'screen cast', 'screen recorder free'],
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
    keywords: {
      zh: ['全屏时钟', '在线时钟', '秒表', '倒计时', '大字时钟', '会议时钟', '演示时钟', '时钟工具', '桌面时钟', '正计时', '反向计时', '计时器', '时间显示', '钟表', '时钟全屏'],
      en: ['fullscreen clock', 'online clock', 'stopwatch online', 'countdown timer', 'large clock', 'meeting clock', 'presentation timer', 'digital clock', 'desktop clock', 'count up timer', 'countdown timer online', 'timer tool', 'time display', 'clock widget', 'full screen clock'],
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
    keywords: {
      zh: ['随机分组', '名单分组', '随机分配', '抽签分组', '团队分组', '随机抽人', '课堂分组', '抽奖工具', '随机排序', '洗牌工具', '随机抽取', '团队生成器', '名单打乱', '随机排班', '公平分组'],
      en: ['random group generator', 'random team generator', 'name shuffler', 'random picker', 'group maker', 'random allocation', 'team divider', 'shuffle names', 'random sort', 'randomizer tool', 'random name picker', 'team generator', 'list shuffler', 'random schedule maker', 'fair grouping'],
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
    keywords: {
      zh: ['AI 抠图', '背景移除', '在线抠图', 'AI 去背景', '图片去背景', '透明背景', 'ISNet 抠图', '智能抠图', '一键抠图', '免费抠图', '图片背景透明化', '抠图软件', 'AI 美图', '证件照换背景', '批量抠图'],
      en: ['ai background removal', 'remove background online', 'image matting', 'background eraser', 'transparent background maker', 'isnet ai', 'photo background remover', 'ai cutout', 'remove bg free', 'background remover online', 'image background transparent', 'photo cutout tool', 'ai image editor', 'id photo background', 'batch background remover'],
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
