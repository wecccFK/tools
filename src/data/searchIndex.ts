import { TOOLS } from '../constants';
import type { Tool } from '../types';

/**
 * 搜索索引 - 编译期静态数据,运行时只查 Map
 *
 * 每个工具有:
 *  - pinyin: 名称中文的全拼(连写) + 首字母
 *  - aliases: 英文别名/缩写(小写)
 *  - tutorialKeywords: 教程中提取的高频关键词
 */

interface SearchEntry {
  toolId: string;
  // 拼音索引(全拼连写 + 首字母),用于 "ewm" → 二维码
  pinyinFull: string;        // 全拼连写,如 "erweima"
  pinyinInitials: string;    // 首字母,如 "ewm"
  // 英文别名/缩写
  aliases: string[];
  // 教程关键词(从 toolTutorials.ts 提取)
  tutorialKeywords: string[];
}

// 20 个工具的拼音与别名(手动维护,数据量小)
// 工具名 → 拼音全拼 + 首字母 + 别名
const PINYIN_MAP: Record<string, { full: string; initials: string; aliases: string[] }> = {
  'json-formatter':       { full: 'geshihua',    initials: 'gsh',    aliases: ['json', 'beautify', 'pretty', 'validate', 'jsonbeautifier'] },
  'markdown-editor':      { full: 'bianjiqi',    initials: 'bjq',    aliases: ['md', 'markdown', 'preview', 'gfm'] },
  'qr-generator':         { full: 'erweima',     initials: 'ewm',    aliases: ['qr', 'qrcode', 'barcode'] },
  'password-generator':   { full: 'mimashengchengqi', initials: 'mmscq', aliases: ['pwd', 'password', 'random', 'passgen'] },
  'base64':               { full: 'bianma',      initials: 'bm',     aliases: ['base64', 'b64', 'encode', 'decode'] },
  'url-encoder':          { full: 'bianma',      initials: 'bm',     aliases: ['url', 'urlencode', 'uri', 'encode'] },
  'timestamp':            { full: 'shijianchuo', initials: 'sjc',    aliases: ['time', 'unix', 'epoch', 'timestamp'] },
  'hash-generator':       { full: 'hash',        initials: 'hash',   aliases: ['md5', 'sha', 'sha256', 'sha512', 'digest'] },
  'jwt-decoder':         { full: 'jiema',       initials: 'jm',     aliases: ['jwt', 'token', 'jwtoken', 'decode'] },
  'img-compress':         { full: 'yasuo',       initials: 'ys',     aliases: ['compress', 'image', 'tiny', 'optimize', 'shrink'] },
  'uuid-generator':       { full: 'shengchengqi', initials: 'scq',    aliases: ['uuid', 'ulid', 'guid', 'randomid'] },
  'color-converter':      { full: 'yansezhuanghuan', initials: 'yszh', aliases: ['color', 'hex', 'rgb', 'hsl', 'hsv', 'palette'] },
  'unit-converter':       { full: 'danweizhuanhuan', initials: 'dwzh', aliases: ['unit', 'convert', 'metric', 'imperial'] },
  'status-code-lookup':   { full: 'zhuangtaimachaxun', initials: 'ztmcx', aliases: ['http', 'status', 'code', 'response', 'error'] },
  'pomodoro-timer':       { full: 'fanqiezhong', initials: 'fqz',     aliases: ['pomodoro', 'timer', 'focus', 'tomato', '25minutes'] },
  'image-splitter':       { full: 'fenge',       initials: 'fg',     aliases: ['split', 'grid', 'slice', 'crop', 'instagram'] },
  'aes-tool':             { full: 'jiami',       initials: 'jm',     aliases: ['aes', 'encrypt', 'decrypt', 'cipher', 'crypto'] },
  'screen-recorder':      { full: 'luping',      initials: 'lp',      aliases: ['screen', 'record', 'capture', 'screencast', 'video'] },
  'clock':                { full: 'shizhong',    initials: 'sz',      aliases: ['clock', 'time', 'stopwatch', 'countdown', 'timer'] },
  'random-group':         { full: 'suijifenzu',  initials: 'sjfz',   aliases: ['group', 'random', 'shuffle', 'team', 'lottery'] },
  'image-matting':        { full: 'koutu',       initials: 'kt',      aliases: ['matting', 'background', 'remove', 'cutout', 'alpha', 'isnet', 'image', 'photo', 'picture', '图片', '照片', '背景', '去背'] },
};

// 教程关键词(从 toolTutorials.ts 提取,只保留核心动词/名词,去停用词)
const TUTORIAL_KEYWORDS: Record<string, string[]> = {
  'json-formatter':       ['格式化', '压缩', '校验', '美', '树状', '折叠', 'format', 'minify', 'validate'],
  'markdown-editor':      ['预览', '实时', 'gfm', '表格', '代码块', '导出', 'html', 'preview', 'export'],
  'qr-generator':         ['logo', '容错', '颜色', '定制', '码眼', 'error', 'correction'],
  'password-generator':   ['长度', '字符集', '符号', '数字', '强', '安全', 'length', 'strong'],
  'base64':               ['unicode', 'utf8', '文件', '转换', 'file', 'convert'],
  'url-encoder':          ['encode', 'decode', 'uri', 'percent', '编码'],
  'timestamp':            ['秒', '毫', '时区', 'unix', 'epoch', 'iso'],
  'hash-generator':       ['md5', 'sha', '摘要', 'digest', '指纹'],
  'jwt-decoder':          ['header', 'payload', 'signature', 'token', 'base64url'],
  'img-compress':         ['质量', '尺寸', 'jpg', 'png', 'webp', 'quality'],
  'uuid-generator':       ['v4', 'v7', 'ulid', 'guid', '随机', '唯一'],
  'color-converter':      ['hex', 'rgb', 'hsl', 'hsv', '拾色', 'picker'],
  'unit-converter':       ['长度', '重量', '温度', '面积', '速度', 'angle'],
  'status-code-lookup':   ['1xx', '2xx', '3xx', '4xx', '5xx', 'response', 'error'],
  'pomodoro-timer':       ['25', '专注', '休息', '通知', '统计', 'focus', 'break'],
  'image-splitter':       ['朋友圈', '九宫格', '四宫格', 'grid', 'instagram', 'zip'],
  'aes-tool':             ['gcm', 'cbc', 'pbkdf2', '密钥', '加密', '解密', 'key'],
  'screen-recorder':      ['fps', '码率', '分辨率', 'webm', 'mp4', '音频', 'bitrate'],
  'clock':                ['全屏', '秒表', '倒计时', '系统时间', 'fullscreen'],
  'random-group':         ['名单', '分组', '抽签', 'fisher', 'yates', 'crypto'],
  'image-matting':        ['isnet', '神经网络', '透明', 'png', 'webp', '抠图', '背景移除'],
};

// 构建索引
export const SEARCH_INDEX: SearchEntry[] = TOOLS.map(tool => {
  const py = PINYIN_MAP[tool.id] || { full: '', initials: '', aliases: [] };
  return {
    toolId: tool.id,
    pinyinFull: py.full,
    pinyinInitials: py.initials,
    aliases: py.aliases,
    tutorialKeywords: TUTORIAL_KEYWORDS[tool.id] || [],
  };
});

export interface SearchResult {
  tool: Tool;
  score: number;          // 越高越优先
  matchedField: 'name' | 'alias' | 'pinyin' | 'tag' | 'desc' | 'tutorial' | 'category';
}

// 搜索算法:多字段权重评分
// 权重: name(100) > alias(80) > pinyin(70) > tag(60) > desc(40) > tutorial(20) > category(10)
export function searchTools(query: string, lang: 'zh' | 'en'): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return TOOLS.map(tool => ({ tool, score: 0, matchedField: 'name' as const }));

  const results: SearchResult[] = [];

  for (const entry of SEARCH_INDEX) {
    const tool = TOOLS.find(t => t.id === entry.toolId);
    if (!tool) continue;

    const name = tool.name[lang].toLowerCase();
    const desc = tool.description[lang].toLowerCase();
    const tags = tool.tags.join(' ').toLowerCase();
    const category = tool.category.toLowerCase();
    let bestScore = 0;
    let bestField: SearchResult['matchedField'] = 'name';

    // 1. 名称完全匹配(最高分)
    if (name === q) { bestScore = 100; bestField = 'name'; }
    // 2. 名称前缀匹配
    else if (name.startsWith(q)) { bestScore = 95; bestField = 'name'; }
    // 3. 名称包含
    else if (name.includes(q)) { bestScore = 85; bestField = 'name'; }
    // 4. 别名完全匹配
    else if (entry.aliases.some(a => a === q)) { bestScore = 80; bestField = 'alias'; }
    // 5. 别名前缀
    else if (entry.aliases.some(a => a.startsWith(q))) { bestScore = 75; bestField = 'alias'; }
    // 6. 别名包含
    else if (entry.aliases.some(a => a.includes(q))) { bestScore = 65; bestField = 'alias'; }
    // 7. 拼音全拼匹配(ewm → erweima 不一定,但 erweima 包含 q? 不一定)
    // 用户输入 "ewm" → initials "ewm" 完全匹配;输入 "erweima" → full "erweima" 完全匹配
    else if (entry.pinyinInitials === q) { bestScore = 78; bestField = 'pinyin'; }
    else if (entry.pinyinInitials.startsWith(q)) { bestScore = 73; bestField = 'pinyin'; }
    else if (entry.pinyinFull === q) { bestScore = 70; bestField = 'pinyin'; }
    else if (entry.pinyinFull.startsWith(q)) { bestScore = 65; bestField = 'pinyin'; }
    else if (entry.pinyinFull.includes(q)) { bestScore = 55; bestField = 'pinyin'; }
    // 8. 标签
    else if (tags.includes(q)) { bestScore = 60; bestField = 'tag'; }
    // 9. 描述
    else if (desc.includes(q)) { bestScore = 40; bestField = 'desc'; }
    // 10. 教程关键词
    else if (entry.tutorialKeywords.some(k => k.toLowerCase().includes(q))) { bestScore = 25; bestField = 'tutorial'; }
    // 11. 分类
    else if (category.includes(q)) { bestScore = 10; bestField = 'category'; }

    if (bestScore > 0) {
      results.push({ tool, score: bestScore, matchedField: bestField });
    }
  }

  // 按分数降序
  results.sort((a, b) => b.score - a.score);
  return results;
}

// 高亮匹配片段(返回带 <mark> 的 React 节点字符串)
// 这里返回字符数组,由调用方渲染
export function highlightMatch(text: string, query: string): { text: string; match: boolean }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [{ text, match: false }];

  const lower = text.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return [{ text, match: false }];

  return [
    { text: text.slice(0, idx), match: false },
    { text: text.slice(idx, idx + q.length), match: true },
    { text: text.slice(idx + q.length), match: false },
  ].filter(seg => seg.text.length > 0);
}

// 历史记录(localStorage,最多 5 个)
const HISTORY_KEY = 'momo-search-history';
const MAX_HISTORY = 5;

export function getSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.slice(0, MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

export function addSearchHistory(toolId: string) {
  try {
    const cur = getSearchHistory().filter(id => id !== toolId);
    cur.unshift(toolId);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(cur.slice(0, MAX_HISTORY)));
  } catch {}
}

export function clearSearchHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {}
}
