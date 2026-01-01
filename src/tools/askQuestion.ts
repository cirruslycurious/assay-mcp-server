import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { callCloudFunction } from '../firebase.js';

export const askQuestionTool: Tool = {
  name: 'ask_question',
  description: 'Ask a question about your document library. The tool searches your library (both private and public collections) for relevant documents and returns their summaries so Claude can synthesize an answer. This is perfect for exploratory questions like "What should I consider for automating Red Team exercises?"',
  inputSchema: {
    type: 'object',
    properties: {
      question: {
        type: 'string',
        description: 'The question to ask about your document library (e.g., "If I wanted to automate Red Team exercises, what should I consider?")',
      },
      maxDocuments: {
        type: 'number',
        description: 'Maximum number of documents to retrieve (default: 10)',
        default: 10,
      },
    },
    required: ['question'],
  },
};

export async function askQuestion(
  userId: string,
  question: string,
  token: string,
  maxDocuments: number = 10
): Promise<{
  synthesized?: boolean;
  content?: string; // Synthesized answer if synthesized=true
  rawData?: any; // Raw data if synthesized=false or for reference
  // Support old format for backward compatibility
  [key: string]: any;
}> {
  return await callCloudFunction('mcpAskQuestion', {
    question,
    maxDocuments,
  }, token);
}
