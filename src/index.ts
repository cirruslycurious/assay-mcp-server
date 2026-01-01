#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { initializeFirebase, verifyToken } from './firebase.js';
import {
  searchDocumentsTool,
  searchDocuments,
} from './tools/searchDocuments.js';
import {
  getDocumentSummaryTool,
  getDocumentSummary,
} from './tools/getDocumentSummary.js';
import {
  getSimilarDocumentsTool,
  getSimilarDocuments,
} from './tools/getSimilarDocuments.js';
import {
  searchByAuthorTool,
  searchByAuthor,
} from './tools/searchByAuthor.js';
import {
  searchByTitleTool,
  searchByTitle,
} from './tools/searchByTitle.js';
import {
  searchByKeywordsTool,
  searchByKeywords,
} from './tools/searchByKeywords.js';
import {
  getLibraryInsightTool,
  getLibraryInsight,
} from './tools/getLibraryInsight.js';
import {
  browseThemesTool,
  browseThemes,
} from './tools/browseThemes.js';
import {
  askQuestionTool,
  askQuestion,
} from './tools/askQuestion.js';
import {
  compareDocumentsTool,
  compareDocuments,
} from './tools/compareDocuments.js';
import {
  produceFaqTool,
  produceFaq,
} from './tools/produceFaq.js';
import {
  browseAllDocumentsTool,
  browseAllDocuments,
} from './tools/browseAllDocuments.js';
import {
  searchByThemeTool,
  searchByTheme,
} from './tools/searchByTheme.js';

// Get token from command line args or environment
const token = process.argv.find((arg) => arg.startsWith('--token='))?.split('=')[1] ||
              process.env.ASSAY_FIREBASE_TOKEN ||
              process.argv[process.argv.indexOf('--token') + 1];

if (!token) {
  console.error('Error: Firebase token required');
  console.error('Usage: assay-mcp-server --token <firebase-token>');
  console.error('   or: ASSAY_FIREBASE_TOKEN=<token> assay-mcp-server');
  process.exit(1);
}

// Initialize Firebase
initializeFirebase();

// Verify token and get user ID
let userId: string;
let userEmail: string | undefined;

// Create MCP server
const server = new Server(
  {
    name: 'assay-mcp-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      searchDocumentsTool,
      getDocumentSummaryTool,
      getSimilarDocumentsTool,
      getLibraryInsightTool,
      browseAllDocumentsTool,
      searchByAuthorTool,
      searchByTitleTool,
      searchByKeywordsTool,
      browseThemesTool,
      askQuestionTool,
      compareDocumentsTool,
      produceFaqTool,
      searchByThemeTool,
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  console.error(`[MCP] Tool call received: ${name}`, JSON.stringify(args, null, 2));

  try {
    // Ensure user is authenticated
    if (!userId) {
      // Try to verify token
      try {
        const decoded = await verifyToken(token);
        userId = decoded.uid;
        userEmail = decoded.email;
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: Token verification failed. Please get a new token from the Assay dashboard. Token expires after 1 hour. Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }

    switch (name) {
      case 'search_documents': {
        const query = args?.query as string;
        const limit = (args?.limit as number) || 20;
        const result = await searchDocuments(userId, query, token, limit);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_document_summary': {
        const documentId = args?.documentId as string;
        const summaryType = (args?.summaryType as 'comprehensive' | 'casual' | 'faq') || 'comprehensive';
        const result = await getDocumentSummary(userId, documentId, token, summaryType);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_similar_documents': {
        const documentId = args?.documentId as string;
        const limit = (args?.limit as number) || 10;
        const result = await getSimilarDocuments(userId, documentId, token, limit);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_library_insight': {
        const result = await getLibraryInsight(userId, token);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'browse_all_documents': {
        const limit = (args?.limit as number) || 50;
        const offset = (args?.offset as number) || 0;
        const themeFilter = args?.themeFilter as string | undefined;
        const authorFilter = args?.authorFilter as string | undefined;
        const visibilityFilter = (args?.visibilityFilter as 'public' | 'private' | 'all') || 'all';
        const result = await browseAllDocuments(userId, token, limit, offset, themeFilter, authorFilter, visibilityFilter);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'search_by_author': {
        const authorName = args?.authorName as string;
        const limit = (args?.limit as number) || 20;
        const result = await searchByAuthor(userId, authorName, token, limit);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'search_by_title': {
        const titleQuery = args?.titleQuery as string;
        const limit = (args?.limit as number) || 20;
        const result = await searchByTitle(userId, titleQuery, token, limit);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'search_by_keywords': {
        const keywords = args?.keywords as string;
        const limit = (args?.limit as number) || 20;
        const result = await searchByKeywords(userId, keywords, token, limit);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'browse_themes': {
        const domain = args?.domain as string | undefined;
        const result = await browseThemes(userId, token, domain);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'ask_question': {
        const question = args?.question as string;
        const maxDocuments = (args?.maxDocuments as number) || 10;
        const result = await askQuestion(userId, question, token, maxDocuments);
        
        // Handle synthesized vs raw data response
        if (result.synthesized && result.content) {
          return {
            content: [
              {
                type: 'text',
                text: `**Answer (Server-side with Assay Skill):**\n\n${result.content}\n\n---\n\n*Based on ${result.rawData?.count || 0} documents from your collection. Raw data available for reference.*`,
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result.rawData || result, null, 2),
              },
            ],
          };
        }
      }

      case 'compare_documents': {
        const themes = args?.themes as string[] | undefined;
        const keywords = args?.keywords as string[] | undefined;
        const authors = args?.authors as string[] | undefined;
        const result = await compareDocuments(userId, token, themes, keywords, authors);
        
        // Handle synthesized vs raw data response
        if (result.synthesized && result.content) {
          return {
            content: [
              {
                type: 'text',
                text: `**Synthesized Comparison (Server-side with Assay Skill):**\n\n${result.content}\n\n---\n\n*Raw data available for reference if needed. Total: ${result.rawData?.count || 0} documents.*`,
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result.rawData || result, null, 2),
              },
            ],
          };
        }
      }

      case 'produce_faq': {
        const themes = args?.themes as string[] | undefined;
        const keywords = args?.keywords as string[] | undefined;
        const authors = args?.authors as string[] | undefined;
        const result = await produceFaq(userId, token, themes, keywords, authors);
        
        // Handle synthesized vs raw data response
        if (result.synthesized && result.content) {
          // Return synthesized content with raw data available
          return {
            content: [
              {
                type: 'text',
                text: `**Synthesized FAQ (Server-side with Assay Skill):**\n\n${result.content}\n\n---\n\n*Raw data available for reference if needed. Total: ${result.rawData?.count || 0} documents, ${result.rawData?.summary?.total_faqs || 0} FAQs.*`,
              },
            ],
          };
        } else {
          // Return raw data (current behavior)
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result.rawData || result, null, 2),
              },
            ],
          };
        }
      }

      case 'search_by_theme': {
        const themeQuery = args?.themeQuery;
        if (!themeQuery || typeof themeQuery !== 'string') {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Invalid input: themeQuery must be a non-empty string',
                  received: themeQuery,
                  type: typeof themeQuery,
                }, null, 2),
              },
            ],
            isError: true,
          };
        }
        const limit = (args?.limit as number) || 20;
        const result = await searchByTheme(userId, themeQuery, token, limit);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  try {
    // Verify token before starting server
    try {
      const decoded = await verifyToken(token);
      userId = decoded.uid;
      userEmail = decoded.email;
      console.error(`Assay MCP Server: Authenticated as ${userEmail || userId}`);
    } catch (error) {
      console.error('Error: Invalid Firebase token');
      console.error('Token may be expired. Please get a new token from the Assay dashboard.');
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }

    // Start the server only after token is verified
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Assay MCP Server running on stdio');
    
    // Keep the process alive
    process.on('SIGINT', () => {
      console.error('Shutting down...');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.error('Shutting down...');
      process.exit(0);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

