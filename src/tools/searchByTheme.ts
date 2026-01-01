import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { callCloudFunction } from '../firebase.js';

export const searchByThemeTool: Tool = {
  name: 'search_by_theme',
  description: 'Search your Assay library (both private and public collections) by theme. Accepts theme ID (e.g., "CYBER_SECURITY.THREAT_MODELING"), theme label (e.g., "Threat Modeling and Risk Analysis"), or natural language (e.g., "threat modeling"). Returns matching documents with full theme metadata including IDs and labels. Use browse_themes first to discover available themes.',
  inputSchema: {
    type: 'object',
    properties: {
      themeQuery: {
        type: 'string',
        description: 'Theme query - can be full theme ID (e.g., "CYBER_SECURITY.THREAT_MODELING"), theme label (e.g., "Threat Modeling and Risk Analysis"), or natural language (e.g., "threat modeling"). The tool uses fuzzy matching to find relevant themes.',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return (default: 20)',
        default: 20,
      },
    },
    required: ['themeQuery'],
  },
};

export async function searchByTheme(
  userId: string,
  themeQuery: string,
  token: string,
  limit: number = 20
): Promise<{
  documents: Array<{
    documentId: string;
    title: string;
    authors: string[];
    createdAt: string;
    themes: Array<{ id: string; label: string; level: 'L0' | 'L1'; parent_id?: string }>;
    themes_l0: string[];
    themes_l1: string[];
    visibility: 'public' | 'private';
  }>;
  count: number;
  totalMatches: number;
  matchedThemeIds: string[];
  matchedThemes: Array<{ id: string; label: string }>;
}> {
  return await callCloudFunction('mcpSearchByTheme', {
    themeQuery,
    limit,
  }, token);
}

