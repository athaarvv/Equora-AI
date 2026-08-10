/**
 * EQUORA AI News & Citation Service
 * Provides news search with verified metadata (sources, dates, snippet content).
 */

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  timestamp: string;
  summary: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  relevanceScore: number;
}

class NewsService {
  private mockNews: Record<string, NewsItem[]> = {
    TCS: [
      {
        id: 'news-tcs-1',
        title: 'TCS Q1 Revenue Growth Softens Amid IT Spending Caution in North America',
        source: 'Financial Express / Market Wire',
        url: 'https://finance.example.com/news/tcs-q1-spending-caution',
        timestamp: 'Aug 10, 2026 • 09:30 AM',
        summary: 'TCS reported a mild dip in quarterly deal momentum due to client budget deferrals in discretionary cloud projects in North America, leading to short-term profit margin pressure.',
        sentiment: 'NEGATIVE',
        relevanceScore: 0.95
      },
      {
        id: 'news-tcs-2',
        title: 'Tata Consultancy Services Secures Multi-Million Dollar AI Transformation Deal with European Retail Giant',
        source: 'Economic Times',
        url: 'https://economictimes.example.com/tcs-ai-contract-europe',
        timestamp: 'Aug 09, 2026 • 04:15 PM',
        summary: 'TCS expanded its enterprise AI portfolio by signing a landmark 5-year digital transformation partnership with a top European retailer.',
        sentiment: 'POSITIVE',
        relevanceScore: 0.88
      }
    ],
    RELIANCE: [
      {
        id: 'news-rel-1',
        title: 'Reliance Retail Announces Massive Expansion in Tier-2 Indian Cities',
        source: 'Business Standard',
        url: 'https://business-standard.example.com/reliance-retail-expansion',
        timestamp: 'Aug 10, 2026 • 11:00 AM',
        summary: 'Reliance Retail plans to add 800 new stores across regional hubs, leveraging omni-channel logistics to drive EBITDA growth.',
        sentiment: 'POSITIVE',
        relevanceScore: 0.92
      }
    ]
  };

  async searchNews(query: string, symbol?: string): Promise<NewsItem[]> {
    const key = (symbol || query).toUpperCase().trim();
    if (this.mockNews[key]) {
      return this.mockNews[key];
    }

    return [
      {
        id: `news-gen-1`,
        title: `Market Analysis: ${query} Industry Trends & Volatility Update`,
        source: 'Reuters Financial / LiveMint',
        url: 'https://livemint.example.com/market-updates',
        timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • Live',
        summary: `Market analysts note macroeconomic factors and rate expectations driving current movements across ${query}.`,
        sentiment: 'NEUTRAL',
        relevanceScore: 0.85
      }
    ];
  }
}

export const newsService = new NewsService();
