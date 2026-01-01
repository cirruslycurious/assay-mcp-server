# Assay MCP Server

Connect Claude Desktop to your [Assay](https://assay.cirrusly-clever.com) document library. Search, explore, and extract knowledge from your research documents directly from Claude conversations.

## Overview

The Assay MCP Server provides Claude Desktop with access to your Assay document library through the Model Context Protocol (MCP). It enables Claude to:

- **Search** your library by themes, keywords, authors, and titles
- **Retrieve** document summaries (comprehensive, casual, and FAQs)
- **Discover** related documents using Jaccard similarity
- **Explore** themes and generate insights
- **Compare** documents and synthesize FAQs across multiple sources

All tools search both your **private** and **public** document collections, giving Claude access to your entire research library.

## Features

- 🔍 **13 powerful tools** for document exploration and analysis
- 🎯 **Jaccard similarity scoring** for intelligent document matching
- 🔐 **Secure authentication** via Firebase ID tokens
- 📊 **Theme-based organization** with 180+ canonical themes
- 🚀 **Zero GenAI costs** - tools only retrieve data, Claude does the synthesis (or optional server-side synthesis with your API key)
- 🌐 **Public + Private** - searches across both collections

## Installation

### Prerequisites

- Node.js 18+ 
- An Assay account ([sign up here](https://assay.cirrusly-clever.com))
- Claude Desktop installed

### Install from Source

```bash
git clone https://github.com/cirruslycurious/assay-mcp-server.git
cd assay-mcp-server
npm install
npm run build
```

### Global Installation (After Publishing)

```bash
npm install -g @assay/mcp-server
```

## Quick Start

**New to Assay MCP?** See the [Complete Setup Guide](./SETUP_GUIDE.md) for detailed instructions on:
- Getting your Firebase token
- Optional: Setting up server-side synthesis with Claude API key

## Getting Your Firebase Token

1. Visit [Assay Dashboard](https://assay.cirrusly-clever.com/dashboard)
2. Sign in with Google (if not already signed in)
3. Click the **"Get MCP Token"** button in the header
4. Copy the token from the dialog

**Note:** Tokens expire after 1 hour. Generate a new token when needed.

## Claude Desktop Configuration

Add the MCP server to your Claude Desktop configuration:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`  
**Linux:** `~/.config/Claude/claude_desktop_config.json`

### For Local Installation

```json
{
  "mcpServers": {
    "assay": {
      "command": "node",
      "args": [
        "/absolute/path/to/assay-mcp-server/dist/index.js",
        "--token",
        "YOUR_FIREBASE_TOKEN_HERE"
      ]
    }
  }
}
```

**Replace `/absolute/path/to/assay-mcp-server`** with your actual path, e.g.:
- macOS: `/Users/yourname/Documents/assay-mcp-server/dist/index.js`
- Linux: `/home/yourname/assay-mcp-server/dist/index.js`
- Windows: `C:\\Users\\yourname\\Documents\\assay-mcp-server\\dist\\index.js`

### For Global Installation

```json
{
  "mcpServers": {
    "assay": {
      "command": "assay-mcp-server",
      "args": ["--token", "YOUR_FIREBASE_TOKEN_HERE"]
    }
  }
}
```

### Using Environment Variable

```json
{
  "mcpServers": {
    "assay": {
      "command": "assay-mcp-server",
      "env": {
        "ASSAY_FIREBASE_TOKEN": "YOUR_FIREBASE_TOKEN_HERE",
        "CLAUDE_API_KEY": "YOUR_CLAUDE_API_KEY_HERE"
      }
    }
  }
}
```

**Optional Environment Variables:**
- `ASSAY_FUNCTIONS_BASE_URL` - Override Cloud Functions endpoint (default: `https://us-east4-pdfsummaries.cloudfunctions.net`)
- `FIREBASE_API_KEY` - Override Firebase Web API key for token verification (default: configured for Assay service)

**⚠️ Optional: Server-Side Synthesis**

Server-side synthesis is **optional**. The MCP server works great without it!

**Without API key (Default):**
- Tools return raw data from your collection
- Claude Desktop synthesizes responses using the retrieved data
- Zero additional costs - you're already using Claude Desktop

**With API key (Optional):**
- Tools can return pre-synthesized responses using Claude API
- Requires your own Anthropic API key (set spending limits for safety)
- Add `CLAUDE_API_KEY` to your config (see [Setup Guide](./SETUP_GUIDE.md))
- Falls back to raw data if API key is missing or invalid

**See the [Complete Setup Guide](./SETUP_GUIDE.md) for detailed instructions on optional server-side synthesis.**

After updating the config file, **restart Claude Desktop** to load the MCP server.

## Available Tools

### Search Tools

#### 1. `search_documents`
Search your library by theme name, author, or document title. Searches both private and public collections.

**Example prompts:**
- "Search for documents about AI safety"
- "Find papers on zero trust architecture"
- "Show me documents by Anthropic researchers"

#### 2. `search_by_author`
Search specifically by author name.

**Example prompts:**
- "Find all documents by Brian Singer"
- "Show me papers from OpenAI researchers"

#### 3. `search_by_title`
Search by document title keywords.

**Example prompts:**
- "Find documents with 'red team' in the title"
- "Search for papers titled 'LLM safety'"

#### 4. `search_by_keywords`
Search in document keywords, key concepts, and key phrases.

**Example prompts:**
- "Find documents about 'machine learning' and 'neural networks'"
- "Search for 'zero trust' and 'confidential computing'"

### Document Retrieval

#### 5. `get_document_summary`
Get comprehensive, casual, or FAQ summaries for a specific document.

**Parameters:**
- `documentId`: The document ID
- `summaryType`: `"comprehensive"`, `"casual"`, or `"faq"`

**Example prompts:**
- "Get the comprehensive summary of document abc123"
- "What's the casual summary for the governance paper?"
- "Show me FAQs for document xyz789"

#### 6. `get_similar_documents`
Find documents similar to a given document using Jaccard similarity based on theme overlap.

**Returns:** Similar documents with similarity scores (High ≥35%, Moderate ≥20%, Low <20%)

**Example prompts:**
- "What documents are similar to document abc123?"
- "Find related papers to the prompt injection document"

### Exploration Tools

#### 7. `browse_themes`
Browse the canonical theme taxonomy. Without a domain, returns all L0 domains with document counts. With a domain, returns L1 themes within that domain.

**Example prompts:**
- "What themes do I have documents in?"
- "Show me all themes under Cybersecurity"
- "Browse themes in the Artificial Intelligence domain"

#### 8. `get_library_insight`
Get your AI-generated personalized insight about your research profile.

**Example prompts:**
- "What does my document collection say about my research interests?"
- "Get my library insight"

### Advanced Analysis

#### 9. `ask_question`
Ask a question about your library. The tool searches for relevant documents and returns their summaries for Claude to synthesize an answer.

**With Claude API key:** Returns a synthesized answer (server-side).  
**Without API key:** Returns raw document summaries for Claude Desktop to synthesize.

**Example prompts:**
- "If I wanted to automate Red Team exercises, what should I consider?"
- "What are the key considerations for implementing zero trust?"
- "What do my documents say about AI safety frameworks?"

#### 10. `compare_documents`
Compare up to 25 documents selected by themes, keywords, or authors. Returns documents sorted by relevance score.

**With Claude API key:** Returns a synthesized comparison (server-side).  
**Without API key:** Returns raw document summaries for Claude Desktop to synthesize.

**Parameters:**
- `themes`: Array of theme IDs (e.g., `["CYBERSECURITY", "ARTIFICIAL_INTELLIGENCE.AI_ARCHITECTURES"]`)
- `keywords`: Array of keywords
- `authors`: Array of author names

**Example prompts:**
- "Compare documents about AI safety and cybersecurity"
- "Compare papers by Anthropic and OpenAI on AI alignment"

#### 11. `produce_faq`
Generate FAQs from up to 25 documents selected by themes, keywords, or authors.

**With Claude API key:** Returns a synthesized FAQ (server-side).  
**Without API key:** Returns raw document FAQs for Claude Desktop to synthesize.

**Parameters:** Same as `compare_documents`

**Example prompts:**
- "Generate FAQs about AI architectures and cybersecurity"
- "Create FAQs from documents about zero trust by these authors"

## How It Compares

The Assay MCP Server offers unique advantages over traditional RAG systems and file-based AI assistants:

| Feature | Assay MCP | Traditional RAG | ChatGPT with Files |
|---------|-----------|-----------------|-------------------|
| **Pre-processed summaries** | ✅ 3 formats (comprehensive, casual, FAQs) | ❌ Processes on-the-fly | ❌ Processes on-the-fly |
| **Theme-based organization** | ✅ 180 canonical themes | ❌ No structured taxonomy | ❌ No structured taxonomy |
| **Similarity algorithm** | ✅ Jaccard (theme overlap) | Vector embeddings | Vector embeddings |
| **Multi-format summaries** | ✅ Comprehensive, Casual, FAQs | Single format | Single format |
| **Cost per query** | ✅ $0 (Firestore only) | $0.01-0.10 (embeddings + LLM) | Included in subscription |
| **Conversational interface** | ✅ Via Claude Desktop | ✅ Via chat interface | ✅ Native |
| **Public + Private collections** | ✅ Both searchable | ❌ Single collection | ❌ Single collection |
| **Cross-document analysis** | ✅ Compare, synthesize FAQs | Limited | Limited |
| **Structured metadata** | ✅ Authors, dates, keywords | ❌ Unstructured | ❌ Unstructured |
| **No document storage** | ✅ Summaries only | ❌ Stores full documents | ❌ Stores full documents |

### Key Advantages

**1. Zero-cost queries**
- Traditional RAG requires embedding generation and LLM calls for every query
- Assay MCP only queries Firestore (no AI costs)
- Claude does the synthesis (you're already paying for Claude)

**2. Pre-processed intelligence**
- Documents are analyzed once during upload
- Multiple summary formats available instantly
- No waiting for processing during queries

**3. Structured discovery**
- 180 canonical themes enable precise filtering
- Jaccard similarity finds documents with shared research areas
- Not just keyword matching - semantic theme understanding

**4. Multi-collection access**
- Search both your private documents and public collection
- Discover research from other users
- Privacy-respecting (only shows what you have access to)

## How It Works

### Relevance Scoring

All tools use **Jaccard similarity** for relevance scoring:

- **Themes**: Weighted Jaccard (L1 themes = 0.8, L0 domains = 0.2)
- **Keywords**: Standard Jaccard similarity
- **Authors**: Standard Jaccard similarity
- **Combined**: Weighted average (themes = 0.6, keywords = 0.25, authors = 0.15)

**Similarity Levels:**
- **High**: ≥35% similarity
- **Moderate**: ≥20% similarity  
- **Low**: <20% similarity

### Data Flow

1. **Tool Call**: Claude calls an MCP tool with parameters
2. **Authentication**: Server verifies Firebase ID token
3. **Query**: Searches Firestore for matching documents
4. **Scoring**: Calculates Jaccard similarity scores
5. **Retrieval**: Fetches document summaries and metadata
6. **Return**: Structured JSON with documents and summaries
7. **Synthesis**: Claude uses the data to answer questions or generate insights

### Privacy & Security

- **Token-based authentication**: Each request requires a valid Firebase ID token
- **User-scoped queries**: Only returns documents the user has access to
- **Private + Public**: Searches both collections but respects visibility settings
- **No document storage**: Tools only retrieve summaries, not full document content

## Development

### Setup

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in development mode
npm run dev -- --token <your-token>
```

### Project Structure

```
assay-mcp-server/
├── src/
│   ├── index.ts              # Main MCP server entry point
│   ├── firebase.ts           # Firebase REST API integration (no Admin SDK needed!)
│   └── tools/                # Individual tool implementations
│       ├── searchDocuments.ts
│       ├── getDocumentSummary.ts
│       ├── getSimilarDocuments.ts
│       ├── searchByAuthor.ts
│       ├── searchByTitle.ts
│       ├── searchByKeywords.ts
│       ├── getLibraryInsight.ts
│       ├── browseThemes.ts
│       ├── askQuestion.ts
│       ├── compareDocuments.ts
│       ├── produceFaq.ts
│       └── scoringUtils.ts   # Shared scoring functions
├── dist/                     # Compiled JavaScript
└── package.json
```

### Adding New Tools

1. Create a new file in `src/tools/`
2. Export a `Tool` definition and implementation function
3. Import and register in `src/index.ts`
4. Rebuild: `npm run build`

## Troubleshooting

### Server Disconnects

- **Token expired**: Generate a new token from the Assay dashboard (tokens expire after 1 hour)
- **Invalid token**: Make sure you copied the full token without extra characters
- **Path issues**: Verify the absolute path in Claude Desktop config is correct

### No Results Returned

- **Check authentication**: Ensure you're signed in to Assay
- **Verify documents**: Make sure you have documents uploaded and processed
- **Check visibility**: Public documents are searchable, private documents only by owner

### Build Errors

- **Node version**: Ensure Node.js 18+ is installed
- **Dependencies**: Run `npm install` to ensure all packages are installed
- **TypeScript**: Check `tsconfig.json` is properly configured

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

## License

MIT License - see LICENSE file for details

## Links

- **Assay Web App**: https://assay.cirrusly-clever.com
- **MCP Documentation**: https://modelcontextprotocol.io

## Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Contact: support@cirrusly-clever.com

---

**Made with ❤️ by [Cirrusly Clever](https://cirrusly-clever.com)**
