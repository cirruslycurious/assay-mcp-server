import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { callCloudFunction } from '../firebase.js';

export const searchByAuthorTool: Tool = {
  name: 'search_by_author',
  description: 'Search your Assay library (both private and public collections) by author name. Returns matching documents with their themes and metadata.',
  inputSchema: {
    type: 'object',
    properties: {
      authorName: {
        type: 'string',
        description: 'Author name to search for (e.g., "Brian Singer", "Anthropic", "OpenAI")',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return (default: 20)',
        default: 20,
      },
    },
    required: ['authorName'],
  },
};

export async function searchByAuthor(
  userId: string,
  authorName: string,
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
  return await callCloudFunction('mcpSearchByAuthor', {
    authorName,
    limit,
  }, token);
}
