# Playwright MCP Server Project

## Project Overview

This is a Model Context Protocol (MCP) server that exposes comprehensive Playwright browser automation functionality. It runs locally and integrates with GitHub Copilot to perform web scraping, testing, browser automation, and automated test generation.

## Project Type

- **Type**: MCP Server (Model Context Protocol)
- **Language**: TypeScript/Node.js
- **Framework**: Playwright, MCP SDK
- **Version**: 2.0.0

## Available Tools (24 Total)

### Navigation & Page Control (6 tools)

- `playwright_navigate`: Navigate to URLs with custom wait conditions
- `playwright_go_back`: Navigate back in browser history
- `playwright_go_forward`: Navigate forward in browser history
- `playwright_reload`: Reload the current page
- `playwright_set_viewport`: Set custom viewport dimensions
- `playwright_get_page_info`: Get current page URL and title

### Element Interaction (8 tools)

- `playwright_click`: Click elements (supports multiple buttons and click counts)
- `playwright_fill`: Fill input fields quickly
- `playwright_type`: Type text with keyboard simulation and delays
- `playwright_hover`: Hover over elements
- `playwright_select`: Select dropdown options
- `playwright_checkbox`: Check or uncheck checkboxes
- `playwright_drag_and_drop`: Drag and drop elements
- `playwright_press_key`: Press keyboard keys (Enter, Escape, etc.)

### Data Extraction (3 tools)

- `playwright_extract_text`: Extract text from single or multiple elements
- `playwright_get_attribute`: Get attribute values from elements
- `playwright_evaluate`: Execute custom JavaScript and get results

### Waiting & Synchronization (1 tool)

- `playwright_wait_for_selector`: Wait for elements with custom timeout and state

### Capture (1 tool)

- `playwright_screenshot`: Capture full or partial page screenshots

### Test Recording & Generation (3 tools)

- `playwright_record_start`: Start recording user actions for test generation
- `playwright_record_stop`: Stop recording actions
- `playwright_generate_test`: Generate test scripts (Playwright/Puppeteer/Selenium in TypeScript/JavaScript/Python)

### Browser Management (2 tools)

- `playwright_close`: Close browser and cleanup
- All tools support stateful browser sessions (cookies, auth, history preserved)

## Key Features

- **24 Comprehensive Tools**: Full Playwright capabilities exposed via MCP
- **Test Generation**: Record actions and generate tests in multiple frameworks
- **Stateful Sessions**: Browser stays open between commands, maintaining state
- **Multi-Language Support**: Generate tests in TypeScript, JavaScript, or Python
- **Multi-Framework Support**: Playwright, Puppeteer, or Selenium test generation
- **Local & Private**: 100% local operation, no external API calls

## Configuration

The MCP server is configured in `.vscode/mcp.json` and runs as a local Node.js process communicating via stdio with GitHub Copilot in VS Code.

## Development Guidelines

- Follow TypeScript best practices
- Use async/await for browser operations
- Implement proper error handling for browser actions
- Keep tool implementations modular and testable
- Always validate user inputs with Zod schemas
- Maintain stateful browser sessions for complex workflows
- Use recording feature for automated test script generation
