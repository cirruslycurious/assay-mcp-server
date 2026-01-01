import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { callCloudFunction } from '../firebase.js';

export const browseAllDocumentsTool: Tool = {
  name: 'browse_all_documents',
  description: 'Browse all documents in your Assay library (both private and public collections). Supports pagination and optional filtering by theme or author. Theme filter accepts theme ID (e.g., "CYBER_SECURITY.THREAT_MODELING"), theme label (e.g., "Threat Modeling"), or natural language (e.g., "threat modeling"). Use browse_themes first to discover available themes.',
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: 'Maximum number of results to return (default: 50)',
        default: 50,
      },
      offset: {
        type: 'number',
        description: 'Number of results to skip for pagination (default: 0)',
        default: 0,
      },
      themeFilter: {
        type: 'string',
        description: 'Optional theme filter - accepts theme ID (e.g., "CYBER_SECURITY.THREAT_MODELING"), theme label (e.g., "Threat Modeling"), or natural language. Uses fuzzy matching.',
      },
      authorFilter: {
        type: 'string',
        description: 'Optional author name to filter by',
      },
      visibilityFilter: {
        type: 'string',
        enum: ['public', 'private', 'all'],
        description: 'Filter by visibility (default: all)',
        default: 'all',
      },
    },
  },
};

export async function browseAllDocuments(
  userId: string,
  token: string,
  limit: number = 50,
  offset: number = 0,
  themeFilter?: string,
  authorFilter?: string,
  visibilityFilter: 'public' | 'private' | 'all' = 'all'
): Promise<{
  documents: Array<{
    documentId: string;
    title: string;
    authors: string[];
    createdAt: string;
    themes: string[];
    visibility: 'public' | 'private';
  }>;
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}> {
  return await callCloudFunction('mcpBrowseAllDocuments', {
    limit,
    offset,
    themeFilter,
    authorFilter,
    visibilityFilter,
  }, token);
}

