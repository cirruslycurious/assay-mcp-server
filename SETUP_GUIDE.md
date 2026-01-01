# Complete Setup Guide for Assay MCP Server

This guide walks you through setting up the Assay MCP Server with server-side synthesis using Claude API and the Assay Skill.

## Overview

You'll need **two tokens**:
1. **Firebase Token** - Authenticates with Assay (expires after 1 hour)
2. **Claude API Key** - For server-side synthesis (your own Anthropic API key)

## Step 1: Get Your Firebase Token

1. Visit [Assay Dashboard](https://assay.cirrusly-clever.com/dashboard)
2. Sign in with Google (if not already signed in)
3. Click the **"Get MCP Token"** button in the header
4. Copy the token from the dialog

**Note:** Tokens expire after 1 hour. Generate a new token when needed.

## Step 2: Create a Safe, Limited Anthropic API Key

### Why Create a Limited Key?

Server-side synthesis uses your Anthropic API key to call Claude API. Setting a spending limit protects you from unexpected charges.

### Instructions

1. **Go to Anthropic Console:**
   - Visit [console.anthropic.com](https://console.anthropic.com)
   - Sign in to your account

2. **Create a New API Key:**
   - Click **"API Keys"** in the sidebar
   - Click **"Create Key"**
   - Give it a name: `Assay MCP Server` (or similar)
   - Click **"Create Key"**

3. **Set Spending Limits:**
   - After creating the key, click on it to view details
   - Scroll to **"Spending Limits"** section
   - Set **Monthly Limit**: `$5.00` (or your preferred amount)
   - Set **Hard Limit**: `$5.00` (prevents any spending beyond this)
   - Click **"Save"**

4. **Copy the API Key:**
   - Click the **"Copy"** button next to your new key
   - **Save it securely** - you won't be able to see it again!

**Important:** 
- Keep this key private (like a password)
- The $5 limit ensures you won't be charged more than $5/month
- You can adjust limits later if needed

## Step 3: Upload Assay Skill to Your Workspace

The Assay Skill provides behavioral guidelines for Claude when synthesizing responses. You need to upload it to your Anthropic workspace.

### Option A: Using the Skills API (Recommended)

1. **Prepare the Skill:**
   ```bash
   # Navigate to the assay-skill directory (you'll need to obtain this separately)
   cd assay-skill
   zip -r ../assay-skill.zip .
   ```

2. **Upload via API:**
   ```bash
   curl -X POST https://api.anthropic.com/v1/skills \
     -H "x-api-key: YOUR_ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -F "file=@assay-skill.zip" \
     -F "name=assay-document-intelligence"
   ```

3. **Verify Upload:**
   - The API will return a response with the Skill ID
   - Note: The Skill name `assay-document-intelligence` will be used in API calls

### Option B: Using Claude.ai Web Interface

1. **Prepare the Skill:**
   ```bash
   # Navigate to the assay-skill directory (you'll need to obtain this separately)
   cd assay-skill
   zip -r assay-skill.zip .
   ```

2. **Upload to Claude.ai:**
   - Go to [claude.ai](https://claude.ai)
   - Go to **Settings** > **Features**
   - Scroll to **"Custom Skills"**
   - Click **"Upload Skill"**
   - Select `assay-skill.zip`
   - Wait for upload to complete

3. **Note:** Skills uploaded via Claude.ai are individual to your account and will be available in your workspace.

### Verify Skill is Available

You can verify the Skill is in your workspace by making a test API call:

```bash
curl https://api.anthropic.com/v1/skills \
  -H "x-api-key: YOUR_ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01"
```

You should see `assay-document-intelligence` in the list.

## Step 4: Configure Claude Desktop

Add both tokens to your Claude Desktop configuration:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`  
**Linux:** `~/.config/Claude/claude_desktop_config.json`

### Configuration Example

```json
{
  "mcpServers": {
    "assay": {
      "command": "node",
      "args": [
        "/absolute/path/to/assay-mcp-server/dist/index.js",
        "--token",
        "YOUR_FIREBASE_TOKEN_HERE"
      ],
      "env": {
        "CLAUDE_API_KEY": "YOUR_ANTHROPIC_API_KEY_HERE"
      }
    }
  }
}
```

**Replace:**
- `/absolute/path/to/assay-mcp-server` with your actual path
- `YOUR_FIREBASE_TOKEN_HERE` with your Firebase token from Step 1
- `YOUR_ANTHROPIC_API_KEY_HERE` with your Anthropic API key from Step 2

### Alternative: Using Environment Variables

You can also set the API key as a system environment variable:

```bash
# In your shell profile (~/.zshrc, ~/.bashrc, etc.)
export CLAUDE_API_KEY="your-api-key-here"
```

Then your config only needs the Firebase token:

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

## Step 5: Restart Claude Desktop

After updating the config file:
1. **Quit Claude Desktop completely**
2. **Restart Claude Desktop**
3. The MCP server should connect automatically

## Step 6: Verify Everything Works

1. **Test MCP Connection:**
   - Open Claude Desktop
   - Start a new conversation
   - Ask: "What MCP tools do you have available?"
   - You should see Assay tools listed

2. **Test Server-Side Synthesis:**
   - Ask: "Generate FAQs about AI safety from my documents"
   - Claude should use the `produce_faq` tool
   - If you have the API key configured, you should get a synthesized FAQ
   - If not, you'll get raw data (which is fine - Claude Desktop can still synthesize)

## Troubleshooting

### "Invalid API key" Error

- **Check your API key:** Make sure you copied the full key without extra spaces
- **Verify spending limits:** Make sure your API key hasn't hit its spending limit
- **Check workspace:** Ensure the Skill is uploaded to the workspace associated with your API key

### "Skill not found" Error

- **Verify Skill upload:** Make sure you uploaded the Skill using the same API key
- **Check Skill name:** The Skill should be named `assay-document-intelligence`
- **Try re-uploading:** Sometimes Skills need to be re-uploaded

### Server Disconnects

- **Token expired:** Firebase tokens expire after 1 hour - get a new one
- **Invalid token:** Make sure you copied the full Firebase token
- **Path issues:** Verify the absolute path in your config is correct

### No Synthesis (Getting Raw Data)

- **Check API key:** Make sure `CLAUDE_API_KEY` is set in your config
- **Check spending limit:** Your API key might have hit its spending limit
- **Check Skill:** Verify the Skill is uploaded to your workspace
- **This is OK:** If synthesis doesn't work, you'll still get raw data that Claude Desktop can synthesize

## Security Best Practices

1. **Never commit API keys to git**
2. **Use environment variables** when possible
3. **Set spending limits** on your API keys
4. **Rotate keys periodically** (create new keys, delete old ones)
5. **Monitor usage** in the Anthropic console

## Cost Management

- **Server-side synthesis** uses your Anthropic API key (you pay for API calls)
- **Without API key:** Tools return raw data, Claude Desktop synthesizes (no additional cost)
- **Spending limits** protect you from unexpected charges
- **Monitor usage** in console.anthropic.com

## Next Steps

- Read the [MCP Server README](./README.md) for tool documentation
- Explore the available tools and start asking questions about your documents!

---

**Need Help?** Open an issue on GitHub or contact support@cirrusly-clever.com

