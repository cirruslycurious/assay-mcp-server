# Quick Start Guide

## 1. Get Your Firebase Token

Open your browser console on [Assay](https://pdfsummaries.web.app) and run:

```javascript
firebase.auth().currentUser.getIdToken().then(token => {
  console.log('Token:', token);
  navigator.clipboard.writeText(token);
  console.log('Token copied to clipboard!');
});
```

## 2. Configure Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "assay": {
      "command": "node",
      "args": [
        "/Users/stephen/Documents/GitHub/assay-mcp-server/dist/index.js",
        "--token",
        "PASTE_YOUR_TOKEN_HERE"
      ]
    }
  }
}
```

## 3. Restart Claude Desktop

Quit and reopen Claude Desktop.

## 4. Test It!

In Claude, try:
- "Search my Assay library for documents about AI safety"
- "What documents do I have about governance?"
- "Find similar documents to [document-id]"

See [TESTING.md](./TESTING.md) for detailed instructions.

