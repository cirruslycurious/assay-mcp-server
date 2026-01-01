import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { callCloudFunction } from '../firebase.js';

export const searchByTitleTool: Tool = {
  name: 'search_by_title',
  description: 'Search your Assay library (both private and public collections) by document title. Returns matching documents with their themes and metadata.',
  inputSchema: {
    type: 'object',
    properties: {
      titleQuery: {
        type: 'string',
        description: 'Title keywords to search for (e.g., "LLM safety", "red teaming", "zero trust")',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return (default: 20)',
        default: 20,
      },
    },
    required: ['titleQuery'],
  },
};

export async function searchByTitle(
  userId: string,
  titleQuery: string,
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
  }>;
  count: number;
  totalMatches: number;
}> {
  return await callCloudFunction('mcpSearchByTitle', {
    titleQuery,
    limit,
  }, token);
}
