import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { callCloudFunction } from '../firebase.js';

export const searchByKeywordsTool: Tool = {
  name: 'search_by_keywords',
  description: 'Search your Assay library (both private and public collections) by keywords. Searches in document keywords, key concepts, and key phrases extracted from documents.',
  inputSchema: {
    type: 'object',
    properties: {
      keywords: {
        type: 'string',
        description: 'Keywords to search for (can be comma-separated or space-separated, e.g., "machine learning, neural networks" or "zero trust architecture")',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return (default: 20)',
        default: 20,
      },
    },
    required: ['keywords'],
  },
};

export async function searchByKeywords(
  userId: string,
  keywords: string,
  token: string,
  limit: number = 20
): Promise<{
  documents: Array<{
    documentId: string;
    title: string;
    authors: string[];
    createdAt: string;
    themes: string[];
    visibility: 'public' | 'private';
    score: number;
  }>;
  count: number;
  totalMatches: number;
}> {
  return await callCloudFunction('mcpSearchByKeywords', {
    keywords,
    limit,
  }, token);
}
