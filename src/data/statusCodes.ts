// HTTP 状态码数据(中英双语)
// 数据源:RFC 9110 + 常见扩展状态码

export interface StatusCode {
  code: number;
  category: '1xx' | '2xx' | '3xx' | '4xx' | '5xx';
  name: { zh: string; en: string };
  description: { zh: string; en: string };
}

export const STATUS_CODES: StatusCode[] = [
  // 1xx Informational
  { code: 100, category: '1xx', name: { zh: '继续', en: 'Continue' }, description: { zh: '服务器已收到请求头,客户端应继续发送请求体。', en: 'Server received request headers; client should send request body.' } },
  { code: 101, category: '1xx', name: { zh: '切换协议', en: 'Switching Protocols' }, description: { zh: '服务器同意切换协议,常用于 WebSocket 升级。', en: 'Server agrees to switch protocols, commonly used for WebSocket upgrade.' } },
  { code: 102, category: '1xx', name: { zh: '处理中', en: 'Processing' }, description: { zh: '服务器已收到请求但仍未完成处理(WebDAV)。', en: 'Server received the request but has not yet completed it (WebDAV).' } },
  { code: 103, category: '1xx', name: { zh: '早期提示', en: 'Early Hints' }, description: { zh: '服务器提示客户端在最终响应前预加载资源。', en: 'Server hints the client to preload resources before the final response.' } },

  // 2xx Success
  { code: 200, category: '2xx', name: { zh: '成功', en: 'OK' }, description: { zh: '请求成功。最常见状态码,GET/POST 成功返回。', en: 'Request succeeded. The most common status code for successful GET/POST.' } },
  { code: 201, category: '2xx', name: { zh: '已创建', en: 'Created' }, description: { zh: '请求成功并创建了新资源,常用于 POST/PUT 创建。', en: 'Request succeeded and a new resource was created, typical for POST/PUT.' } },
  { code: 202, category: '2xx', name: { zh: '已接受', en: 'Accepted' }, description: { zh: '请求已接收但尚未处理完成,常用于异步任务。', en: 'Request accepted but not yet processed, typical for async tasks.' } },
  { code: 203, category: '2xx', name: { zh: '非权威信息', en: 'Non-Authoritative Information' }, description: { zh: '返回的信息来自第三方而非原始服务器。', en: 'Returned information comes from a third party, not the origin server.' } },
  { code: 204, category: '2xx', name: { zh: '无内容', en: 'No Content' }, description: { zh: '请求成功但无内容返回,常用于 DELETE/PUT 成功。', en: 'Request succeeded with no content returned, typical for DELETE/PUT.' } },
  { code: 205, category: '2xx', name: { zh: '重置内容', en: 'Reset Content' }, description: { zh: '要求客户端重置视图(清空表单等)。', en: 'Asks the client to reset the view (e.g., clear forms).' } },
  { code: 206, category: '2xx', name: { zh: '部分内容', en: 'Partial Content' }, description: { zh: '服务器返回部分内容,常用于 Range 请求(断点续传/视频流)。', en: 'Server returns partial content, typical for Range requests (resume/video streaming).' } },
  { code: 207, category: '2xx', name: { zh: '多状态', en: 'Multi-Status' }, description: { zh: 'WebDAV 扩展,响应体包含多个独立状态。', en: 'WebDAV extension; response body contains multiple independent statuses.' } },
  { code: 226, category: '2xx', name: { zh: 'IM 已使用', en: 'IM Used' }, description: { zh: '服务器已完成 GET 请求并应用了实例操作。', en: 'Server fulfilled a GET request and applied instance manipulations.' } },

  // 3xx Redirection
  { code: 300, category: '3xx', name: { zh: '多选择', en: 'Multiple Choices' }, description: { zh: '请求的资源有多个表示,客户端可选择其一。', en: 'Resource has multiple representations; client can pick one.' } },
  { code: 301, category: '3xx', name: { zh: '永久重定向', en: 'Moved Permanently' }, description: { zh: '资源已永久迁移到新 URI,SEO 权重转移。', en: 'Resource moved permanently to a new URI; SEO juice transferred.' } },
  { code: 302, category: '3xx', name: { zh: '临时重定向', en: 'Found' }, description: { zh: '资源临时在另一 URI,后续请求仍用原 URI。', en: 'Resource temporarily at another URI; future requests use the original URI.' } },
  { code: 303, category: '3xx', name: { zh: '查看其他', en: 'See Other' }, description: { zh: '要求用 GET 访问另一个 URI,常用于 POST 后跳转。', en: 'Asks to GET another URI, typical for post-POST redirects.' } },
  { code: 304, category: '3xx', name: { zh: '未修改', en: 'Not Modified' }, description: { zh: '资源未修改,客户端可用缓存版本(条件请求)。', en: 'Resource not modified; client can use cached version (conditional request).' } },
  { code: 305, category: '3xx', name: { zh: '使用代理', en: 'Use Proxy' }, description: { zh: '已弃用,原要求通过代理访问。', en: 'Deprecated; originally required access via a proxy.' } },
  { code: 307, category: '3xx', name: { zh: '临时重定向(保留方法)', en: 'Temporary Redirect' }, description: { zh: '与 302 类似但保留原请求方法(POST 不变 GET)。', en: 'Like 302 but preserves the original method (POST stays POST).' } },
  { code: 308, category: '3xx', name: { zh: '永久重定向(保留方法)', en: 'Permanent Redirect' }, description: { zh: '与 301 类似但保留原请求方法。', en: 'Like 301 but preserves the original request method.' } },

  // 4xx Client Error
  { code: 400, category: '4xx', name: { zh: '请求错误', en: 'Bad Request' }, description: { zh: '请求语法错误,服务器无法理解。常见于参数错误。', en: 'Malformed request syntax; server cannot understand. Common for parameter errors.' } },
  { code: 401, category: '4xx', name: { zh: '未授权', en: 'Unauthorized' }, description: { zh: '需要身份验证。响应应包含 WWW-Authenticate 头。', en: 'Authentication required. Response should include WWW-Authenticate header.' } },
  { code: 402, category: '4xx', name: { zh: '需要付款', en: 'Payment Required' }, description: { zh: '保留供未来使用,常被用于付费墙。', en: 'Reserved for future use; commonly repurposed for paywalls.' } },
  { code: 403, category: '4xx', name: { zh: '禁止访问', en: 'Forbidden' }, description: { zh: '服务器拒绝请求。与 401 区别:身份已验证但无权限。', en: 'Server refused the request. Differs from 401: identity verified but no permission.' } },
  { code: 404, category: '4xx', name: { zh: '未找到', en: 'Not Found' }, description: { zh: '服务器找不到请求的资源。最常见错误码。', en: 'Server cannot find the requested resource. The most common error code.' } },
  { code: 405, category: '4xx', name: { zh: '方法不允许', en: 'Method Not Allowed' }, description: { zh: '请求方法不被允许(如对只读资源 POST)。', en: 'Request method not allowed (e.g., POST on a read-only resource).' } },
  { code: 406, category: '4xx', name: { zh: '不可接受', en: 'Not Acceptable' }, description: { zh: '请求的资源无法生成客户端 Accept 头接受的格式。', en: 'Resource cannot generate a format matching the Accept header.' } },
  { code: 407, category: '4xx', name: { zh: '需要代理认证', en: 'Proxy Authentication Required' }, description: { zh: '需要先通过代理服务器的身份验证。', en: 'Client must authenticate with a proxy first.' } },
  { code: 408, category: '4xx', name: { zh: '请求超时', en: 'Request Timeout' }, description: { zh: '客户端未在服务器等待时间内发送请求。', en: 'Client did not send a request within the server timeout.' } },
  { code: 409, category: '4xx', name: { zh: '冲突', en: 'Conflict' }, description: { zh: '请求与服务器当前状态冲突,常用于并发更新。', en: 'Request conflicts with current server state, common for concurrent updates.' } },
  { code: 410, category: '4xx', name: { zh: '已删除', en: 'Gone' }, description: { zh: '资源已永久删除,与 404 区别是明确的删除状态。', en: 'Resource permanently removed; unlike 404 it indicates intentional deletion.' } },
  { code: 411, category: '4xx', name: { zh: '需要长度', en: 'Length Required' }, description: { zh: '请求必须包含 Content-Length 头。', en: 'Request must include a Content-Length header.' } },
  { code: 412, category: '4xx', name: { zh: '前置条件失败', en: 'Precondition Failed' }, description: { zh: 'If-Match/If-Unmodified-Since 条件不满足。', en: 'If-Match/If-Unmodified-Since precondition failed.' } },
  { code: 413, category: '4xx', name: { zh: '实体过大', en: 'Payload Too Large' }, description: { zh: '请求体超过服务器允许的大小限制。', en: 'Request body exceeds the server size limit.' } },
  { code: 414, category: '4xx', name: { zh: 'URI 过长', en: 'URI Too Long' }, description: { zh: '请求的 URI 超过服务器允许长度。', en: 'Request URI exceeds the server length limit.' } },
  { code: 415, category: '4xx', name: { zh: '不支持的媒体类型', en: 'Unsupported Media Type' }, description: { zh: '请求的 Content-Type 不被服务器支持。', en: 'Request Content-Type is not supported by the server.' } },
  { code: 416, category: '4xx', name: { zh: '范围不可满足', en: 'Range Not Satisfiable' }, description: { zh: 'Range 请求的范围超出资源大小。', en: 'Range request exceeds the resource size.' } },
  { code: 417, category: '4xx', name: { zh: '期望失败', en: 'Expectation Failed' }, description: { zh: 'Expect 头字段不满足。', en: 'Expect header field could not be met.' } },
  { code: 418, category: '4xx', name: { zh: '我是个茶壶', en: "I'm a Teapot" }, description: { zh: '愚人节玩笑状态码,服务器拒绝煮茶因为它是茶壶。', en: 'April Fools joke; server refuses to brew tea because it is a teapot.' } },
  { code: 421, category: '4xx', name: { zh: '请求错误路由', en: 'Misdirected Request' }, description: { zh: '请求发到了不能响应的服务器(HTTP/2)。', en: 'Request sent to a server that cannot respond (HTTP/2).' } },
  { code: 422, category: '4xx', name: { zh: '不可处理的实体', en: 'Unprocessable Entity' }, description: { zh: '语法正确但语义错误,常用于校验失败(WebDAV)。', en: 'Syntactically correct but semantically wrong, common for validation errors (WebDAV).' } },
  { code: 423, category: '4xx', name: { zh: '已锁定', en: 'Locked' }, description: { zh: '资源被锁定(WebDAV)。', en: 'Resource is locked (WebDAV).' } },
  { code: 424, category: '4xx', name: { zh: '依赖失败', en: 'Failed Dependency' }, description: { zh: '前置请求失败导致本次失败(WebDAV)。', en: 'Prior request failed causing this one to fail (WebDAV).' } },
  { code: 425, category: '4xx', name: { zh: '过早', en: 'Too Early' }, description: { zh: '服务器拒绝在 TLS 重放窗口内处理请求。', en: 'Server refuses to process within the TLS replay window.' } },
  { code: 426, category: '4xx', name: { zh: '需要升级协议', en: 'Upgrade Required' }, description: { zh: '客户端需切换到 TLS/1.1 等更高协议。', en: 'Client must switch to a higher protocol like TLS/1.1.' } },
  { code: 428, category: '4xx', name: { zh: '需要前置条件', en: 'Precondition Required' }, description: { zh: '服务器要求带 If-Match 等条件头避免丢失更新。', en: 'Server requires If-Match etc. to prevent lost updates.' } },
  { code: 429, category: '4xx', name: { zh: '请求过多', en: 'Too Many Requests' }, description: { zh: '请求频率超过限制(限流)。响应应有 Retry-After。', en: 'Rate limit exceeded. Response should include Retry-After.' } },
  { code: 431, category: '4xx', name: { zh: '请求头字段过大', en: 'Request Header Fields Too Large' }, description: { zh: '请求头总大小或单个字段超过限制。', en: 'Header total size or a single field exceeds the limit.' } },
  { code: 451, category: '4xx', name: { zh: '因法律原因不可用', en: 'Unavailable For Legal Reasons' }, description: { zh: '因法律要求(如版权、政府审查)拒绝提供资源。', en: 'Refused for legal reasons (e.g., copyright, government censorship).' } },

  // 5xx Server Error
  { code: 500, category: '5xx', name: { zh: '服务器内部错误', en: 'Internal Server Error' }, description: { zh: '服务器遇到意外错误。最常见的服务器错误码。', en: 'Server encountered an unexpected error. The most common server error code.' } },
  { code: 501, category: '5xx', name: { zh: '未实现', en: 'Not Implemented' }, description: { zh: '服务器不支持请求的方法。', en: 'Server does not support the request method.' } },
  { code: 502, category: '5xx', name: { zh: '网关错误', en: 'Bad Gateway' }, description: { zh: '网关/代理从上游收到无效响应。', en: 'Gateway/proxy received an invalid response from upstream.' } },
  { code: 503, category: '5xx', name: { zh: '服务不可用', en: 'Service Unavailable' }, description: { zh: '服务器暂不可用(过载或维护)。响应应有 Retry-After。', en: 'Server temporarily unavailable (overloaded or maintenance). Should include Retry-After.' } },
  { code: 504, category: '5xx', name: { zh: '网关超时', en: 'Gateway Timeout' }, description: { zh: '网关/代理等待上游响应超时。', en: 'Gateway/proxy timed out waiting for upstream response.' } },
  { code: 505, category: '5xx', name: { zh: 'HTTP 版本不支持', en: 'HTTP Version Not Supported' }, description: { zh: '服务器不支持请求的 HTTP 版本。', en: 'Server does not support the HTTP version used in the request.' } },
  { code: 506, category: '5xx', name: { zh: '变体协商异常', en: 'Variant Also Negotiates' }, description: { zh: '透明内容协商配置错误。', en: 'Transparent content negotiation misconfiguration.' } },
  { code: 507, category: '5xx', name: { zh: '存储不足', en: 'Insufficient Storage' }, description: { zh: '服务器存储空间不足无法完成请求(WebDAV)。', en: 'Server lacks storage to complete the request (WebDAV).' } },
  { code: 508, category: '5xx', name: { zh: '检测到循环', en: 'Loop Detected' }, description: { zh: '处理请求时检测到无限循环(WebDAV)。', en: 'Infinite loop detected while processing the request (WebDAV).' } },
  { code: 510, category: '5xx', name: { zh: '未扩展', en: 'Not Extended' }, description: { zh: '需要进一步扩展才能完成请求。', en: 'Further extensions are required to fulfill the request.' } },
  { code: 511, category: '5xx', name: { zh: '需要网络认证', en: 'Network Authentication Required' }, description: { zh: '需要先登录网络(如公共 WiFi 网关)。', en: 'Network login required first (e.g., public WiFi captive portal).' } },
];

export const CATEGORY_LABELS: Record<StatusCode['category'], { zh: string; en: string; color: string }> = {
  '1xx': { zh: '信息响应', en: 'Informational', color: '#3b82f6' },
  '2xx': { zh: '成功响应', en: 'Success', color: '#22c55e' },
  '3xx': { zh: '重定向', en: 'Redirection', color: '#f59e0b' },
  '4xx': { zh: '客户端错误', en: 'Client Error', color: '#ef4444' },
  '5xx': { zh: '服务器错误', en: 'Server Error', color: '#a855f7' },
};
