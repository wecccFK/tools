// 工具详细教程数据（中英双语）
// 独立文件，避免 constants.ts 臃肿

export interface ToolTutorial {
  // 使用场景
  usage: { zh: string; en: string };
  // 功能特点
  features: { zh: string[]; en: string[] };
  // 使用示例（每条是一个独立段落）
  examples: { zh: string[]; en: string[] };
  // 最佳实践
  bestPractices: { zh: string[]; en: string[] };
  // 常见问题
  faq: { zh: { q: string; a: string }[]; en: { q: string; a: string }[] };
  // 教程页 SEO
  seoTitle: { zh: string; en: string };
  seoDescription: { zh: string; en: string };
}

export const TOOL_TUTORIALS: Record<string, ToolTutorial> = {
  'json-formatter': {
    usage: {
      zh: 'JSON 格式化工具适用于前后端开发、API 调试、配置文件编辑、数据迁移等场景。当你从 API 拿到压缩的 JSON 响应需要阅读时，或需要校验自己写的 JSON 配置是否有语法错误时，这个工具能快速帮你完成。',
      en: 'The JSON formatter is useful for frontend/backend development, API debugging, config file editing, and data migration. Use it when you need to read minified JSON responses from APIs or validate the syntax of JSON you have written.',
    },
    features: {
      zh: [
        '一键格式化：将压缩的 JSON 美化为带缩进的多行格式',
        '一键压缩：去除所有空格换行，适合传输和存储',
        '语法校验：实时检测 JSON 错误并定位行号',
        'UTF-8 安全：正确处理中文等非 ASCII 字符',
        '完全本地处理：数据不上传服务器',
      ],
      en: [
        'One-click format: beautify minified JSON with proper indentation',
        'One-click minify: remove whitespace for transmission and storage',
        'Syntax validation: real-time error detection with line numbers',
        'UTF-8 safe: correctly handles non-ASCII characters like Chinese',
        'Fully local: data never leaves your browser',
      ],
    },
    examples: {
      zh: [
        '场景一：从 REST API 拿到 `{"name":"Momo","tools":["json","markdown"]}` 这种压缩响应，粘贴到工具里点"格式化"，立刻变成可读的多行结构。',
        '场景二：编辑 package.json 或 tsconfig.json 时，粘贴到工具里点"校验"，如果少了一个逗号会立即提示错误位置。',
        '场景三：需要把配置文件压缩传输，点"压缩"得到最短字符串，节省带宽。',
      ],
      en: [
        'Scenario 1: Got a minified response like `{"name":"Momo","tools":["json","markdown"]}` from a REST API? Paste it in and click "Format" to get a readable multi-line structure.',
        'Scenario 2: When editing package.json or tsconfig.json, paste and click "Validate" to instantly catch missing commas with line numbers.',
        'Scenario 3: Need to transmit a config file? Click "Minify" to get the shortest string and save bandwidth.',
      ],
    },
    bestPractices: {
      zh: [
        '始终使用双引号包裹字符串和键名（JSON 不支持单引号）',
        '最后一个键值对后不要加逗号（trailing comma 会导致解析失败）',
        '保存原始数据备份，避免格式化过程中误修改内容',
        '处理大型 JSON（>1MB）时建议先压缩再传输，到达后再格式化阅读',
      ],
      en: [
        'Always use double quotes for strings and keys (JSON does not support single quotes)',
        'Never add a trailing comma after the last key-value pair',
        'Keep a backup of the original data to avoid accidental modifications during formatting',
        'For large JSON (>1MB), compress before transmission and format after arrival',
      ],
    },
    faq: {
      zh: [
        {
          q: '我的数据会被上传到服务器吗？',
          a: '不会。所有 JSON 解析和格式化都在你的浏览器本地完成，数据从不离开你的设备。',
        },
        {
          q: '为什么我的 JSON 报错说 "Unexpected token"？',
          a: '最常见的原因是使用了单引号、缺少逗号、多了逗号，或字符串里包含未转义的双引号。点击"校验"可定位具体位置。',
        },
        {
          q: '支持 JSON5 或带注释的 JSON 吗？',
          a: '暂不支持。本工具严格遵循标准 JSON 规范（RFC 8259），不支持注释和尾随逗号。',
        },
      ],
      en: [
        {
          q: 'Will my data be uploaded to a server?',
          a: 'No. All JSON parsing and formatting happens locally in your browser. Data never leaves your device.',
        },
        {
          q: 'Why does my JSON throw "Unexpected token"?',
          a: 'The most common causes are single quotes, missing commas, trailing commas, or unescaped double quotes in strings. Click "Validate" to locate the exact position.',
        },
        {
          q: 'Does it support JSON5 or JSON with comments?',
          a: 'Not currently. This tool strictly follows the standard JSON spec (RFC 8259) and does not support comments or trailing commas.',
        },
      ],
    },
    seoTitle: {
      zh: 'JSON 格式化工具使用教程 - 如何美化、压缩、校验 JSON - Momo工具箱',
      en: 'JSON Formatter Tutorial - How to Beautify, Minify, Validate JSON - Momo Toolbox',
    },
    seoDescription: {
      zh: '详细教程：如何使用 Momo工具箱的 JSON 格式化工具进行美化、压缩、校验，包含使用场景、功能特点、示例和最佳实践。',
      en: 'Detailed tutorial: How to use Momo Toolbox JSON Formatter to beautify, minify, and validate. Includes use cases, features, examples, and best practices.',
    },
  },

  'markdown-editor': {
    usage: {
      zh: 'Markdown 编辑器适合写技术文档、博客文章、README、笔记、文档说明等。当你需要实时预览 Markdown 渲染效果，或需要将 Markdown 导出为 HTML 嵌入网页时，这个工具最为方便。',
      en: 'The Markdown editor is ideal for writing technical docs, blog posts, READMEs, notes, and documentation. It is most useful when you need live preview of Markdown rendering or need to export Markdown as HTML for embedding.',
    },
    features: {
      zh: [
        '实时预览：输入即渲染，所见即所得',
        'GFM 支持：表格、任务列表、删除线、自动链接',
        '代码高亮：支持主流编程语言语法高亮',
        '导出 HTML：一键生成可嵌入网页的完整 HTML',
        '本地保存：内容自动保存到浏览器，刷新不丢失',
      ],
      en: [
        'Live preview: instant rendering as you type',
        'GFM support: tables, task lists, strikethrough, autolinks',
        'Code highlighting: syntax highlighting for major languages',
        'HTML export: generate complete HTML for embedding with one click',
        'Auto-save: content persists in your browser across refreshes',
      ],
    },
    examples: {
      zh: [
        '场景一：写 GitHub README 时，在左侧编辑 Markdown，右侧实时查看渲染效果，避免提交后才发现格式问题。',
        '场景二：写技术博客，用 ` ```js ` 包裹代码块获得语法高亮，用表格对比功能，用任务列表跟踪进度。',
        '场景三：将写好的 Markdown 导出为 HTML，直接嵌入到 CMS 或网页中。',
      ],
      en: [
        'Scenario 1: When writing a GitHub README, edit Markdown on the left and see the rendered preview on the right to catch formatting issues before committing.',
        'Scenario 2: Write technical blogs using ```js fenced code blocks for syntax highlighting, tables for feature comparison, and task lists for progress tracking.',
        'Scenario 3: Export your Markdown as HTML and embed it directly into a CMS or webpage.',
      ],
    },
    bestPractices: {
      zh: [
        '使用 GFM 扩展语法时确保目标平台支持（如表格、任务列表）',
        '代码块要标明语言（如 ```python）以获得正确高亮',
        '图片建议使用绝对 URL，避免相对路径在不同环境下失效',
        '长文档建议分章节用 ## 标题组织结构，便于阅读',
      ],
      en: [
        'Ensure the target platform supports GFM extensions (tables, task lists) before using them',
        'Always specify the language in fenced code blocks (```python) for proper highlighting',
        'Use absolute URLs for images to avoid broken links across environments',
        'Organize long documents with ## section headings for better readability',
      ],
    },
    faq: {
      zh: [
        {
          q: '支持哪些 Markdown 扩展语法？',
          a: '支持 GitHub Flavored Markdown (GFM)，包括表格、任务列表（- [ ]）、删除线（~~text~~）、自动链接、代码块语法高亮等。',
        },
        {
          q: '导出的 HTML 包含哪些内容？',
          a: '导出的 HTML 是一个完整的独立 HTML 文档，包含内联 CSS 样式，可以直接保存为 .html 文件或在浏览器中打开。',
        },
        {
          q: '我的内容会被保存吗？',
          a: '会。编辑器内容会自动保存到浏览器 localStorage，刷新页面后内容仍在。清除浏览器数据会丢失内容，建议重要内容自行备份。',
        },
      ],
      en: [
        {
          q: 'What Markdown extensions are supported?',
          a: 'GitHub Flavored Markdown (GFM) is supported, including tables, task lists (- [ ]), strikethrough (~~text~~), autolinks, and syntax highlighting in code blocks.',
        },
        {
          q: 'What does the exported HTML contain?',
          a: 'The exported HTML is a complete standalone HTML document with inline CSS styles. You can save it as a .html file or open it directly in a browser.',
        },
        {
          q: 'Is my content saved?',
          a: 'Yes. The editor content is automatically saved to browser localStorage and persists across page refreshes. Clearing browser data will lose the content, so back up important content yourself.',
        },
      ],
    },
    seoTitle: {
      zh: 'Markdown 编辑器使用教程 - 实时预览、GFM、导出 HTML - Momo工具箱',
      en: 'Markdown Editor Tutorial - Live Preview, GFM, HTML Export - Momo Toolbox',
    },
    seoDescription: {
      zh: '详细教程：如何使用 Momo工具箱的 Markdown 编辑器进行实时预览、GFM 扩展语法、代码高亮和导出 HTML。',
      en: 'Detailed tutorial: How to use Momo Toolbox Markdown Editor for live preview, GFM extensions, code highlighting, and HTML export.',
    },
  },

  'qr-generator': {
    usage: {
      zh: '二维码生成器适合生成网址链接、Wi-Fi 密码分享、产品标签、活动海报、名片联系信息等场景。当你需要让用户用手机快速访问某个网址，或扫码加入 Wi-Fi 网络时，这个工具能快速生成可下载的二维码图片。',
      en: 'The QR code generator is useful for URL links, Wi-Fi password sharing, product labels, event posters, contact cards, and more. Use it when you need users to quickly access a URL via phone or scan to join a Wi-Fi network.',
    },
    features: {
      zh: [
        '自定义颜色：前景色和背景色任意搭配',
        'Logo 嵌入：中心可上传图片 Logo，自动切换 H 容错',
        '容错等级：L/M/Q/H 四级可选（带 Logo 自动切 H）',
        '多种尺寸：128px 到 1024px 自由选择',
        'PNG 下载：高清图片可直接保存使用',
      ],
      en: [
        'Custom colors: freely mix foreground and background colors',
        'Logo embedding: upload a logo in the center, auto-switches to H error correction',
        'Error correction levels: L/M/Q/H selectable (auto H when logo is enabled)',
        'Multiple sizes: 128px to 1024px freely adjustable',
        'PNG download: high-quality image ready to use',
      ],
    },
    examples: {
      zh: [
        '场景一：生成网站访问二维码，颜色调整为品牌色，中心加上 Logo，下载后印在宣传单上。',
        '场景二：生成 Wi-Fi 连接二维码，格式：`WIFI:T:WPA;S:网络名;P:密码;;`，客人扫码即可连接。',
        '场景三：生成 vCard 名片二维码，包含姓名、电话、邮箱，扫码即可添加联系人。',
      ],
      en: [
        'Scenario 1: Generate a website QR code with brand colors and a logo in the center, download and print it on flyers.',
        'Scenario 2: Generate a Wi-Fi QR code using the format: `WIFI:T:WPA;S:NetworkName;P:password;;` — guests scan to connect.',
        'Scenario 3: Generate a vCard QR code with name, phone, and email — scan to add a contact.',
      ],
    },
    bestPractices: {
      zh: [
        '带 Logo 时务必使用 H 容错等级（工具会自动切换）',
        'Logo 占比建议不超过二维码尺寸的 20%，避免无法识别',
        '前景色与背景色对比度要足够高（建议深色前景 + 浅色背景）',
        '打印用途建议导出 512px 以上，屏幕显示 256px 即可',
      ],
      en: [
        'Always use H error correction when embedding a logo (the tool auto-switches)',
        'Keep the logo under 20% of the QR code size to ensure scannability',
        'Ensure high contrast between foreground and background (dark foreground + light background recommended)',
        'For printing, export at 512px or higher; 256px is enough for screen display',
      ],
    },
    faq: {
      zh: [
        {
          q: '为什么我生成的二维码扫不出来？',
          a: '常见原因：内容过长（建议 URL < 100 字符）、前景背景对比度太低、Logo 占比过大覆盖了关键模块、容错等级太低。带 Logo 时工具会自动切到 H 级保证可识别。',
        },
        {
          q: '二维码有内容长度限制吗？',
          a: '有。QR 码容量取决于版本（1-40）和容错等级。一般 URL 二维码建议不超过 100 字符，超过会降低识别率。',
        },
        {
          q: 'Logo 上传后会保存到服务器吗？',
          a: '不会。Logo 仅在浏览器本地处理，不上传任何文件到服务器。',
        },
      ],
      en: [
        {
          q: 'Why can\'t my generated QR code be scanned?',
          a: 'Common causes: content too long (URLs should be < 100 characters), low contrast between foreground and background, logo too large covering key modules, or low error correction level. The tool auto-switches to H level when a logo is enabled.',
        },
        {
          q: 'Is there a content length limit for QR codes?',
          a: 'Yes. QR capacity depends on version (1-40) and error correction level. URLs should generally be under 100 characters; longer content reduces scannability.',
        },
        {
          q: 'Is my uploaded logo saved to a server?',
          a: 'No. The logo is processed entirely in your browser and never uploaded.',
        },
      ],
    },
    seoTitle: {
      zh: '二维码生成器使用教程 - 自定义颜色、Logo、容错等级 - Momo工具箱',
      en: 'QR Code Generator Tutorial - Custom Colors, Logo, Error Correction - Momo Toolbox',
    },
    seoDescription: {
      zh: '详细教程：如何使用 Momo工具箱的二维码生成器生成带 Logo 的彩色二维码，包含容错等级、最佳实践和常见问题。',
      en: 'Detailed tutorial: How to use Momo Toolbox QR Code Generator to create QR codes with logos and custom colors. Includes error correction, best practices, and FAQ.',
    },
  },

  'password-generator': {
    usage: {
      zh: '密码生成器适用于注册新账号、修改密码、设置 Wi-Fi 密码、生成 API 密钥、数据库密码等场景。当你需要一个高强度、不重复、难以被暴力破解的密码时，这个工具能在毫秒级生成符合安全要求的随机密码。',
      en: 'The password generator is useful for registering new accounts, changing passwords, setting Wi-Fi passwords, generating API keys, database passwords, and more. Use it when you need a high-strength, unique, brute-force-resistant password in milliseconds.',
    },
    features: {
      zh: [
        '可调长度：4 到 64 位密码长度自由选择',
        '字符类型：大小写字母、数字、符号可选',
        '强度指示：实时显示密码强度（弱/中/强）',
        '安全随机：使用 crypto.getRandomValues 加密级随机源',
        '排除相似字符：可选排除 0/O/1/l/I 等易混淆字符',
      ],
      en: [
        'Adjustable length: 4 to 64 characters',
        'Character types: upper/lower case, digits, symbols selectable',
        'Strength indicator: real-time strength display (weak/medium/strong)',
        'Cryptographic random: uses crypto.getRandomValues CSPRNG',
        'Exclude similar: optional removal of confusing chars like 0/O/1/l/I',
      ],
    },
    examples: {
      zh: [
        '场景一：注册重要账号（邮箱、银行）时，生成长度 20 位、包含所有字符类型的强密码。',
        '场景二：为 Wi-Fi 设置密码，勾选"排除相似字符"避免家人输入时混淆 0/O。',
        '场景三：生成 API 密钥，使用 32 位长度 + 大小写字母数字组合，满足大多数平台要求。',
      ],
      en: [
        'Scenario 1: Generate a 20-character password with all character types for important accounts (email, banking).',
        'Scenario 2: Set a Wi-Fi password with "exclude similar characters" enabled so family members don\'t confuse 0/O.',
        'Scenario 3: Generate a 32-character API key with upper/lower case + digits to meet most platform requirements.',
      ],
    },
    bestPractices: {
      zh: [
        '密码长度至少 12 位，重要账号建议 20 位以上',
        '同时使用大小写字母、数字、符号四种字符类型',
        '每个账号使用独立密码，避免一处泄露影响多处',
        '建议配合密码管理器（如 1Password、Bitwarden）存储密码',
      ],
      en: [
        'Use at least 12 characters; 20+ for important accounts',
        'Include all four character types: upper, lower, digits, symbols',
        'Use a unique password for each account to limit breach impact',
        'Pair with a password manager (e.g., 1Password, Bitwarden) for storage',
      ],
    },
    faq: {
      zh: [
        {
          q: '生成的密码安全吗？会被记录吗？',
          a: '非常安全。密码使用浏览器原生的 crypto.getRandomValues 加密级随机数生成器，生成的密码完全本地处理，不发送到任何服务器，不留任何日志。',
        },
        {
          q: '为什么生成的密码看起来很复杂？',
          a: '这是有意为之。强密码应该看起来随机且无规律，避免被字典攻击和模式猜测破解。复杂度正是安全性的体现。',
        },
        {
          q: '强度指示的"强"是什么标准？',
          a: '"强"通常意味着长度 ≥ 16 位，且包含大小写字母、数字、符号四种字符类型。这种密码在当前算力下被暴力破解需要数百万年。',
        },
      ],
      en: [
        {
          q: 'Are the generated passwords safe? Are they logged?',
          a: 'Very safe. Passwords are generated using the browser\'s native crypto.getRandomValues CSPRNG. Generation happens entirely locally with no server transmission and no logging.',
        },
        {
          q: 'Why do generated passwords look so complex?',
          a: 'By design. Strong passwords should appear random and patternless to resist dictionary attacks and pattern guessing. Complexity is the point.',
        },
        {
          q: 'What does "strong" mean in the strength indicator?',
          a: '"Strong" typically means 16+ characters with all four character types (upper, lower, digits, symbols). Such passwords would take millions of years to brute-force with current computing power.',
        },
      ],
    },
    seoTitle: {
      zh: '密码生成器使用教程 - 强随机密码生成与安全最佳实践 - Momo工具箱',
      en: 'Password Generator Tutorial - Strong Random Password Best Practices - Momo Toolbox',
    },
    seoDescription: {
      zh: '详细教程：如何使用 Momo工具箱的密码生成器生成高强度随机密码，包含长度、字符类型、强度评估和安全建议。',
      en: 'Detailed tutorial: How to use Momo Toolbox Password Generator to create strong random passwords. Includes length, character types, strength evaluation, and security tips.',
    },
  },

  'base64': {
    usage: {
      zh: 'Base64 编解码工具适用于处理 Data URL、邮件附件、JWT Token、API 数据传输、嵌入图片到 HTML/CSS 等场景。当你需要将二进制数据或特殊字符转为 ASCII 安全格式，或将 Base64 还原为原始内容时，这个工具能快速完成转换。',
      en: 'The Base64 encoder/decoder is useful for handling Data URLs, email attachments, JWT tokens, API data transmission, and embedding images in HTML/CSS. Use it to convert binary data or special characters to ASCII-safe format, or to restore Base64 to its original content.',
    },
    features: {
      zh: [
        '双向转换：编码和解码一键切换',
        'UTF-8 安全：正确处理中文、emoji 等多字节字符',
        '实时输出：输入即转换，无需点击按钮',
        '错误提示：无效 Base64 会显示明确错误',
        '一键复制：结果可快速复制到剪贴板',
      ],
      en: [
        'Bidirectional: encode and decode with one toggle',
        'UTF-8 safe: correctly handles Chinese, emoji, and other multi-byte characters',
        'Real-time output: converts as you type, no button clicks needed',
        'Error messages: invalid Base64 shows clear error messages',
        'One-click copy: results can be quickly copied to clipboard',
      ],
    },
    examples: {
      zh: [
        '场景一：将图片转为 Base64 编码嵌入 HTML，减少 HTTP 请求：`<img src="data:image/png;base64,...">`。',
        '场景二：解码 JWT Token 的 Payload 部分，查看用户信息和过期时间。',
        '场景三：将中文用户名编码后通过只支持 ASCII 的 API 传输，到达后再解码还原。',
      ],
      en: [
        'Scenario 1: Convert an image to Base64 and embed it in HTML to reduce HTTP requests: `<img src="data:image/png;base64,...">`.',
        'Scenario 2: Decode the Payload part of a JWT token to view user info and expiration time.',
        'Scenario 3: Encode a Chinese username for transmission via ASCII-only APIs, then decode at the destination.',
      ],
    },
    bestPractices: {
      zh: [
        'Base64 不是加密，任何人都能解码，不要用于存储敏感数据',
        'Base64 编码后体积增加约 33%，不适合大文件',
        '处理中文时确保使用 UTF-8 编码，避免乱码',
        'Data URL 嵌入图片建议小于 10KB，否则反而影响性能',
      ],
      en: [
        'Base64 is not encryption — anyone can decode it. Do not use it to store sensitive data',
        'Base64 increases size by about 33%, so it is not suitable for large files',
        'When handling Chinese text, ensure UTF-8 encoding to avoid garbled characters',
        'For Data URL embedded images, keep them under 10KB or performance may suffer',
      ],
    },
    faq: {
      zh: [
        {
          q: 'Base64 是加密吗？安全吗？',
          a: '不是。Base64 只是编码方式，任何人都能解码，不具备任何加密安全性。不要用 Base64 存储密码或敏感数据。',
        },
        {
          q: '为什么解码后中文是乱码？',
          a: '通常是因为原编码使用了非 UTF-8 字符集（如 GBK）。本工具默认使用 UTF-8，确保编码时也用 UTF-8 即可正确解码。',
        },
        {
          q: '支持 Base64URL 变体吗？',
          a: '当前版本仅支持标准 Base64（含 + / = 字符）。Base64URL（- _ 替代）暂不支持，建议用 JWT 解码器处理 Token。',
        },
      ],
      en: [
        {
          q: 'Is Base64 encryption? Is it secure?',
          a: 'No. Base64 is just an encoding scheme — anyone can decode it. It provides no encryption security. Do not use it to store passwords or sensitive data.',
        },
        {
          q: 'Why is Chinese text garbled after decoding?',
          a: 'Usually because the original encoding used a non-UTF-8 charset (like GBK). This tool uses UTF-8 by default — ensure the encoding step also uses UTF-8.',
        },
        {
          q: 'Does it support the Base64URL variant?',
          a: 'The current version only supports standard Base64 (with + / = characters). Base64URL (using - _) is not supported — use the JWT Decoder for tokens.',
        },
      ],
    },
    seoTitle: {
      zh: 'Base64 编解码使用教程 - UTF-8 中文处理与常见应用 - Momo工具箱',
      en: 'Base64 Encode/Decode Tutorial - UTF-8 Chinese and Common Uses - Momo Toolbox',
    },
    seoDescription: {
      zh: '详细教程：如何使用 Momo工具箱的 Base64 工具编解码文本，处理中文 UTF-8 字符，包含 Data URL、JWT 等应用场景。',
      en: 'Detailed tutorial: How to use Momo Toolbox Base64 tool to encode/decode text with UTF-8 Chinese support. Includes Data URL, JWT, and other use cases.',
    },
  },

  'url-encoder': {
    usage: {
      zh: 'URL 编解码工具适用于拼接查询参数、处理含特殊字符的 URL、调试 API 请求、生成安全链接等场景。当你需要把中文、空格、& 等特殊字符放进 URL，或反向解析已编码的 URL 时，这个工具能快速完成转换。',
      en: 'The URL encoder/decoder is useful for building query strings, handling URLs with special characters, debugging API requests, and generating safe links. Use it to put Chinese, spaces, &, and other special characters into URLs, or to parse encoded URLs back.',
    },
    features: {
      zh: [
        '双向转换：编码和解码一键切换',
        'encodeURIComponent：编码所有非 URL 安全字符',
        'encodeURI：保留 URL 结构字符（:/?&=）',
        '实时输出：输入即转换',
        '支持中文：正确处理 UTF-8 中文字符',
      ],
      en: [
        'Bidirectional: encode and decode with one toggle',
        'encodeURIComponent: encodes all URL-unsafe characters',
        'encodeURI: preserves URL structure characters (:/?&=)',
        'Real-time output: converts as you type',
        'Chinese support: correctly handles UTF-8 Chinese characters',
      ],
    },
    examples: {
      zh: [
        '场景一：API 请求参数含中文，如 `?name=张三&city=北京`，需要编码为 `?name=%E5%BC%A0%E4%B8%89&city=%E5%8C%97%E4%BA%AC` 才能传输。',
        '场景二：构造分享链接，包含特殊字符的标题需要编码后拼接到 URL 中。',
        '场景三：调试后端日志里看到的编码 URL，粘贴到工具里解码还原成可读中文。',
      ],
      en: [
        'Scenario 1: API request parameters contain Chinese, e.g., `?name=张三&city=北京` must be encoded as `?name=%E5%BC%A0%E4%B8%89&city=%E5%8C%97%E4%BA%AC` for transmission.',
        'Scenario 2: Build a share link where the title contains special characters that must be encoded before being appended to the URL.',
        'Scenario 3: Debug an encoded URL in backend logs by pasting it into the tool and decoding it back to readable Chinese.',
      ],
    },
    bestPractices: {
      zh: [
        '查询参数值用 encodeURIComponent，整个 URL 用 encodeURI',
        '永远不要手动拼接 URL 参数，用工具或库自动编码',
        '解码前确保字符串是有效的编码格式，避免双重解码',
        'URL 长度建议不超过 2000 字符（浏览器兼容性限制）',
      ],
      en: [
        'Use encodeURIComponent for query parameter values, encodeURI for entire URLs',
        'Never manually concatenate URL parameters — use a tool or library to encode automatically',
        'Ensure the string is valid encoded format before decoding to avoid double-decoding',
        'Keep URLs under 2000 characters for browser compatibility',
      ],
    },
    faq: {
      zh: [
        {
          q: 'encodeURIComponent 和 encodeURI 有什么区别？',
          a: 'encodeURIComponent 编码所有非字母数字字符（包括 :/?&=），适合编码单个参数值。encodeURI 保留 URL 结构字符，适合编码完整 URL。',
        },
        {
          q: '为什么空格编码后是 %20 还是 +？',
          a: '在 URL 查询字符串中，空格通常用 + 表示（application/x-www-form-urlencoded）。但在 URL 路径中，空格应该用 %20。本工具使用 %20 编码。',
        },
        {
          q: '能解码已经被编码多次的字符串吗？',
          a: '能，但需要多次点击"解码"按钮。每次解码会还原一层编码，直到字符串不再变化为止。',
        },
      ],
      en: [
        {
          q: 'What is the difference between encodeURIComponent and encodeURI?',
          a: 'encodeURIComponent encodes all non-alphanumeric characters (including :/?&=), suitable for individual parameter values. encodeURI preserves URL structure characters and is suitable for complete URLs.',
        },
        {
          q: 'Why is space encoded as %20 or +?',
          a: 'In URL query strings, spaces are typically represented as + (application/x-www-form-urlencoded). In URL paths, spaces should be %20. This tool uses %20.',
        },
        {
          q: 'Can it decode a string that has been encoded multiple times?',
          a: 'Yes, but you need to click "Decode" multiple times. Each click peels off one layer of encoding until the string stops changing.',
        },
      ],
    },
    seoTitle: {
      zh: 'URL 编解码使用教程 - 中文参数处理与 API 调试 - Momo工具箱',
      en: 'URL Encode/Decode Tutorial - Chinese Parameters and API Debugging - Momo Toolbox',
    },
    seoDescription: {
      zh: '详细教程：如何使用 Momo工具箱的 URL 编解码工具处理中文参数、调试 API 请求，包含 encodeURIComponent 和 encodeURI 的区别。',
      en: 'Detailed tutorial: How to use Momo Toolbox URL encoder/decoder to handle Chinese parameters and debug API requests. Includes the difference between encodeURIComponent and encodeURI.',
    },
  },

  'timestamp': {
    usage: {
      zh: '时间戳转换工具适用于后端 API 调试、数据库记录查询、日志分析、跨时区时间计算、定时任务配置等场景。当你需要把 Unix 时间戳转成可读时间，或反向获取当前时间戳时，这个工具能快速完成双向转换。',
      en: 'The timestamp converter is useful for backend API debugging, database record queries, log analysis, cross-timezone time calculations, and cron job configuration. Use it to convert Unix timestamps to readable times or to get the current timestamp.',
    },
    features: {
      zh: [
        '实时显示：当前时间戳和当前时间实时更新',
        '双向转换：时间戳 ↔ 日期时间',
        '秒/毫秒：支持秒级和毫秒级时间戳',
        '本地时区：自动按浏览器时区显示',
        '一键复制：结果可快速复制',
      ],
      en: [
        'Real-time display: current timestamp and time update live',
        'Bidirectional: timestamp ↔ date-time',
        'Seconds/milliseconds: supports both second and millisecond timestamps',
        'Local timezone: automatically uses browser timezone',
        'One-click copy: results can be quickly copied',
      ],
    },
    examples: {
      zh: [
        '场景一：后端 API 返回 `created_at: 1719500000`，粘贴到工具里立即看到对应的可读时间。',
        '场景二：数据库日志显示 `2024-06-27 15:30:00`，需要转为时间戳用于计算时间差。',
        '场景三：配置 cron 任务，需要知道某个未来时间点的时间戳，输入日期时间即可获取。',
      ],
      en: [
        'Scenario 1: Backend API returns `created_at: 1719500000` — paste it in to instantly see the readable time.',
        'Scenario 2: Database logs show `2024-06-27 15:30:00` and you need the timestamp to calculate time differences.',
        'Scenario 3: Configure a cron job and need the timestamp for a future point in time — enter the date-time to get it.',
      ],
    },
    bestPractices: {
      zh: [
        '注意区分秒级和毫秒级时间戳（13 位通常是毫秒）',
        '跨时区场景统一使用 UTC 时间戳存储，显示时再转本地时区',
        '历史时间戳（1970 年之前）在 JavaScript 中可能不准确',
        '2038 年问题：32 位 Unix 时间戳将在 2038 年溢出，建议使用 64 位系统',
      ],
      en: [
        'Distinguish between second and millisecond timestamps (13 digits usually means milliseconds)',
        'For cross-timezone scenarios, store UTC timestamps uniformly and convert to local timezone on display',
        'Historical timestamps (before 1970) may be inaccurate in JavaScript',
        'Year 2038 problem: 32-bit Unix timestamps will overflow in 2038 — use 64-bit systems',
      ],
    },
    faq: {
      zh: [
        {
          q: '时间戳是什么？',
          a: 'Unix 时间戳是从 1970 年 1 月 1 日 00:00:00 UTC 到指定时间的秒数（或毫秒数）。它是跨平台、跨时区的通用时间表示方式。',
        },
        {
          q: '如何区分秒级和毫秒级时间戳？',
          a: '通常 10 位数字是秒级时间戳（如 1719500000），13 位数字是毫秒级（如 1719500000000）。JavaScript 的 Date.now() 返回毫秒级。',
        },
        {
          q: '为什么显示的时间和数据库不一致？',
          a: '通常是因为时区差异。本工具按浏览器本地时区显示，数据库可能存储 UTC 时间。检查时区设置是否一致。',
        },
      ],
      en: [
        {
          q: 'What is a timestamp?',
          a: 'A Unix timestamp is the number of seconds (or milliseconds) elapsed since 1970-01-01 00:00:00 UTC. It is a universal, cross-platform, cross-timezone time representation.',
        },
        {
          q: 'How do I distinguish second vs millisecond timestamps?',
          a: 'Typically 10-digit numbers are second timestamps (e.g., 1719500000), and 13-digit numbers are milliseconds (e.g., 1719500000000). JavaScript\'s Date.now() returns milliseconds.',
        },
        {
          q: 'Why does the displayed time differ from the database?',
          a: 'Usually due to timezone differences. This tool displays in the browser\'s local timezone, while the database may store UTC. Check that timezone settings match.',
        },
      ],
    },
    seoTitle: {
      zh: '时间戳转换使用教程 - Unix 时间戳与日期时间互转 - Momo工具箱',
      en: 'Timestamp Converter Tutorial - Unix Timestamp to Date-Time - Momo Toolbox',
    },
    seoDescription: {
      zh: '详细教程：如何使用 Momo工具箱的时间戳转换工具进行 Unix 时间戳与可读时间的双向转换，包含秒/毫秒级和时区处理。',
      en: 'Detailed tutorial: How to use Momo Toolbox Timestamp Converter for bidirectional Unix timestamp and readable time conversion. Includes seconds/milliseconds and timezone handling.',
    },
  },

  'hash-generator': {
    usage: {
      zh: '哈希生成器适用于数据完整性校验、密码哈希（不推荐直接用 MD5）、文件去重、数字签名、内容指纹等场景。当你需要为一段文本或文件生成固定长度的唯一指纹时，这个工具能快速计算多种算法的哈希值。',
      en: 'The hash generator is useful for data integrity verification, password hashing (MD5 not recommended directly), file deduplication, digital signatures, and content fingerprinting. Use it to generate a fixed-length unique fingerprint for text or files.',
    },
    features: {
      zh: [
        '多种算法：MD5、SHA1、SHA256、SHA512、SHA224、SHA384',
        '实时计算：输入即计算，所有算法同时输出',
        '一键复制：每个哈希值独立复制',
        '本地计算：数据不上传，安全可靠',
        '大文本支持：可处理 MB 级文本输入',
      ],
      en: [
        'Multiple algorithms: MD5, SHA1, SHA256, SHA512, SHA224, SHA384',
        'Real-time computation: calculates as you type, all algorithms at once',
        'One-click copy: each hash value can be copied independently',
        'Local computation: data never uploaded, safe and reliable',
        'Large text support: handles MB-level text input',
      ],
    },
    examples: {
      zh: [
        '场景一：下载大文件后校验 SHA256，确保文件完整未被篡改：对比官方公布的哈希值和本地计算结果。',
        '场景二：对用户密码做哈希存储（推荐 SHA256 + 盐值，不要直接用 MD5）。',
        '场景三：生成文件指纹用于去重，相同内容的文件哈希值相同。',
      ],
      en: [
        'Scenario 1: Verify SHA256 after downloading a large file to ensure it was not tampered with — compare the official hash with the locally computed result.',
        'Scenario 2: Hash user passwords for storage (recommend SHA256 + salt, never use plain MD5).',
        'Scenario 3: Generate file fingerprints for deduplication — files with identical content have identical hashes.',
      ],
    },
    bestPractices: {
      zh: [
        '安全场景优先用 SHA256 或 SHA512，避免 MD5 和 SHA1',
        '密码存储务必加盐（salt），并使用 bcrypt/scrypt/Argon2 等专用算法',
        '哈希是不可逆的，无法从哈希值还原原文',
        '大文件哈希建议用流式计算，避免内存爆炸',
      ],
      en: [
        'For security use cases, prefer SHA256 or SHA512 — avoid MD5 and SHA1',
        'Always salt passwords and use dedicated algorithms like bcrypt/scrypt/Argon2',
        'Hashing is one-way — the original text cannot be recovered from the hash',
        'For large files, use streaming hash computation to avoid memory issues',
      ],
    },
    faq: {
      zh: [
        {
          q: 'MD5 和 SHA256 该选哪个？',
          a: '安全场景（密码、签名、完整性校验）务必用 SHA256 或更高。MD5 已被证明存在碰撞漏洞，仅适合非安全场景如缓存键、文件去重。',
        },
        {
          q: '哈希能解密吗？',
          a: '不能。哈希是单向函数，无法从哈希值反推出原文。所谓"彩虹表"只是预计算的原文-哈希对照表，不是真正的解密。',
        },
        {
          q: '为什么同样输入每次哈希结果一样？',
          a: '这是哈希函数的确定性特性。相同输入永远产生相同输出，这正是哈希用于完整性校验的基础。',
        },
      ],
      en: [
        {
          q: 'Should I use MD5 or SHA256?',
          a: 'For security use cases (passwords, signatures, integrity verification), always use SHA256 or higher. MD5 has known collision vulnerabilities and is only suitable for non-security uses like cache keys or file deduplication.',
        },
        {
          q: 'Can hashes be decrypted?',
          a: 'No. Hashing is a one-way function — the original text cannot be recovered from the hash. So-called "rainbow tables" are just precomputed plaintext-hash lookup tables, not real decryption.',
        },
        {
          q: 'Why does the same input always produce the same hash?',
          a: 'This is the determinism property of hash functions. The same input always produces the same output, which is the foundation of using hashes for integrity verification.',
        },
      ],
    },
    seoTitle: {
      zh: '哈希生成器使用教程 - MD5/SHA256 计算与安全建议 - Momo工具箱',
      en: 'Hash Generator Tutorial - MD5/SHA256 and Security Tips - Momo Toolbox',
    },
    seoDescription: {
      zh: '详细教程：如何使用 Momo工具箱的哈希生成器计算 MD5、SHA1、SHA256、SHA512 等哈希值，包含算法选择和安全建议。',
      en: 'Detailed tutorial: How to use Momo Toolbox Hash Generator to compute MD5, SHA1, SHA256, SHA512 hashes. Includes algorithm selection and security tips.',
    },
  },

  'jwt-decoder': {
    usage: {
      zh: 'JWT 解码器适用于调试登录 Token、验证用户身份、检查 Token 过期时间、排查权限问题等场景。当你拿到一串以 . 分隔的 JWT Token 需要查看其 Header 和 Payload 内容时，这个工具能快速解码并格式化显示。',
      en: 'The JWT decoder is useful for debugging login tokens, verifying user identity, checking token expiration, and troubleshooting permission issues. Use it to view the Header and Payload of a dot-separated JWT token.',
    },
    features: {
      zh: [
        '自动解析：粘贴即解码 Header 和 Payload',
        'JSON 格式化：解码结果自动美化',
        '过期检测：自动判断 Token 是否过期',
        '示例 Token：内置示例，方便快速体验',
        '本地解码：Token 不上传，安全可靠',
      ],
      en: [
        'Auto-parse: paste to decode Header and Payload instantly',
        'JSON formatting: decoded results are auto-beautified',
        'Expiration check: automatically detects if the token is expired',
        'Sample token: built-in example for quick exploration',
        'Local decoding: token never uploaded, safe and secure',
      ],
    },
    examples: {
      zh: [
        '场景一：前端登录后拿到 Token，粘贴到工具里查看用户 ID、角色、过期时间。',
        '场景二：后端 API 报 401 未授权，解码 Token 检查是否过期或权限不足。',
        '场景三：对比两个 Token 的 Payload，确认刷新 Token 后权限是否更新。',
      ],
      en: [
        'Scenario 1: After frontend login, paste the token to view user ID, role, and expiration time.',
        'Scenario 2: Backend API returns 401 Unauthorized — decode the token to check if it expired or has insufficient permissions.',
        'Scenario 3: Compare the Payload of two tokens to confirm whether permissions were updated after a token refresh.',
      ],
    },
    bestPractices: {
      zh: [
        '永远不要把 Token 分享给他人，即使解码也在本地进行',
        'JWT 默认不加密，任何人都能解码 Payload，不要存敏感信息',
        'Token 应通过 HTTPS 传输，避免中间人攻击',
        '过期时间建议设置为 1-2 小时，配合 refresh token 使用',
      ],
      en: [
        'Never share your token with anyone, even though decoding is local',
        'JWT is not encrypted by default — anyone can decode the Payload, so do not store sensitive data',
        'Always transmit tokens over HTTPS to prevent man-in-the-middle attacks',
        'Set expiration to 1-2 hours and pair with a refresh token',
      ],
    },
    faq: {
      zh: [
        {
          q: 'JWT 安全吗？会被篡改吗？',
          a: 'JWT 通过 Signature 防篡改，修改 Payload 会导致签名不匹配。但 JWT 默认不加密，任何人都能解码 Payload 内容，所以不要在 Token 里存敏感信息。',
        },
        {
          q: '为什么我的 Token 显示已过期？',
          a: '检查 Payload 里的 exp 字段（过期时间戳）。如果当前时间已超过 exp，Token 即过期，需要用 refresh token 获取新的。',
        },
        {
          q: '能解码加密的 JWT 吗？',
          a: '本工具仅解码未加密的 JWT（alg: HS256/RS256 等签名算法）。加密的 JWT（JWE）需要密钥才能解密，本工具不支持。',
        },
      ],
      en: [
        {
          q: 'Is JWT secure? Can it be tampered with?',
          a: 'JWT uses a Signature to prevent tampering — modifying the Payload breaks the signature match. But JWT is not encrypted by default, so anyone can decode the Payload. Do not store sensitive data in a token.',
        },
        {
          q: 'Why does my token show as expired?',
          a: 'Check the exp field in the Payload (expiration timestamp). If the current time exceeds exp, the token is expired and you need to use a refresh token to get a new one.',
        },
        {
          q: 'Can it decode encrypted JWTs?',
          a: 'This tool only decodes unencrypted JWTs (signed with HS256/RS256 etc.). Encrypted JWTs (JWE) require a key to decrypt and are not supported here.',
        },
      ],
    },
    seoTitle: {
      zh: 'JWT 解码器使用教程 - Token 解析与过期检测 - Momo工具箱',
      en: 'JWT Decoder Tutorial - Token Parsing and Expiration Check - Momo Toolbox',
    },
    seoDescription: {
      zh: '详细教程：如何使用 Momo工具箱的 JWT 解码器解析 Token 的 Header 和 Payload，包含过期检测、安全建议和常见问题。',
      en: 'Detailed tutorial: How to use Momo Toolbox JWT Decoder to parse a token\'s Header and Payload. Includes expiration check, security tips, and FAQ.',
    },
  },

  'img-compress': {
    usage: {
      zh: '图片压缩工具适用于网站图片优化、邮件附件瘦身、社交媒体上传、移动端图片适配等场景。当你需要把几张 MB 的原图压缩到 KB 级别，而又要保持可接受画质时，这个工具能在浏览器本地快速完成批量压缩。',
      en: 'The image compressor is useful for website image optimization, email attachment slimming, social media uploads, and mobile image adaptation. Use it to compress multi-MB originals down to KB while keeping acceptable quality — all locally in your browser.',
    },
    features: {
      zh: [
        '多格式支持：JPG、PNG、WebP、GIF 互转',
        '质量可调：0-100% 自由调节压缩质量',
        '实时预览：压缩前后对比，显示文件大小',
        '批量处理：一次拖拽多张图片同时压缩',
        '本地处理：图片不上传，保护隐私',
      ],
      en: [
        'Multi-format: JPG, PNG, WebP, GIF conversion',
        'Adjustable quality: 0-100% quality slider',
        'Real-time preview: before/after comparison with file sizes',
        'Batch processing: drag multiple images and compress at once',
        'Local processing: images never uploaded, privacy-friendly',
      ],
    },
    examples: {
      zh: [
        '场景一：博客文章配图，把 5MB 的相机原图压缩到 200KB 以内，加快页面加载。',
        '场景二：邮件附件超过大小限制，压缩图片后再发送。',
        '场景三：将 PNG 截图转为 WebP 格式，体积减少 30% 且画质无明显损失。',
      ],
      en: [
        'Scenario 1: Compress a 5MB camera original to under 200KB for blog images to speed up page loading.',
        'Scenario 2: Email attachment exceeds size limits — compress images before sending.',
        'Scenario 3: Convert PNG screenshots to WebP — 30% smaller with no visible quality loss.',
      ],
    },
    bestPractices: {
      zh: [
        '网页用图建议 WebP 格式，体积比 JPG 小 30%',
        '照片类图片质量 75-85% 即可，肉眼几乎无差别',
        '图标/截图类建议 PNG 或 WebP 无损压缩',
        '压缩后立即下载，避免占用浏览器内存',
      ],
      en: [
        'For web images, prefer WebP — about 30% smaller than JPG',
        'Photo quality 75-85% is usually indistinguishable to the eye',
        'For icons/screenshots, use PNG or lossless WebP',
        'Download immediately after compression to free browser memory',
      ],
    },
    faq: {
      zh: [
        {
          q: '压缩后的图片质量会损失吗？',
          a: '取决于质量设置。质量 100% 几乎无损；75-90% 肉眼难辨差别；50% 以下会有明显模糊。WebP 在相同质量下体积更小。',
        },
        {
          q: '支持哪些图片格式？',
          a: '支持输入 JPG、PNG、WebP、GIF，输出 JPG、PNG、WebP。GIF 输出会丢失动画，仅保留第一帧。',
        },
        {
          q: '有图片大小限制吗？',
          a: '理论上无限制，但受浏览器内存限制，单张图片建议不超过 20MB，否则可能崩溃。',
        },
      ],
      en: [
        {
          q: 'Will compression reduce image quality?',
          a: 'Depends on the quality setting. 100% is nearly lossless; 75-90% is hard to distinguish; below 50% shows visible blurring. WebP is smaller at the same quality.',
        },
        {
          q: 'What image formats are supported?',
          a: 'Input: JPG, PNG, WebP, GIF. Output: JPG, PNG, WebP. GIF output loses animation and keeps only the first frame.',
        },
        {
          q: 'Is there a size limit?',
          a: 'Theoretically unlimited, but constrained by browser memory. Single images should be under 20MB to avoid crashes.',
        },
      ],
    },
    seoTitle: {
      zh: '图片压缩使用教程 - JPG/PNG/WebP 压缩与格式转换 - Momo工具箱',
      en: 'Image Compressor Tutorial - JPG/PNG/WebP Compression and Conversion - Momo Toolbox',
    },
    seoDescription: {
      zh: '详细教程：如何使用 Momo工具箱的图片压缩工具压缩 JPG、PNG、WebP 图片，包含质量调节、格式转换和批量处理。',
      en: 'Detailed tutorial: How to use Momo Toolbox Image Compressor to compress JPG, PNG, WebP images. Includes quality adjustment, format conversion, and batch processing.',
    },
  },

  'uuid-generator': {
    usage: {
      zh: 'UUID/ULID 生成器适用于数据库主键生成、分布式系统 ID 分配、测试数据填充、会话 Token 生成等场景。当你需要在没有中心化 ID 分配服务的情况下生成全局唯一标识符，或者需要按时间排序的 ID 用于日志、事件流时，这个工具能快速帮你完成。',
      en: 'The UUID/ULID generator is useful for database primary keys, distributed system IDs, test data seeding, and session tokens. Use it when you need globally unique identifiers without a centralized ID service, or time-ordered IDs for logs and event streams.',
    },
    features: {
      zh: [
        '三种格式：UUID v4（纯随机）、UUID v7（时间排序）、ULID（26 字符字典序友好）',
        '批量生成：一次最多生成 50 个 ID',
        '格式控制：可切换大小写、是否带连字符',
        '密码学安全：使用 crypto.getRandomValues 真随机源',
        '完全本地生成：不上传服务器，可用于生产环境',
      ],
      en: [
        'Three formats: UUID v4 (random), UUID v7 (time-ordered), ULID (26-char lexicographically sortable)',
        'Batch generation: up to 50 IDs at once',
        'Format control: toggle uppercase and hyphens',
        'Cryptographically secure: uses crypto.getRandomValues true random source',
        'Fully local: never uploaded, safe for production use',
      ],
    },
    examples: {
      zh: [
        '场景一：为数据库插入测试数据时需要 100 个主键，将数量滑到 50，连续点击两次生成，复制全部到 SQL 文件中。',
        '场景二：调试分布式系统需要可排序的事件 ID，选择 UUID v7，生成后按字符串排序即为时间顺序。',
        '场景三：前端生成临时会话 ID，选择 ULID（更短、URL 友好），关闭连字符选项，得到 26 字符纯字符串。',
      ],
      en: [
        'Scenario 1: Need 100 primary keys for database test data? Slide count to 50, click Generate twice, copy all to your SQL file.',
        'Scenario 2: Debugging a distributed system needs sortable event IDs — pick UUID v7; sorting the strings gives time order.',
        'Scenario 3: Frontend needs a temporary session ID — pick ULID (shorter, URL-safe), disable hyphens to get a 26-char string.',
      ],
    },
    bestPractices: {
      zh: [
        '生产环境优先用 UUID v7 或 ULID，便于按时间排序与索引',
        '需要 URL 友好时选 ULID（无连字符、26 字符、大小写不敏感）',
        '不要用 UUID v4 作为数据库主键（无序导致 B-tree 索引碎片化）',
        '涉及安全场景（如 Token）务必用本工具的 crypto.getRandomValues，不要用 Math.random',
      ],
      en: [
        'Prefer UUID v7 or ULID in production for time-ordered, index-friendly keys',
        'Use ULID for URL-friendly IDs (no hyphens, 26 chars, case-insensitive)',
        'Avoid UUID v4 as a database primary key (random order causes B-tree fragmentation)',
        'For security-sensitive tokens, use this tool\'s crypto.getRandomValues, never Math.random',
      ],
    },
    faq: {
      zh: [
        { q: 'UUID v4 和 v7 有什么区别？', a: 'v4 是纯随机的，无任何顺序信息；v7 前 48 位是毫秒时间戳，因此按字符串排序就是按生成时间排序，适合数据库索引。' },
        { q: 'ULID 比 UUID 好在哪里？', a: 'ULID 是 26 字符的 Crockford Base32 编码，比 UUID（36 字符）短 10 个字符；大小写不敏感；字典序排序即为时间序；URL 友好无特殊字符。' },
        { q: '生成的 ID 真的安全吗？', a: '是。本工具使用 Web Crypto API 的 crypto.getRandomValues，是浏览器提供的密码学安全随机数源，与 crypto.randomUUID 同源。' },
        { q: '可以一次生成多个 ID 吗？', a: '可以。拖动"生成数量"滑块，最多一次生成 50 个。生成后可点击"复制全部"一次性复制到剪贴板。' },
      ],
      en: [
        { q: 'What is the difference between UUID v4 and v7?', a: 'v4 is fully random with no ordering. v7 embeds a 48-bit millisecond timestamp in the first bits, so string sorting equals time sorting — ideal for database indexes.' },
        { q: 'Why is ULID better than UUID?', a: 'ULID is 26 chars of Crockford Base32 — 10 chars shorter than UUID (36 chars), case-insensitive, lexicographically sortable by time, and URL-safe with no special characters.' },
        { q: 'Are the generated IDs cryptographically secure?', a: 'Yes. This tool uses the Web Crypto API\'s crypto.getRandomValues, the same cryptographically secure source behind crypto.randomUUID.' },
        { q: 'Can I generate multiple IDs at once?', a: 'Yes. Drag the Count slider up to 50. After generation, click "Copy All" to copy them all to the clipboard.' },
      ],
    },
    seoTitle: {
      zh: 'UUID/ULID 生成器使用教程 - v4/v7/ULID 选型与最佳实践 - Momo工具箱',
      en: 'UUID/ULID Generator Tutorial - v4/v7/ULID Selection and Best Practices - Momo Toolbox',
    },
    seoDescription: {
      zh: '详细教程：如何使用 Momo工具箱的 UUID 生成器，对比 UUID v4/v7 与 ULID 的选型、批量生成、格式控制，包含数据库主键与安全 Token 最佳实践。',
      en: 'Detailed tutorial: How to use Momo Toolbox UUID generator. Compare UUID v4/v7 and ULID selection, batch generation, format control, with best practices for database keys and security tokens.',
    },
  },

  'color-converter': {
    usage: {
      zh: '颜色格式转换器适用于前端开发调色、设计稿还原、CSS 变量编写、品牌色管理、调色板生成等场景。当你拿到一个 HEX 颜色需要转成 RGB 写进 canvas，或从设计稿取色后需要 HSL 来派生明暗变体时，这个工具能快速完成转换。',
      en: 'The color converter is useful for frontend color tuning, design restoration, CSS variable authoring, brand color management, and palette generation. Use it to turn a HEX color into RGB for canvas, or to derive HSL light/dark variants after picking a color from a design.',
    },
    features: {
      zh: [
        '四种格式互转：HEX、RGB、HSL、HSV',
        '浏览器原生取色器：点击色块即可从屏幕取色',
        'RGB 滑块：独立调节 R/G/B 通道，带数字输入',
        'HSL 滑块：独立调节色相/饱和度/亮度，便于派生变体',
        '一键复制：点击任一格式卡片即可复制对应值',
      ],
      en: [
        'Four-format conversion: HEX, RGB, HSL, HSV',
        'Native color picker: click the swatch to pick from screen',
        'RGB sliders: independent R/G/B channels with numeric input',
        'HSL sliders: independent hue/saturation/lightness for variant derivation',
        'One-click copy: click any format card to copy its value',
      ],
    },
    examples: {
      zh: [
        '场景一：设计师给的品牌色是 #D97706，前端要写 tailwind 配置，粘贴 HEX 后点击 RGB 卡片复制得到 rgb(217, 119, 6)。',
        '场景二：需要为主色生成 hover/active 变体，拖动 HSL 的 L 滑块到 60% 得到浅色版本，到 40% 得到深色版本。',
        '场景三：从设计稿截图取色后想转成 HSV 用于 PS 调整，点击色块取色，查看 HSV 卡片值。',
      ],
      en: [
        'Scenario 1: Designer hands you #D97706; paste it in HEX, click the RGB card to copy rgb(217, 119, 6) for tailwind config.',
        'Scenario 2: Need hover/active variants? Drag the HSL L slider to 60% for a lighter shade, 40% for a darker one.',
        'Scenario 3: Picked a color from a design screenshot and need HSV for Photoshop — click the swatch, read the HSV card.',
      ],
    },
    bestPractices: {
      zh: [
        'CSS 优先用 HSL：派生明暗变体只需改 L，派生互补色只需改 H ± 180',
        '设计系统用 HEX 作为权威值，RGB/HSL 作为派生值',
        '避免 HSV 用于 CSS（浏览器不直接支持），它主要用于图像编辑软件',
        '注意取色器受显示器色彩空间影响，对色彩精度要求高的场景应用专业校色',
      ],
      en: [
        'Prefer HSL in CSS: derive light/dark variants by changing L; complementary colors by ±180 on H',
        'Use HEX as the source of truth in design systems, RGB/HSL as derived values',
        'Avoid HSV in CSS (browsers don\'t support it directly) — it is mainly for image editors',
        'Note: the picker is affected by display color space; use professional calibration for color-critical work',
      ],
    },
    faq: {
      zh: [
        { q: 'HSL 和 HSV 有什么区别？', a: 'HSL 的 L=100% 是纯白；HSV 的 V=100% 是纯色（最饱和）。HSL 更适合 CSS 设计变体，HSV 更贴近图像编辑软件的调色逻辑。' },
        { q: '为什么输入 HEX 后 RGB 没更新？', a: '请确认 HEX 格式正确：3 位（#FFF）或 6 位（#FFFFFF），仅含 0-9 与 A-F。本工具会容错解析，无效时保留上一个有效值。' },
        { q: '可以取屏幕上任意像素的颜色吗？', a: '可以。点击色块会弹出浏览器原生取色器，部分浏览器支持从屏幕任意位置取色（如 Chrome 桌面端）。' },
        { q: 'HSL 怎么派生互补色？', a: '互补色在色相环上相差 180°。读取当前 H 值，加或减 180（结果对 360 取模），保持 S/L 不变即可。' },
      ],
      en: [
        { q: 'What is the difference between HSL and HSV?', a: 'In HSL, L=100% is pure white; in HSV, V=100% is the pure color (most saturated). HSL suits CSS variant design; HSV mirrors how image editors mix colors.' },
        { q: 'Why doesn\'t RGB update after I type HEX?', a: 'Ensure HEX is valid: 3 chars (#FFF) or 6 chars (#FFFFFF), digits 0-9 and A-F only. The tool parses tolerantly and keeps the last valid value on invalid input.' },
        { q: 'Can I pick any pixel on screen?', a: 'Yes. Click the swatch to open the native browser picker; some browsers (e.g. desktop Chrome) support picking any pixel on screen.' },
        { q: 'How do I derive a complementary color from HSL?', a: 'Complementary colors are 180° apart on the hue wheel. Take the current H, add or subtract 180 (mod 360), keep S and L unchanged.' },
      ],
    },
    seoTitle: {
      zh: '颜色格式转换使用教程 - HEX/RGB/HSL/HSV 互转与派生 - Momo工具箱',
      en: 'Color Converter Tutorial - HEX/RGB/HSL/HSV Conversion and Derivation - Momo Toolbox',
    },
    seoDescription: {
      zh: '详细教程：如何使用 Momo工具箱的颜色格式转换工具，HEX、RGB、HSL、HSV 互转，使用取色器与滑块调色，包含派生互补色与明暗变体的最佳实践。',
      en: 'Detailed tutorial: How to use Momo Toolbox Color Converter. Convert between HEX, RGB, HSL, HSV with picker and sliders, including best practices for complementary colors and light/dark variants.',
    },
  },

  'unit-converter': {
    usage: {
      zh: '单位换算器适用于跨地区工作协作、海外购物价格对比、工程计算、教学演示、日常生活换算等场景。当你需要把英里换算成公里看跑步距离，把磅换算成千克理解海外体重数据，或把 MB 换算成 GB 估算存储空间时，这个工具能快速完成。',
      en: 'The unit converter is useful for cross-region collaboration, overseas shopping price comparison, engineering calculations, teaching demos, and everyday conversions. Use it to convert miles to kilometers for running, pounds to kilograms for international weight, or MB to GB for storage estimates.',
    },
    features: {
      zh: [
        '8 大类：长度、重量、温度、数据存储、速度、面积、时间、角度',
        '双向换算：输入任一框自动反算另一框',
        '一键交换：点击中间按钮快速互换源与目标单位',
        '公式提示：实时显示 1 源单位 = 多少目标单位',
        '智能精度：大数自动科学计数法，避免显示一长串零',
      ],
      en: [
        '8 categories: length, mass, temperature, data, speed, area, time, angle',
        'Bidirectional: typing in either box auto-computes the other',
        'One-click swap: reverse source and target instantly',
        'Formula hint: shows "1 source = X target" in real time',
        'Smart precision: large numbers auto-switch to scientific notation',
      ],
    },
    examples: {
      zh: [
        '场景一：跑步 App 显示今天跑了 6.2 英里，想知道是多少公里。选长度类别，输入 6.2，源单位英里，目标单位千米，得到 9.98 公里。',
        '场景二：海外购物网站显示商品重 2.5 磅，选重量类别，输入 2.5，源单位磅，目标单位千克，得到 1.13 千克。',
        '场景三：服务器规格书显示内存 16384 MB，选数据存储类别，输入 16384，源单位兆字节，目标单位吉字节，得到 16 GB。',
      ],
      en: [
        'Scenario 1: Your running app shows 6.2 miles today. Pick Length, enter 6.2, source Mile, target Kilometer — you get 9.98 km.',
        'Scenario 2: An overseas shop lists an item at 2.5 lb. Pick Mass, enter 2.5, source Pound, target Kilogram — you get 1.13 kg.',
        'Scenario 3: A server spec lists 16384 MB RAM. Pick Data, enter 16384, source Megabyte, target Gigabyte — you get 16 GB.',
      ],
    },
    bestPractices: {
      zh: [
        '注意数据存储用 1024 进制（KB=1024B），与硬盘厂商标注的 1000 进制不同',
        '温度换算非线性，本工具已特殊处理摄氏/华氏/开尔文互转',
        '亩是中国市制单位，国际场合建议换算为平方米或公顷',
        '马赫数受介质温度影响（这里按标准空气 343 m/s 近似），高精度需求慎用',
      ],
      en: [
        'Note: data storage uses 1024-based units (KB=1024B), unlike hard drive vendors who use 1000',
        'Temperature is non-linear; this tool handles Celsius/Fahrenheit/Kelvin conversion specially',
        'Mu (亩) is a Chinese customary unit; convert to square meters or hectares for international contexts',
        'Mach depends on medium temperature (we approximate at 343 m/s standard air); avoid for high-precision needs',
      ],
    },
    faq: {
      zh: [
        { q: '为什么 1 GB 在这里等于 1024 MB？', a: '本工具采用计算机科学惯例的二进制前缀（1 KB = 1024 B）。硬盘厂商常用十进制（1 KB = 1000 B）会显示略小，这是行业惯例差异。' },
        { q: '温度换算为什么不能用线性比例？', a: '摄氏度与华氏度零点不同且刻度间隔不同（每摄氏度等于 1.8 华氏度），开尔文则是绝对温度。本工具已特殊处理三者的非线性转换。' },
        { q: '为什么海里不等于英里？', a: '海里是基于地球周长定义的（1 海里 = 1 角分纬度 ≈ 1852 米），用于航海航空；英里是英制单位（≈ 1609 米）。两者用途与定义都不同。' },
        { q: '可以添加货币换算吗？', a: '货币汇率实时波动，需要联网获取最新汇率，与本站"完全本地、不联网"的隐私理念相悖。如未来添加会明确告知联网场景。' },
      ],
      en: [
        { q: 'Why is 1 GB equal to 1024 MB here?', a: 'This tool uses the binary prefix convention (1 KB = 1024 B) common in computer science. Hard drive vendors often use decimal (1 KB = 1000 B) which yields a slightly smaller number — an industry convention difference.' },
        { q: 'Why isn\'t temperature a linear ratio?', a: 'Celsius and Fahrenheit have different zero points and scale intervals (1°C = 1.8°F); Kelvin is absolute. This tool handles the non-linear conversion between all three specially.' },
        { q: 'Why is a nautical mile not the same as a mile?', a: 'A nautical mile is based on Earth\'s circumference (1 NM = 1 arcminute of latitude ≈ 1852 m) for navigation; a mile is an imperial unit (≈ 1609 m). Their definitions and use cases differ.' },
        { q: 'Can you add currency conversion?', a: 'Currency rates fluctuate in real time and require fetching live rates online, which conflicts with our "fully local, no network" privacy stance. If added in the future, the network usage will be clearly disclosed.' },
      ],
    },
    seoTitle: {
      zh: '单位换算器使用教程 - 8 大类单位互转与精度控制 - Momo工具箱',
      en: 'Unit Converter Tutorial - 8 Categories with Precision Control - Momo Toolbox',
    },
    seoDescription: {
      zh: '详细教程：如何使用 Momo工具箱的单位换算器，长度、重量、温度、数据存储、速度、面积、时间、角度等 8 大类单位互转，包含二进制前缀与非线性换算的最佳实践。',
      en: 'Detailed tutorial: How to use Momo Toolbox Unit Converter for 8 categories — length, mass, temperature, data, speed, area, time, and angle — including binary prefixes and non-linear conversion best practices.',
    },
  },
};

// FAQ 页面常见问题（独立于工具教程）
export const SITE_FAQ = {
  zh: [
    {
      q: 'Momo工具箱是免费的吗？',
      a: '完全免费。所有工具都可以无限制使用，无需注册、无需付费、无隐藏费用。',
    },
    {
      q: '我的数据会被上传到服务器吗？',
      a: '不会。所有工具的数据处理都在你的浏览器本地完成。我们不收集任何个人数据，没有后端数据库。详见隐私政策。',
    },
    {
      q: '需要在网页上注册账号吗？',
      a: '不需要。所有工具开箱即用，无需登录、无需提供邮箱、无需任何身份信息。',
    },
    {
      q: '工具支持离线使用吗？',
      a: '目前需要联网访问。后续我们会推出 PWA 版本，安装后可离线使用所有工具。',
    },
    {
      q: '支持哪些浏览器？',
      a: '支持所有现代浏览器：Chrome 90+、Firefox 90+、Safari 14+、Edge 90+。建议使用最新版浏览器获得最佳体验。',
    },
    {
      q: '支持哪些语言？',
      a: '当前支持简体中文和英文，点击右上角的语言切换按钮即可切换。后续会根据需求添加更多语言。',
    },
    {
      q: '如何在手机上使用？',
      a: '直接用手机浏览器访问本网站即可，页面已做响应式适配，所有工具都能在手机上正常使用。',
    },
    {
      q: '可以批量处理数据吗？',
      a: '部分工具支持批量操作（如图片压缩）。其他工具的批量处理功能正在开发中，欢迎通过邮箱反馈需求。',
    },
    {
      q: '如何反馈 bug 或建议新工具？',
      a: '请通过页面底部的邮箱联系我们，详细描述问题或需求，我们会认真对待每一个反馈。',
    },
    {
      q: '工具的计算结果准确吗？',
      a: '所有工具使用浏览器原生的标准 API 实现，结果准确可靠。但对于关键场景，建议自行验证结果。',
    },
  ],
  en: [
    {
      q: 'Is Momo Toolbox free?',
      a: 'Completely free. All tools are unlimited and free to use — no registration, no payment, no hidden fees.',
    },
    {
      q: 'Will my data be uploaded to a server?',
      a: 'No. All tool data processing happens locally in your browser. We do not collect any personal data and have no backend database. See the Privacy Policy for details.',
    },
    {
      q: 'Do I need to register an account?',
      a: 'No. All tools work out of the box — no login, no email, no identity required.',
    },
    {
      q: 'Can tools be used offline?',
      a: 'Currently an internet connection is required. We are working on a PWA version that will allow offline use after installation.',
    },
    {
      q: 'Which browsers are supported?',
      a: 'All modern browsers: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+. We recommend the latest version for the best experience.',
    },
    {
      q: 'What languages are supported?',
      a: 'Simplified Chinese and English are currently supported. Click the language switcher in the top-right to switch. More languages will be added based on demand.',
    },
    {
      q: 'How do I use it on mobile?',
      a: 'Just visit the website in your mobile browser. All pages are responsive and every tool works on mobile.',
    },
    {
      q: 'Can I process data in bulk?',
      a: 'Some tools support batch operations (like image compression). Batch processing for other tools is under development. Feedback via email is welcome.',
    },
    {
      q: 'How do I report bugs or suggest new tools?',
      a: 'Please contact us via the email in the footer. Describe the issue or request in detail — we take every feedback seriously.',
    },
    {
      q: 'Are the tool results accurate?',
      a: 'All tools use standard browser-native APIs and produce accurate, reliable results. For critical use cases, we recommend verifying the results yourself.',
    },
  ],
};
