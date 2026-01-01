import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { callCloudFunction } from '../firebase.js';

export const browseThemesTool: Tool = {
  name: 'browse_themes',
  description: 'Browse the canonical theme taxonomy. If no domain is specified, returns all L0 domains (e.g., "CYBER_SECURITY", "ARTIFICIAL_INTELLIGENCE") with document counts and match patterns. If a domain is specified, returns all L1 themes (e.g., "CYBER_SECURITY.THREAT_MODELING") within that domain with document counts and match patterns. Each theme includes its full ID, label, and suggested match patterns to help you use the correct format in other tools. Searches both private and public collections.',
  inputSchema: {
    type: 'object',
    properties: {
      domain: {
        type: 'string',
        description: 'Optional L0 domain ID to browse (e.g., "ARTIFICIAL_INTELLIGENCE", "CYBERSECURITY"). If not provided, returns all L0 domains.',
      },
    },
  },
};

export async function browseThemes(
  userId: string,
  token: string,
  domain?: string
): Promise<{
  domains?: Array<{
    id: string;
    label: string;
    count: number;
  }>;
  domain?: {
    id: string;
    label: string;
  };
  l1Themes?: Array<{
    id: string;
    label: string;
    count: number;
  }>;
}> {
  return await callCloudFunction('mcpBrowseThemes', {
    domain,
  }, token);
}
