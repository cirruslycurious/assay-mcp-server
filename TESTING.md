# Testing the Assay MCP Server Locally

## Step 1: Install the MCP Server

From the `assay-mcp-server` directory:

```bash
cd /Users/stephen/Documents/GitHub/assay-mcp-server
npm install
npm run build
```

## Step 2: Get Your Firebase Token

### Option A: From Browser Console (Easiest)

1. Go to [Assay](https://pdfsummaries.web.app) in your browser
2. Sign in with Google
3. Open Developer Console (F12 or Cmd+Option+I)
4. Go to Console tab
5. Run this command:
   ```javascript
   firebase.auth().currentUser.getIdToken().then(token => {
     console.log('Your token:', token);
     navigator.clipboard.writeText(token).then(() => {
       console.log('Token copied to clipboard!');
     });
   });
   ```
6. Copy the token (it's also copied to your clipboard)

### Option B: From Assay Web App (If we add a button)

(Coming soon - we can add a "Get MCP Token" button to the dashboard)

## Step 3: Test the Server Manually

First, let's make sure it runs:

```bash
cd /Users/stephen/Documents/GitHub/assay-mcp-server
node dist/index.js --token YOUR_TOKEN_HERE
```

You should see:
```
Assay MCP Server: Authenticated as your-email@example.com
Assay MCP Server running on stdio
```

If you see this, the server is working! Press Ctrl+C to stop.

## Step 4: Configure Claude Desktop

### Find Your Claude Desktop Config File

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

### Edit the Config File

Open the file (create it if it doesn't exist) and add:

```json
{
  "mcpServers": {
    "assay": {
      "command": "node",
      "args": [
        "/Users/stephen/Documents/GitHub/assay-mcp-server/dist/index.js",
        "--token",
        "YOUR_FIREBASE_TOKEN_HERE"
      ]
    }
  }
}
```

**Important:** Replace `YOUR_FIREBASE_TOKEN_HERE` with your actual Firebase token from Step 2.

### Alternative: Use Environment Variable

If you prefer to keep the token out of the config file:

1. Create a file `~/.assay-mcp-token` with just your token:
   ```bash
   echo "YOUR_TOKEN_HERE" > ~/.assay-mcp-token
   chmod 600 ~/.assay-mcp-token
   ```

2. Update Claude Desktop config:
   ```json
   {
     "mcpServers": {
       "assay": {
         "command": "node",
         "args": [
           "/Users/stephen/Documents/GitHub/assay-mcp-server/dist/index.js",
           "--token",
           "$(cat ~/.assay-mcp-token)"
         ]
       }
     }
   }
   ```

   **Note:** This might not work on all systems. The simpler approach is to put the token directly in the config.

## Step 5: Restart Claude Desktop

1. Quit Claude Desktop completely
2. Reopen Claude Desktop
3. Check the MCP connection status (usually shown in the UI or logs)

## Step 6: Test in Claude

Try these prompts in Claude:

1. **Search:**
   - "Search my Assay library for documents about AI safety"
   - "Find documents by Anthropic researchers"
   - "Show me documents on governance frameworks"

2. **Get Summary:**
   - "Get the comprehensive summary of document [document-id]"
   - "What's the casual summary of [document-id]?"
   - "Show me FAQs for [document-id]"

3. **Find Similar:**
   - "What documents are similar to [document-id]?"
   - "Find related documents to [document-id]"

## Troubleshooting

### "Command not found" or "node not found"

Make sure Node.js is in your PATH. Check:
```bash
which node
node --version
```

If not found, you may need to use the full path to node:
```json
{
  "mcpServers": {
    "assay": {
      "command": "/usr/local/bin/node",
      "args": [...]
    }
  }
}
```

### "Invalid Firebase token"

- Token expires after 1 hour
- Get a new token from Step 2
- Update the config file
- Restart Claude Desktop

### "Document not found" or "does not belong to you"

- Make sure you're signed into Assay with the same Google account
- Verify the document exists in your Assay library
- Check that the document status is "completed"

### Server not connecting

1. Test the server manually (Step 3) to see if it runs
2. Check Claude Desktop logs for errors
3. Verify the path to `dist/index.js` is correct
4. Make sure you restarted Claude Desktop after editing the config

## Next Steps

Once it's working:
- Try different search queries
- Test all three tools
- See how Claude uses the tools in conversation
- Consider adding more tools (browse_themes, get_library_insight)

