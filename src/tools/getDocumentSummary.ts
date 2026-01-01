import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { callCloudFunction } from '../firebase.js';

export const getDocumentSummaryTool: Tool = {
  name: 'get_document_summary',
  description: 'Get a specific summary (comprehensive, casual, or FAQ) for a document. Returns the summary text along with document metadata.',
  inputSchema: {
    type: 'object',
    properties: {
      documentId: {
        type: 'string',
        description: 'The document ID to get the summary for',
      },
      summaryType: {
        type: 'string',
        enum: ['comprehensive', 'casual', 'faq'],
        description: 'Which summary type to retrieve (default: comprehensive)',
        default: 'comprehensive',
      },
    },
    required: ['documentId'],
  },
};

export async function getDocumentSummary(
  userId: string,
  documentId: string,
  token: string,
  summaryType: 'comprehensive' | 'casual' | 'faq' = 'comprehensive'
): Promise<{
  documentId: string;
  title: string;
  authors: string[];
  summaryType: string;
  summary: string;
  themes: string[];
  createdAt: string;
}> {
  // Call Cloud Function instead of Firestore directly
  return await callCloudFunction('mcpGetDocumentSummary', {
    documentId,
    summaryType,
  }, token);
}
