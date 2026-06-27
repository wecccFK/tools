import { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

// Base64URL 解码（自动补齐 padding，转 UTF-8）
function b64urlDecode(str: string): string {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function prettyJson(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}

type Part = {
  raw: string;
  pretty: string;
};

export default function JwtDecoder() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [token, setToken] = useState('');
  const [copiedPart, setCopiedPart] = useState('');

  const result = useMemo(() => {
    const trimmed = token.trim();
    if (!trimmed) return null;
    const parts = trimmed.split('.');
    if (parts.length < 2) {
      return { error: isZh ? 'JWT 格式错误：应以 . 分隔成 3 段' : 'Invalid JWT: should have 3 dot-separated parts' };
    }
    try {
      const header: Part = { raw: parts[0], pretty: prettyJson(b64urlDecode(parts[0])) };
      const payload: Part = { raw: parts[1], pretty: prettyJson(b64urlDecode(parts[1])) };
      const signature = parts[2] || '';
      // 解析 payload 中的时间字段
      let expInfo: { expired: boolean; exp?: number } | null = null;
      try {
        const payloadObj = JSON.parse(b64urlDecode(parts[1]));
        if (typeof payloadObj.exp === 'number') {
          expInfo = { expired: Date.now() >= payloadObj.exp * 1000, exp: payloadObj.exp };
        }
      } catch {}
      return { header, payload, signature, expInfo, error: '' };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [token, isZh]);

  const copy = async (part: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedPart(part);
      setTimeout(() => setCopiedPart(''), 1200);
    } catch {}
  };

  const labelStyle = { color: 'var(--text-muted)' };
  const cardStyle = {
    background: 'var(--bg-3)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  };

  const sampleJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1vbW8iLCJpYXQiOjE2OTAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0.signature_placeholder';

  return (
    <div className="flex flex-col gap-4">
      {/* 输入 */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium" style={labelStyle}>
            {isZh ? 'JWT Token' : 'JWT Token'}
          </label>
          <button
            onClick={() => setToken(sampleJwt)}
            className="text-xs transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            {isZh ? '填入示例' : 'Sample'}
          </button>
        </div>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder={isZh ? '粘贴 JWT（eyJhbGci...）...' : 'Paste JWT (eyJhbGci...)...'}
          className="w-full h-24 rounded-lg p-3 font-mono text-xs outline-none resize-y break-all"
          style={cardStyle}
        />
      </div>

      {result && 'error' in result && result.error && (
        <div
          className="rounded-lg p-3 text-sm flex items-start gap-2"
          style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <span className="font-mono text-xs">{result.error}</span>
        </div>
      )}

      {result && !('error' in result) && (
        <div className="flex flex-col gap-3">
          {/* 过期状态 */}
          {result.expInfo && (
            <div
              className="rounded-lg p-2.5 flex items-center gap-2 text-sm"
              style={
                result.expInfo.expired
                  ? { background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)' }
                  : { background: 'rgba(22,163,74,0.1)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.2)' }
              }
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              {result.expInfo.expired
                ? isZh ? `已过期（exp: ${new Date(result.expInfo.exp! * 1000).toLocaleString()}）` : `Expired (exp: ${new Date(result.expInfo.exp! * 1000).toLocaleString()})`
                : isZh ? `有效（exp: ${new Date(result.expInfo.exp! * 1000).toLocaleString()}）` : `Valid (exp: ${new Date(result.expInfo.exp! * 1000).toLocaleString()})`}
            </div>
          )}

          {/* Header */}
          <div className="rounded-lg p-3" style={cardStyle}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                {isZh ? '头部 Header（红色，无需验证）' : 'Header'}
              </span>
              <button
                onClick={() => copy('header', result.header.pretty)}
                className="px-2 py-1 rounded text-xs transition-colors"
                style={{ background: 'var(--bg-2)', color: 'var(--text-muted)' }}
              >
                {copiedPart === 'header' ? (isZh ? '已复制' : 'Copied') : isZh ? '复制' : 'Copy'}
              </button>
            </div>
            <pre className="font-mono text-xs overflow-auto whitespace-pre-wrap">{result.header.pretty}</pre>
          </div>

          {/* Payload */}
          <div className="rounded-lg p-3" style={cardStyle}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>Payload</span>
              <button
                onClick={() => copy('payload', result.payload.pretty)}
                className="px-2 py-1 rounded text-xs transition-colors"
                style={{ background: 'var(--bg-2)', color: 'var(--text-muted)' }}
              >
                {copiedPart === 'payload' ? (isZh ? '已复制' : 'Copied') : isZh ? '复制' : 'Copy'}
              </button>
            </div>
            <pre className="font-mono text-xs overflow-auto whitespace-pre-wrap">{result.payload.pretty}</pre>
          </div>

          {/* Signature */}
          {result.signature && (
            <div className="rounded-lg p-3" style={cardStyle}>
              <span className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--accent)' }}>
                {isZh ? '签名 Signature' : 'Signature'}
              </span>
              <code className="font-mono text-xs break-all block" style={{ color: 'var(--text-muted)' }}>
                {result.signature}
              </code>
              <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
                {isZh ? '签名需在服务端用密钥验证，本工具仅解码不验证。' : 'Signature requires server-side verification with the secret key. This tool only decodes.'}
              </p>
            </div>
          )}
        </div>
      )}

      {!token && (
        <div
          className="rounded-lg p-6 text-center text-sm"
          style={{ background: 'var(--bg-3)', border: '1px dashed var(--border)', color: 'var(--text-muted)' }}
        >
          {isZh ? '粘贴 JWT Token 自动解码 Header 和 Payload' : 'Paste a JWT token to decode Header and Payload'}
        </div>
      )}
    </div>
  );
}
