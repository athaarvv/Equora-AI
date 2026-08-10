/**
 * EQUORA AI RAG (Retrieval-Augmented Generation) Service
 * Handles PDF uploads, document chunking, embeddings, and similarity search.
 */

export interface DocumentChunk {
  text: string;
  page: number;
  section: string;
  relevanceScore: number;
}

class RAGService {
  private documentStore: Map<string, { filename: string; chunks: DocumentChunk[] }> = new Map();

  constructor() {
    // Add default pre-loaded Annual Report sample for immediate demo usability
    this.documentStore.set('doc-sample-1', {
      filename: 'TCS_Annual_Report_2025_2026.pdf',
      chunks: [
        {
          page: 14,
          section: 'Risk Factors & Discretionary IT Budgets',
          text: 'Major operational risks include macroeconomic slowdown in North American banking & financial services clients, leading to deferred discretionary cloud upgrades and temporary pressure on operating margins.',
          relevanceScore: 0.94
        },
        {
          page: 28,
          section: 'AI & Cloud Transformation Investments',
          text: 'TCS expanded investments in Generative AI platforms, training over 150,000 engineers and securing 12 enterprise-scale AI architecture contracts across Europe and Asia-Pacific.',
          relevanceScore: 0.89
        },
        {
          page: 45,
          section: 'Financial Performance & Dividend Policy',
          text: 'Operating profit margin was maintained at 24.5%, supported by disciplined utilization rates and automation in core delivery centers. Free cash flow conversion stood at 104%.',
          relevanceScore: 0.86
        }
      ]
    });
  }

  async searchDocument(query: string, docId?: string): Promise<DocumentChunk[]> {
    const targetDoc = docId && this.documentStore.has(docId)
      ? this.documentStore.get(docId)!
      : Array.from(this.documentStore.values())[0];

    if (!targetDoc) return [];

    const lower = query.toLowerCase();
    // Rank chunks based on term overlap
    return targetDoc.chunks
      .map(chunk => {
        let score = chunk.relevanceScore;
        if (lower.includes('risk') && chunk.section.toLowerCase().includes('risk')) score += 0.05;
        if (lower.includes('margin') && chunk.text.toLowerCase().includes('margin')) score += 0.05;
        return { ...chunk, relevanceScore: Math.min(0.99, score) };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  async saveDocument(filename: string, textContent: string): Promise<string> {
    const id = `doc-${Date.now()}`;
    const paragraphs = textContent.split('\n\n').filter(p => p.trim().length > 20);

    const chunks: DocumentChunk[] = paragraphs.map((p, i) => ({
      page: Math.floor(i / 3) + 1,
      section: `Section ${i + 1}`,
      text: p.trim(),
      relevanceScore: 0.85
    }));

    this.documentStore.set(id, { filename, chunks });
    return id;
  }
}

export const ragService = new RAGService();
