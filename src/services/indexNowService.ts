// IndexNow API Service
// Documentation: https://www.indexnow.org/documentation

const INDEXNOW_API_URL = 'https://api.indexnow.org/indexnow';
const INDEXNOW_KEY = '2154460b7be686baecf8f6f708feba8e';
const SITE_HOST = 'www.web-tools.top';

export interface IndexNowResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Submit a single URL to IndexNow
 */
export async function submitUrl(url: string): Promise<IndexNowResponse> {
  try {
    const response = await fetch(`${INDEXNOW_API_URL}?url=${encodeURIComponent(url)}&key=${INDEXNOW_KEY}`, {
      method: 'GET',
    });

    if (response.ok) {
      return { success: true, message: 'URL submitted successfully' };
    } else {
      const errorText = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Submit multiple URLs to IndexNow in batch
 */
export async function submitUrls(urls: string[]): Promise<IndexNowResponse> {
  try {
    const response = await fetch(INDEXNOW_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: SITE_HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });

    if (response.ok) {
      return { success: true, message: `${urls.length} URLs submitted successfully` };
    } else {
      const errorText = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Submit all tool pages to IndexNow
 */
export async function submitAllToolPages(): Promise<IndexNowResponse> {
  const { TOOLS } = await import('../constants');
  
  const toolUrls = TOOLS
    .filter(tool => !['about', 'privacy', 'disclaimer'].includes(tool.id))
    .map(tool => `https://${SITE_HOST}/tool/${tool.id}`);

  return submitUrls(toolUrls);
}

/**
 * Submit homepage to IndexNow
 */
export async function submitHomepage(): Promise<IndexNowResponse> {
  return submitUrl(`https://${SITE_HOST}/`);
}
