import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { callCloudFunction } from '../firebase.js';

export const produceFaqTool: Tool = {
  name: 'produce_faq',
  description: `Generate FAQs from up to 25 documents selected by themes, keywords, or authors. Returns lightweight data (FAQs only, no comprehensive summaries) with a data summary, featured document, and unique findings per document.

CRITICAL INSTRUCTION: The returned data contains ACTUAL content from the user's document collection. 

BEFORE synthesizing your FAQ response, you MUST:
1. Display the data summary showing total documents and FAQ counts
2. Review the featured document's sample FAQs (provided inline)
3. Extract and show 3 diverse sample Q&A pairs from different documents
4. State which themes you identified from the ACTUAL questions

FORBIDDEN: 
- Synthesizing from your training knowledge instead of the returned data
- Proceeding to synthesis without showing samples
- If you do this, you are FAILING the user's request

After verification, synthesize a comprehensive FAQ that:
- Draws from ALL returned FAQs, not just samples shown
- Attributes specific findings to source documents
- Uses actual statistics/numbers from the data
- Incorporates unique findings highlighted in the data`,
  inputSchema: {
    type: 'object',
    properties: {
      themes: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of theme IDs to match (e.g., ["CYBERSECURITY", "ARTIFICIAL_INTELLIGENCE.AI_ARCHITECTURES"]). Use browse_themes to discover valid theme IDs.',
      },
      keywords: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of keywords to match',
      },
      authors: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of author names to match',
      },
    },
  },
};

export async function produceFaq(
  userId: string,
  token: string,
  themes?: string[],
  keywords?: string[],
  authors?: string[]
): Promise<{
  synthesized?: boolean;
  content?: string; // Synthesized FAQ if synthesized=true
  rawData?: {
    summary: {
      total_documents: number;
      total_faqs: number;
      key_themes: { [theme: string]: number };
      top_documents_by_faq_count: Array<{ title: string; faq_count: number }>;
    };
    featured_document: {
      title: string;
      authors: string[];
      why_featured: string;
      sample_faqs: Array<{ question: string; answer: string }>;
      unique_findings: string[];
    } | null;
    documents: Array<{
      documentId: string;
      title: string;
      authors: string[];
      themes: Array<{ id: string; label: string; level: 'L0' | 'L1'; parent_id?: string }>;
      faqs: Array<{ question: string; answer: string }>;
      unique_findings: string[];
      faq_count: number;
    }>;
    count: number;
    totalMatches: number;
  };
  // Support old format for backward compatibility
  [key: string]: any;
}> {
  return await callCloudFunction('mcpProduceFaq', {
    themes,
    keywords,
    authors,
  }, token);
}
