import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { callCloudFunction } from '../firebase.js';

export const getLibraryInsightTool: Tool = {
  name: 'get_library_insight',
  description: 'Get the AI-generated personalized insight about your research profile. This insight analyzes your document collection and provides observations about your research focus and theme intersections.',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export async function getLibraryInsight(
  userId: string,
  token: string
): Promise<{
  insight: string;
  generatedAt: string | null;
}> {
  // Call Cloud Function instead of Firestore directly
  return await callCloudFunction('mcpGetLibraryInsight', {}, token);
}
