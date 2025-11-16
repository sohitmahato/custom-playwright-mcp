# 🚀 Quick Start Guide# Quick Start Guide

Get your Playwright MCP Server running in **5 minutes**!## ✅ What's Been Set Up

## Prerequisites CheckYour Playwright MCP server is now ready to use! Here's what has been created:

Before starting, verify you have:### 📁 Project Structure

`bash`

node --version # Should be v18 or higherAI/

npm --version # Should be 9 or higher├── .github/

````│ └── copilot-instructions.md    # Project documentation for Copilot

├── .vscode/

If not, download Node.js from: https://nodejs.org/│   └── mcp.json                    # MCP server configuration

├── src/

---│   └── index.ts                    # MCP server implementation

├── build/                          # Compiled JavaScript (ready to use)

## Setup Steps├── package.json                    # Project dependencies

├── tsconfig.json                   # TypeScript configuration

### 1️⃣ Clone & Install (2 minutes)├── README.md                       # Full documentation

├── USAGE.md                        # Usage examples

```bash└── QUICKSTART.md                   # This file!

# Clone the repository```

git clone <your-repo-url>

cd playwright-mcp-server### 🛠️ Available Tools



# Install dependenciesYour MCP server exposes 7 Playwright tools:

npm install

1. **playwright_navigate** - Navigate to any URL

# Install Playwright browser2. **playwright_screenshot** - Capture page screenshots

npx playwright install chromium3. **playwright_click** - Click page elements

```4. **playwright_fill** - Fill form inputs

5. **playwright_extract_text** - Extract text content

### 2️⃣ Build the Server (30 seconds)6. **playwright_evaluate** - Run JavaScript in browser

7. **playwright_close** - Close browser instance

```bash

npm run build## 🚀 Getting Started

````

### Option 1: Use with GitHub Copilot in VS Code

You should see output like:

````1. **Reload VS Code:**

> playwright-mcp-server@2.0.0 build

> tsc   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)

```   - Type "Reload Window" and select it



### 3️⃣ Configure VS Code (1 minute)2. **Verify MCP Connection:**



**Find your absolute path:**   - Look for MCP indicators in VS Code

   - The server should auto-connect via `.vscode/mcp.json`

```bash

# Windows3. **Start Using It:**

cd   Open any file and chat with Copilot:

````

# Mac/Linux @workspace Navigate to https://example.com

pwd ```

`````

### Option 2: Test with MCP Inspector

Copy the path, then create `.vscode/mcp.json` **in your VS Code workspace**:

Run the inspector to test tools manually:

```json

{```bash

  "mcpServers": {npx @modelcontextprotocol/inspector node build/index.js

    "playwright": {```

      "command": "node",

      "args": [This opens a web UI where you can:

        "PASTE_YOUR_PATH_HERE/build/index.js"

      ]- View all available tools

    }- Test each tool with custom inputs

  }- See responses and debug issues

}

```### Option 3: Use with Claude Desktop



**Example paths:**1. **Add to Claude Desktop config** (`~/.config/claude/claude_desktop_config.json` on Mac/Linux or `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

- Windows: `"C:\\Users\\YourName\\Projects\\playwright-mcp-server\\build\\index.js"`

- Mac: `"/Users/yourname/projects/playwright-mcp-server/build/index.js"````json

- Linux: `"/home/yourname/projects/playwright-mcp-server/build/index.js"`{

  "mcpServers": {

### 4️⃣ Reload VS Code (30 seconds)    "playwright": {

      "command": "node",

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)      "args": ["c:\\Users\\sohit\\OneDrive\\Desktop\\AI\\build\\index.js"]

2. Type "Reload Window"    }

3. Press Enter  }

}

### 5️⃣ Test It! (1 minute)```



Open **GitHub Copilot Chat** in VS Code and try:2. **Restart Claude Desktop**



```3. **Start chatting:**

Navigate to https://example.com and take a screenshot   ```

```   Can you navigate to https://news.ycombinator.com and extract the top headlines?

`````

If you see "Successfully navigated" and get a screenshot, **you're done!** 🎉

## 💡 Example Usage

---

### Example 1: Web Scraping

## First Commands to Try

````

### Basic Navigation1. Navigate to https://example.com

```2. Take a screenshot named 'homepage'

Go to https://news.ycombinator.com and get the page title3. Extract text from the h1 element

```4. Close the browser

````

### Extract Data

```### Example 2: Form Automation

Navigate to https://example.com and extract all link text

```

1. Navigate to https://example.com/login

### Form Interaction2. Fill the input with id 'username' with 'testuser'

```3. Fill the input with id 'password' with 'secret123'

Go to https://github.com, fill the search box with "playwright", and press Enter4. Click the button with class 'login-btn'

```

### Record & Generate Test### Example 3: JavaScript Execution

````

Start recording "my_test"```

Navigate to https://example.comExecute this JavaScript:

Click the "More information" linkdocument.querySelectorAll('a').length

Stop recording```

Generate a Playwright test in TypeScript as "example.spec.ts"

```## 🔧 Development



---### Building the Project



## Troubleshooting```bash

npm run build

### ❌ "Server not connecting"```



**Fix:**### Watch Mode (auto-rebuild on changes)

```bash

# 1. Verify build exists```bash

ls build/index.jsnpm run watch

````

# 2. Check the path in .vscode/mcp.json is correct (use absolute path!)

### Adding New Tools

# 3. Reload VS Code again

```1. Edit `src/index.ts`

2. Define a new Zod schema for inputs

### ❌ "Browser launch failed"3. Add tool definition to `tools` array

4. Implement handler in switch statement

**Fix:**5. Run `npm run build`

````bash

# Reinstall Chromium## 📚 Learn More

npx playwright install chromium

- **Full Documentation**: See `README.md`

# On Linux, install dependencies- **Usage Examples**: See `USAGE.md`

npx playwright install-deps- **MCP Specification**: https://modelcontextprotocol.io

```- **Playwright Docs**: https://playwright.dev



### ❌ "Tool not found"## 🐛 Troubleshooting



**Fix:**### Server Not Working?

```bash

# Rebuild1. **Check the build:**

npm run build

   ```bash

# Reload VS Code   npm run build

# Ctrl+Shift+P → "Reload Window"   ```

````

2. **Verify Node.js version:**

---

```bash

## What's Next?   node --version  # Should be 18+

```

- ✅ Read the [full README.md](README.md) for all 24 tools

- ✅ Try the [test generation feature](README.md#-test-generation-feature)3. **Reinstall dependencies:**

- ✅ Explore [use cases](README.md#-use-cases) ```bash

- ✅ Check [configuration options](README.md#-configuration-options) npm install

  npx playwright install chromium

--- ```

## Need Help?### Can't Connect in VS Code?

- 📖 Full documentation: [README.md](README.md)1. Check `.vscode/mcp.json` exists

- 🐛 Report issues: GitHub Issues2. Reload VS Code window

- 💬 Ask questions: GitHub Discussions3. Check Output panel for errors

**Happy automating!** 🎉## 🎉 You're All Set!

Your Playwright MCP server is ready to automate browsers through natural language with GitHub Copilot!

Try it now: Open a chat with Copilot and say:

```
@workspace Navigate to https://github.com and take a screenshot
```

Enjoy building with MCP! 🚀
