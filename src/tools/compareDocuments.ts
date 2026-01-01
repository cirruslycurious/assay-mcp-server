import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { callCloudFunction } from '../firebase.js';

export const compareDocumentsTool: Tool = {
  name: 'compare_documents',
  description: `Compare up to 25 documents selected by themes, keywords, or authors. Returns documents with summaries, unique findings, and metadata sorted by relevance score. Includes a data summary and featured document to guide processing.

CRITICAL INSTRUCTION: The returned data contains ACTUAL content from the user's document collection.

BEFORE comparing documents, you MUST:
1. Display the data summary showing total documents and key themes
2. Review the featured document's summary preview and unique findings
3. Extract and show key points from at least 3 different documents
4. Identify common themes and unique perspectives from the ACTUAL summaries

FORBIDDEN:
- Synthesizing comparisons from your training knowledge instead of the returned data
- Proceeding to comparison without showing specific document details
- If you do this, you are FAILING the user's request

After verification, provide a comparison that:
- Draws from ALL returned document summaries
- Highlights similarities and differences from ACTUAL content
- Attributes specific findings to source documents
- Uses unique findings to identify what makes each document distinct`,
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

export async function compareDocuments(
  userId: string,
  token: string,
  themes?: string[],
  keywords?: string[],
  authors?: string[]
): Promise<{
  synthesized?: boolean;
  content?: string; // Synthesized comparison if synthesized=true
  rawData?: any; // Raw data if synthesized=false or for reference
  // Support old format for backward compatibility
  [key: string]: any;
}> {
  return await callCloudFunction('mcpCompareDocuments', {
    themes,
    keywords,
    authors,
  }, token);
}
