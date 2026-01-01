import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { callCloudFunction } from '../firebase.js';

export const getSimilarDocumentsTool: Tool = {
  name: 'get_similar_documents',
  description: 'Find documents similar to a given document using theme overlap (Jaccard similarity). Returns similar documents with similarity scores and explanation of why they matched.',
  inputSchema: {
    type: 'object',
    properties: {
      documentId: {
        type: 'string',
        description: 'The document ID to find similar documents for',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of similar documents to return (default: 10)',
        default: 10,
      },
    },
    required: ['documentId'],
  },
};

export async function getSimilarDocuments(
  userId: string,
  documentId: string,
  token: string,
  limit: number = 10
): Promise<{
  sourceDocument: {
    documentId: string;
    title: string;
    themes: { l1Themes: string[]; l0Themes: string[] };
  };
  similarDocuments: Array<{
    documentId: string;
    title: string;
    authors: string[];
    similarityScore: number;
    overlappingThemes: { l1Themes: string[]; l0Themes: string[] };
    createdAt: string;
    visibility: 'public' | 'private';
  }>;
}> {
  // Call Cloud Function instead of Firestore directly
  return await callCloudFunction('mcpGetSimilarDocuments', {
    documentId,
    limit,
  }, token);
}
