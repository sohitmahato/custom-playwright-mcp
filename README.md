# Playwright MCP Server

A Model Context Protocol (MCP) server that provides Playwright browser automation capabilities. This server enables AI assistants like GitHub Copilot to perform web scraping, testing, and browser automation tasks.

## Features

This MCP server exposes **24 comprehensive Playwright tools** organized by category:

### Navigation & Page Control (6 tools)

- **playwright_navigate**: Navigate to URLs with custom wait conditions
- **playwright_go_back**: Navigate back in browser history
- **playwright_go_forward**: Navigate forward in browser history
- **playwright_reload**: Reload the current page
- **playwright_set_viewport**: Set custom viewport dimensions
- **playwright_get_page_info**: Get current page URL and title

### Element Interaction (8 tools)

- **playwright_click**: Click elements (supports multiple buttons and click counts)
- **playwright_fill**: Fill input fields quickly
- **playwright_type**: Type text with keyboard simulation and delays
- **playwright_hover**: Hover over elements
- **playwright_select**: Select dropdown options
- **playwright_checkbox**: Check or uncheck checkboxes
- **playwright_drag_and_drop**: Drag and drop elements
- **playwright_press_key**: Press keyboard keys (Enter, Escape, etc.)

### Data Extraction (3 tools)

- **playwright_extract_text**: Extract text from single or multiple elements
- **playwright_get_attribute**: Get attribute values from elements
- **playwright_evaluate**: Execute custom JavaScript and get results

### Waiting & Synchronization (1 tool)

- **playwright_wait_for_selector**: Wait for elements with custom timeout and state

### Capture (1 tool)

- **playwright_screenshot**: Capture full or partial page screenshots

### Test Recording & Generation (3 tools)

- **playwright_record_start**: Start recording user actions for test generation
- **playwright_record_stop**: Stop recording actions
- **playwright_generate_test**: Generate test scripts (Playwright/Puppeteer/Selenium in TypeScript/JavaScript/Python)

### Browser Management (2 tools)

- **playwright_close**: Close browser and cleanup
- All tools support stateful browser sessions (cookies, auth, history preserved)

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18 or higher** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **VS Code** (for GitHub Copilot integration) - [Download here](https://code.visualstudio.com/)
- **GitHub Copilot subscription** (for AI-powered usage)

## 🔧 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd playwright-mcp-server
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:

- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `playwright` - Browser automation library
- `zod` - Schema validation
- TypeScript and related dependencies

### Step 3: Install Playwright Browsers

```bash
npx playwright install chromium
```

This downloads the Chromium browser binary (~170MB). You can also install other browsers:

```bash
# Optional: Install all browsers
npx playwright install
```

### Step 4: Build the Server

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `build/` directory.

### Step 5: Configure VS Code (GitHub Copilot Integration)

Create or update `.vscode/mcp.json` in **your workspace** (not in this project):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": ["/absolute/path/to/playwright-mcp-server/build/index.js"]
    }
  }
}
```

**⚠️ Important:** Replace `/absolute/path/to/playwright-mcp-server/` with the actual path where you cloned this repo.

**Examples:**

- Windows: `"C:\\Users\\YourName\\Projects\\playwright-mcp-server\\build\\index.js"`
- Mac/Linux: `"/home/username/projects/playwright-mcp-server/build/index.js"`

### Step 6: Reload VS Code

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "Reload Window" and press Enter
3. Or simply restart VS Code

### Step 7: Verify Installation

Open GitHub Copilot Chat in VS Code and try:

```
Navigate to https://example.com and take a screenshot
```

If it works, you're all set! 🎉

## 💡 Usage Examples

### Basic Browser Automation

Use natural language with GitHub Copilot Chat:

```
Navigate to https://news.ycombinator.com and get the page title
```

```
Go to https://example.com, click the link with text "More information", and take a screenshot
```

```
Navigate to https://github.com, fill the search box with "playwright", and press Enter
```

### Advanced Interactions

```
Go to https://amazon.com, hover over the menu, wait for the dropdown, and extract all category names
```

```
Navigate to a form page, check the terms checkbox, select "United States" from the country dropdown, and click submit
```

```
Open the developer console and execute: document.querySelectorAll('a').length
```

### Test Recording & Generation

```
Start recording a test named "login_flow"
Navigate to https://example.com/login
Fill the username field with "testuser"
Fill the password field with "password123"
Click the login button
Wait for the dashboard to load
Stop recording
Generate a Playwright test in TypeScript, save as "login.spec.ts"
```

This will create a complete test file in `generated-tests/login.spec.ts`!

### Multi-Step Workflows

```
1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
2. Extract the demo credentials from the page
3. Login with those credentials
4. Verify the dashboard title
5. Take a screenshot
```

### Data Extraction

```
Go to https://news.ycombinator.com and extract all article titles
```

```
Navigate to a product page and get the price attribute from the element with class "product-price"
```

## 🎬 Test Generation Feature

### Record → Generate → Run

**Step 1: Start Recording**

```
Start recording "checkout_flow"
```

**Step 2: Perform Actions** (all are automatically recorded)

```
Navigate to https://demo-store.com
Click .add-to-cart
Fill #email with "test@example.com"
Click .checkout-button
```

**Step 3: Stop Recording**

```
Stop recording
```

**Step 4: Generate Test**

```
Generate a Playwright test in TypeScript, save as "checkout.spec.ts"
```

Or generate for different frameworks:

```
Generate a Puppeteer test in JavaScript, save as "checkout.test.js"
Generate a Selenium test in Python, save as "test_checkout.py"
```

**Generated test files** are saved in `generated-tests/` directory and are ready to run!

## 📚 Tool Reference

### Navigation & Page Control

| Tool                       | Description            | Key Parameters                                         |
| -------------------------- | ---------------------- | ------------------------------------------------------ |
| `playwright_navigate`      | Navigate to URL        | `url`, `waitUntil` (load/networkidle/domcontentloaded) |
| `playwright_go_back`       | Browser back button    | -                                                      |
| `playwright_go_forward`    | Browser forward button | -                                                      |
| `playwright_reload`        | Reload current page    | -                                                      |
| `playwright_set_viewport`  | Set viewport size      | `width`, `height`                                      |
| `playwright_get_page_info` | Get URL and title      | -                                                      |

### Element Interaction

| Tool                       | Description            | Key Parameters                                         |
| -------------------------- | ---------------------- | ------------------------------------------------------ |
| `playwright_click`         | Click element          | `selector`, `button` (left/right/middle), `clickCount` |
| `playwright_fill`          | Fill input quickly     | `selector`, `value`                                    |
| `playwright_type`          | Type with delays       | `selector`, `text`, `delay`                            |
| `playwright_hover`         | Hover over element     | `selector`                                             |
| `playwright_select`        | Select dropdown option | `selector`, `value`                                    |
| `playwright_checkbox`      | Check/uncheck checkbox | `selector`, `checked` (true/false)                     |
| `playwright_drag_and_drop` | Drag and drop          | `sourceSelector`, `targetSelector`                     |
| `playwright_press_key`     | Press keyboard key     | `key` (Enter, Escape, etc.)                            |

### Data Extraction

| Tool                       | Description           | Key Parameters                                |
| -------------------------- | --------------------- | --------------------------------------------- |
| `playwright_extract_text`  | Extract text content  | `selector`, `multiple` (true for all matches) |
| `playwright_get_attribute` | Get element attribute | `selector`, `attribute`                       |
| `playwright_evaluate`      | Execute JavaScript    | `script`                                      |

### Waiting & Capture

| Tool                           | Description        | Key Parameters                                           |
| ------------------------------ | ------------------ | -------------------------------------------------------- |
| `playwright_wait_for_selector` | Wait for element   | `selector`, `timeout`, `state` (visible/hidden/attached) |
| `playwright_screenshot`        | Capture screenshot | `name`, `fullPage` (true/false)                          |

### Test Generation

| Tool                       | Description          | Key Parameters                                                                                     |
| -------------------------- | -------------------- | -------------------------------------------------------------------------------------------------- |
| `playwright_record_start`  | Start recording      | `name`                                                                                             |
| `playwright_record_stop`   | Stop recording       | -                                                                                                  |
| `playwright_generate_test` | Generate test script | `framework` (playwright/puppeteer/selenium), `language` (typescript/javascript/python), `fileName` |

### Browser Management

| Tool               | Description   | Key Parameters |
| ------------------ | ------------- | -------------- |
| `playwright_close` | Close browser | -              |

## 🏗️ Architecture

This MCP server follows a **100% local architecture**:

```
┌─────────────────────────────────────────────────────────┐
│                    YOUR LOCAL MACHINE                    │
│                                                          │
│  ┌──────────────┐                                       │
│  │   VS Code    │                                       │
│  │ + Copilot    │                                       │
│  └──────┬───────┘                                       │
│         │ stdio (no network)                            │
│         ▼                                                │
│  ┌──────────────────────────────────┐                  │
│  │  Playwright MCP Server            │                  │
│  │  (build/index.js)                │                  │
│  └──────────────┬───────────────────┘                  │
│                 │                                        │
│                 ▼                                        │
│  ┌──────────────────────────────────┐                  │
│  │  Chromium Browser (Local)         │                  │
│  └───────────────────────────────────┘                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Key Points:**

- ✅ **No external MCP services** - Everything runs locally
- ✅ **stdio communication** - No HTTP or WebSocket connections
- ✅ **No API keys needed** - No authentication required
- ✅ **Privacy-first** - Your automation scripts never leave your machine
- ✅ **Offline capable** - Works without internet (except for accessing websites)

## 🛠️ Development

### Build Commands

```bash
# Build once
npm run build

# Watch mode (auto-rebuild on changes)
npm run watch

# Clean build
rm -rf build && npm run build
```

### Project Structure

```
playwright-mcp-server/
├── .github/
│   └── copilot-instructions.md   # GitHub Copilot context
├── .vscode/
│   └── mcp.json                  # MCP server configuration
├── src/
│   └── index.ts                  # Main server implementation
├── build/
│   └── index.js                  # Compiled output (generated)
├── generated-tests/              # Generated test files (created at runtime)
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

### Extending the Server

To add a new tool:

1. **Define the schema** in `src/index.ts`:

```typescript
const MyToolSchema = z.object({
  param1: z.string().describe("Description"),
  param2: z.number().optional(),
});
```

2. **Add the tool definition**:

```typescript
{
  name: "playwright_my_tool",
  description: "What this tool does",
  inputSchema: { /* JSON schema */ }
}
```

3. **Implement the handler**:

```typescript
case "playwright_my_tool": {
  const { param1, param2 } = MyToolSchema.parse(args);
  const page = await browserManager.ensurePage();
  // Your implementation
  return { content: [{ type: "text", text: "Result" }] };
}
```

4. **Rebuild**: `npm run build`

## 🔒 Security & Privacy

- **Local-only operation** - No data sent to external servers
- **Headless mode** - Browser runs without visible window (configurable)
- **Input validation** - All parameters validated with Zod schemas
- **Sandboxed browser** - Chromium runs with security flags
- **No telemetry** - No usage tracking or analytics

**Best Practices:**

- Be cautious when navigating to untrusted URLs
- Validate user input before passing to `playwright_evaluate`
- Review generated test scripts before running
- Use in trusted environments only

## 🐛 Troubleshooting

### Issue: MCP Server Not Connecting

**Solution:**

```bash
# 1. Verify build exists
ls build/index.js

# 2. Test server manually
node build/index.js

# 3. Check VS Code MCP configuration
cat .vscode/mcp.json

# 4. Reload VS Code
# Ctrl+Shift+P → "Reload Window"
```

### Issue: Browser Launch Fails

**Solution:**

```bash
# Install/reinstall browsers
npx playwright install chromium

# Check system dependencies (Linux)
npx playwright install-deps chromium

# Test browser manually
npx playwright open https://example.com
```

### Issue: Tool Not Found

**Cause:** MCP server cache or outdated build

**Solution:**

```bash
# Rebuild
npm run build

# Clear VS Code cache and reload
# Ctrl+Shift+P → "Developer: Reload Window"
```

### Issue: Screenshots Not Saving

**Cause:** Permission issues or invalid path

**Solution:**

```bash
# Create screenshots directory
mkdir -p screenshots

# Check write permissions
ls -la
```

### Issue: Generated Tests Not Appearing

**Cause:** Directory not created

**Solution:**
Tests are automatically saved to `generated-tests/` directory. If missing:

```bash
mkdir generated-tests
```

### Debug Mode

Enable detailed logging by modifying `src/index.ts`:

```typescript
console.error("DEBUG:", JSON.stringify(request, null, 2));
```

Then rebuild and check terminal output.

## 🎯 Use Cases

### 1. **Web Scraping**

```
Navigate to a news site and extract all article titles and links
```

### 2. **Automated Testing**

```
Record my login flow, then generate a test suite
```

### 3. **Form Automation**

```
Fill out and submit contact forms with test data
```

### 4. **Visual Regression Testing**

```
Take screenshots of my app in different viewport sizes
```

### 5. **Data Collection**

```
Navigate through paginated results and collect all product information
```

### 6. **Browser-Based Scripts**

```
Execute custom JavaScript to analyze page performance
```

## 📝 Configuration Options

### Change Browser Type

Edit `src/index.ts`:

```typescript
// Use Firefox instead of Chromium
import { firefox } from "playwright";
this.browser = await firefox.launch({ ... });
```

### Headful Mode (Visible Browser)

Edit `src/index.ts`:

```typescript
this.browser = await chromium.launch({
  headless: false, // Show browser window
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
```

### Custom Viewport

Default is 1280x720. Change in `src/index.ts`:

```typescript
this.context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  userAgent: "...",
});
```

### Screenshot Directory

Generated tests save to `generated-tests/`. Modify in `src/index.ts`:

```typescript
const testsDir = path.join(process.cwd(), "my-custom-tests");
```

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Build and test**: `npm run build`
5. **Commit**: `git commit -m 'Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Setup

```bash
git clone <your-fork>
cd playwright-mcp-server
npm install
npm run build
# Make changes in src/
npm run watch  # Auto-rebuild on changes
```

## 📄 License

MIT

## 🔗 Related Resources

- **[Model Context Protocol](https://modelcontextprotocol.io)** - Official MCP documentation
- **[Playwright](https://playwright.dev)** - Browser automation framework
- **[MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)** - Official SDK
- **[GitHub Copilot](https://github.com/features/copilot)** - AI pair programmer
- **[VS Code](https://code.visualstudio.com/)** - Recommended editor

## ⭐ Support & Community

If you find this project useful:

- ⭐ Star this repository
- 🐛 Report issues on GitHub
- 💡 Suggest new features
- 🤝 Contribute improvements

## 📮 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Documentation**: This README and inline code comments

## 🎉 Acknowledgments

- Built with the [Model Context Protocol](https://modelcontextprotocol.io)
- Powered by [Playwright](https://playwright.dev)
- Inspired by the MCP community

---

**Made with ❤️ for browser automation**
