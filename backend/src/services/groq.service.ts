/**
 * EQUORA AI Groq Service
 * Provides Groq LLaMA 3.3 financial reasoning via Groq Cloud API.
 */

import axios from 'axios';
import { SYSTEM_PROMPT } from './gemini.service.js';

class GroqService {
  private model: string = 'llama-3.3-70b-versatile';

  public isAvailable(): boolean {
    const key = process.env.GROQ_API_KEY;
    return !!(key && key !== 'your_groq_api_key_here');
  }

  async generateAnswer(prompt: string, contextMessages: any[] = [], toolResults: any[] = []): Promise<string | null> {
    const key = process.env.GROQ_API_KEY;
    if (!this.isAvailable() || !key) return null;

    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...contextMessages.map(m => ({ role: m.role, content: m.content })),
        {
          role: 'user',
          content: `User Question: ${prompt}\n\nTool Execution Results: ${JSON.stringify(toolResults, null, 2)}`
        }
      ];

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 2048
        },
        {
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data && response.data.choices && response.data.choices[0]?.message?.content) {
        return response.data.choices[0].message.content;
      }
    } catch (err: any) {
      console.error('[Groq API Error]:', err?.response?.data || err?.message);
    }
    return null;
  }
}

export const groqService = new GroqService();
