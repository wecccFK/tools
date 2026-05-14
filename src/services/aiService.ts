// AI 服务 — 使用 OpenRouter 免费模型，无需 API Key

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
const FREE_MODELS = {
    gemini: 'google/gemini-pro:free',
    claude: 'anthropic/claude-3-haiku:free',
    llama: 'meta-llama/llama-3.1-8b-instruct:free'
};

async function chatWithOpenRouter(prompt: string, systemPrompt?: string, model: string = FREE_MODELS.gemini): Promise<string> {
    const messages: { role: string; content: string }[] = [];
    if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await fetch(OPENROUTER_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'MOMO Toolbox'
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
        throw new Error(error.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}

export async function chatComplete(prompt: string, systemPrompt?: string): Promise<string> {
    // 按优先级尝试不同免费模型
    try {
        return await chatWithOpenRouter(prompt, systemPrompt, FREE_MODELS.gemini);
    } catch (e) {
        console.log('Gemini free model failed, trying Llama:', e);
    }

    try {
        return await chatWithOpenRouter(prompt, systemPrompt, FREE_MODELS.llama);
    } catch (e) {
        console.error('All AI APIs failed:', e);
        throw new Error('AI service temporarily unavailable. Please try again later.');
    }
}

export function isAIServiceAvailable(): boolean {
    return true;
}