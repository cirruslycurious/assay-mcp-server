import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { callCloudFunction } from '../firebase.js';

export const searchDocumentsTool: Tool = {
  name: 'search_documents',
  description: 'Search your Assay library (both private and public collections) by theme name, author, or document title. Returns matching documents with full theme metadata including IDs (e.g., "CYBER_SECURITY.THREAT_MODELING") and labels (e.g., "Threat Modeling and Risk Analysis"). Theme queries use fuzzy matching - you can search by ID, label, or natural language.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query - can be a theme name (e.g., "AI Safety", "Zero Trust"), author name, or document title keywords',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return (default: 20)',
        default: 20,
      },
    },
    required: ['query'],
  },
};

export async function searchDocuments(
  userId: string,
  query: string,
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
}> {
  // Call Cloud Function instead of Firestore directly
  return await callCloudFunction('mcpSearchDocuments', {
    query,
    limit,
  }, token);
}
