#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { chromium, Browser, Page, BrowserContext } from "playwright";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

// Recording state for test generation
interface RecordedAction {
    type: string;
    selector?: string;
    value?: string;
    url?: string;
    script?: string;
    key?: string;
    attribute?: string;
    timestamp: number;
    description?: string;
}

let recordedActions: RecordedAction[] = [];
let isRecording = false;
let recordingName = "";

// Helper function to add recorded action
function recordAction(action: Omit<RecordedAction, "timestamp">) {
    if (isRecording) {
        recordedActions.push({
            ...action,
            timestamp: Date.now(),
        });
    }
}

// Tool input schemas
const NavigateSchema = z.object({
    url: z.string().url().describe("The URL to navigate to"),
    waitUntil: z.enum(["load", "domcontentloaded", "networkidle", "commit"]).optional(),
});

const ScreenshotSchema = z.object({
    name: z.string().describe("Name for the screenshot file"),
    fullPage: z.boolean().optional().describe("Capture full page screenshot"),
});

const ClickSchema = z.object({
    selector: z.string().describe("CSS selector of element to click"),
    button: z.enum(["left", "right", "middle"]).optional(),
    clickCount: z.number().optional(),
});

const FillSchema = z.object({
    selector: z.string().describe("CSS selector of input element"),
    value: z.string().describe("Value to fill into the input"),
});

const ExtractTextSchema = z.object({
    selector: z.string().describe("CSS selector of element to extract text from"),
    multiple: z.boolean().optional().describe("Extract from all matching elements"),
});

const EvaluateSchema = z.object({
    script: z.string().describe("JavaScript code to execute in the browser"),
});

const HoverSchema = z.object({
    selector: z.string().describe("CSS selector of element to hover"),
});

const SelectSchema = z.object({
    selector: z.string().describe("CSS selector of select element"),
    value: z.string().describe("Value to select"),
});

const TypeSchema = z.object({
    selector: z.string().describe("CSS selector of input element"),
    text: z.string().describe("Text to type"),
    delay: z.number().optional().describe("Delay between keystrokes in ms"),
});

const WaitForSelectorSchema = z.object({
    selector: z.string().describe("CSS selector to wait for"),
    timeout: z.number().optional().describe("Timeout in ms (default: 30000)"),
    state: z.enum(["attached", "detached", "visible", "hidden"]).optional(),
});

const GetAttributeSchema = z.object({
    selector: z.string().describe("CSS selector of element"),
    attribute: z.string().describe("Attribute name to get"),
});

const PressKeySchema = z.object({
    key: z.string().describe("Key to press (e.g., 'Enter', 'Escape', 'ArrowDown')"),
});

const GoBackSchema = z.object({});
const GoForwardSchema = z.object({});
const ReloadSchema = z.object({});

const SetViewportSchema = z.object({
    width: z.number().describe("Viewport width"),
    height: z.number().describe("Viewport height"),
});

const RecordStartSchema = z.object({
    name: z.string().describe("Name for the recording session"),
});

const RecordStopSchema = z.object({});

const GenerateTestSchema = z.object({
    framework: z.enum(["playwright", "puppeteer", "selenium"]).describe("Test framework to generate for"),
    language: z.enum(["typescript", "javascript", "python"]).describe("Programming language"),
    fileName: z.string().describe("Output file name for the test"),
});

const CheckboxSchema = z.object({
    selector: z.string().describe("CSS selector of checkbox"),
    checked: z.boolean().describe("Check (true) or uncheck (false)"),
});

const DragAndDropSchema = z.object({
    sourceSelector: z.string().describe("CSS selector of element to drag"),
    targetSelector: z.string().describe("CSS selector of drop target"),
});

const GetPageInfoSchema = z.object({});

// Browser management
class BrowserManager {
    private browser: Browser | null = null;
    private context: BrowserContext | null = null;
    private page: Page | null = null;

    async ensureBrowser(): Promise<Browser> {
        if (!this.browser) {
            this.browser = await chromium.launch({
                headless: true,
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            });
        }
        return this.browser;
    }

    async ensureContext(): Promise<BrowserContext> {
        if (!this.context) {
            const browser = await this.ensureBrowser();
            this.context = await browser.newContext({
                viewport: { width: 1280, height: 720 },
                userAgent:
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            });
        }
        return this.context;
    }

    async ensurePage(): Promise<Page> {
        if (!this.page) {
            const context = await this.ensureContext();
            this.page = await context.newPage();
        }
        return this.page;
    }

    async closeBrowser(): Promise<void> {
        if (this.page) {
            await this.page.close();
            this.page = null;
        }
        if (this.context) {
            await this.context.close();
            this.context = null;
        }
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    async getCurrentPage(): Promise<Page | null> {
        return this.page;
    }

    async setViewport(width: number, height: number): Promise<void> {
        const page = await this.ensurePage();
        await page.setViewportSize({ width, height });
    }
}

const browserManager = new BrowserManager();

// Test generation functions
function generatePlaywrightTest(actions: RecordedAction[], language: "typescript" | "javascript"): string {
    const isTS = language === "typescript";
    const imports = isTS
        ? `import { test, expect } from '@playwright/test';\n\n`
        : `const { test, expect } = require('@playwright/test');\n\n`;

    let testCode = imports;
    testCode += `test('${recordingName || "recorded test"}', async ({ page }) => {\n`;

    for (const action of actions) {
        switch (action.type) {
            case "navigate":
                testCode += `  await page.goto('${action.url}');\n`;
                break;
            case "click":
                testCode += `  await page.click('${action.selector}');\n`;
                break;
            case "fill":
                testCode += `  await page.fill('${action.selector}', '${action.value}');\n`;
                break;
            case "type":
                testCode += `  await page.type('${action.selector}', '${action.value}');\n`;
                break;
            case "press":
                testCode += `  await page.keyboard.press('${action.key}');\n`;
                break;
            case "select":
                testCode += `  await page.selectOption('${action.selector}', '${action.value}');\n`;
                break;
            case "hover":
                testCode += `  await page.hover('${action.selector}');\n`;
                break;
            case "check":
                testCode += `  await page.check('${action.selector}');\n`;
                break;
            case "uncheck":
                testCode += `  await page.uncheck('${action.selector}');\n`;
                break;
            case "waitForSelector":
                testCode += `  await page.waitForSelector('${action.selector}');\n`;
                break;
            case "screenshot":
                testCode += `  await page.screenshot({ path: '${action.value}' });\n`;
                break;
        }
    }

    testCode += `});\n`;
    return testCode;
}

function generatePuppeteerTest(actions: RecordedAction[], language: "typescript" | "javascript"): string {
    const isTS = language === "typescript";
    const imports = isTS
        ? `import puppeteer from 'puppeteer';\n\n`
        : `const puppeteer = require('puppeteer');\n\n`;

    let testCode = imports;
    testCode += `(async () => {\n`;
    testCode += `  const browser = await puppeteer.launch();\n`;
    testCode += `  const page = await browser.newPage();\n\n`;

    for (const action of actions) {
        switch (action.type) {
            case "navigate":
                testCode += `  await page.goto('${action.url}');\n`;
                break;
            case "click":
                testCode += `  await page.click('${action.selector}');\n`;
                break;
            case "fill":
            case "type":
                testCode += `  await page.type('${action.selector}', '${action.value}');\n`;
                break;
            case "press":
                testCode += `  await page.keyboard.press('${action.key}');\n`;
                break;
            case "select":
                testCode += `  await page.select('${action.selector}', '${action.value}');\n`;
                break;
            case "hover":
                testCode += `  await page.hover('${action.selector}');\n`;
                break;
            case "waitForSelector":
                testCode += `  await page.waitForSelector('${action.selector}');\n`;
                break;
            case "screenshot":
                testCode += `  await page.screenshot({ path: '${action.value}' });\n`;
                break;
        }
    }

    testCode += `\n  await browser.close();\n`;
    testCode += `})();\n`;
    return testCode;
}

function generatePythonTest(actions: RecordedAction[], framework: "playwright" | "selenium"): string {
    if (framework === "playwright") {
        let testCode = `from playwright.sync_api import sync_playwright\n\n`;
        testCode += `def test_${recordingName.replace(/[^a-zA-Z0-9]/g, "_") || "recorded"}():\n`;
        testCode += `    with sync_playwright() as p:\n`;
        testCode += `        browser = p.chromium.launch()\n`;
        testCode += `        page = browser.new_page()\n\n`;

        for (const action of actions) {
            switch (action.type) {
                case "navigate":
                    testCode += `        page.goto('${action.url}')\n`;
                    break;
                case "click":
                    testCode += `        page.click('${action.selector}')\n`;
                    break;
                case "fill":
                    testCode += `        page.fill('${action.selector}', '${action.value}')\n`;
                    break;
                case "type":
                    testCode += `        page.type('${action.selector}', '${action.value}')\n`;
                    break;
                case "press":
                    testCode += `        page.keyboard.press('${action.key}')\n`;
                    break;
                case "select":
                    testCode += `        page.select_option('${action.selector}', '${action.value}')\n`;
                    break;
                case "hover":
                    testCode += `        page.hover('${action.selector}')\n`;
                    break;
                case "waitForSelector":
                    testCode += `        page.wait_for_selector('${action.selector}')\n`;
                    break;
                case "screenshot":
                    testCode += `        page.screenshot(path='${action.value}')\n`;
                    break;
            }
        }

        testCode += `\n        browser.close()\n`;
        return testCode;
    } else {
        // Selenium
        let testCode = `from selenium import webdriver\n`;
        testCode += `from selenium.webdriver.common.by import By\n`;
        testCode += `from selenium.webdriver.support.ui import WebDriverWait\n`;
        testCode += `from selenium.webdriver.support import expected_conditions as EC\n\n`;
        testCode += `def test_${recordingName.replace(/[^a-zA-Z0-9]/g, "_") || "recorded"}():\n`;
        testCode += `    driver = webdriver.Chrome()\n\n`;

        for (const action of actions) {
            switch (action.type) {
                case "navigate":
                    testCode += `    driver.get('${action.url}')\n`;
                    break;
                case "click":
                    testCode += `    driver.find_element(By.CSS_SELECTOR, '${action.selector}').click()\n`;
                    break;
                case "fill":
                case "type":
                    testCode += `    driver.find_element(By.CSS_SELECTOR, '${action.selector}').send_keys('${action.value}')\n`;
                    break;
                case "waitForSelector":
                    testCode += `    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, '${action.selector}')))\n`;
                    break;
                case "screenshot":
                    testCode += `    driver.save_screenshot('${action.value}')\n`;
                    break;
            }
        }

        testCode += `\n    driver.quit()\n`;
        return testCode;
    }
}

// Tool definitions with all capabilities
const tools: Tool[] = [
    {
        name: "playwright_navigate",
        description: "Navigate to a URL in the browser",
        inputSchema: {
            type: "object",
            properties: {
                url: { type: "string", description: "The URL to navigate to" },
                waitUntil: {
                    type: "string",
                    enum: ["load", "domcontentloaded", "networkidle", "commit"],
                    description: "When to consider navigation succeeded",
                },
            },
            required: ["url"],
        },
    },
    {
        name: "playwright_screenshot",
        description: "Take a screenshot of the current page",
        inputSchema: {
            type: "object",
            properties: {
                name: { type: "string", description: "Name for the screenshot file" },
                fullPage: {
                    type: "boolean",
                    description: "Capture full page screenshot",
                },
            },
            required: ["name"],
        },
    },
    {
        name: "playwright_click",
        description: "Click an element on the page",
        inputSchema: {
            type: "object",
            properties: {
                selector: {
                    type: "string",
                    description: "CSS selector of element to click",
                },
                button: {
                    type: "string",
                    enum: ["left", "right", "middle"],
                    description: "Mouse button to use",
                },
                clickCount: { type: "number", description: "Number of clicks" },
            },
            required: ["selector"],
        },
    },
    {
        name: "playwright_fill",
        description: "Fill an input element with text",
        inputSchema: {
            type: "object",
            properties: {
                selector: {
                    type: "string",
                    description: "CSS selector of input element",
                },
                value: { type: "string", description: "Value to fill" },
            },
            required: ["selector", "value"],
        },
    },
    {
        name: "playwright_type",
        description: "Type text with keyboard simulation",
        inputSchema: {
            type: "object",
            properties: {
                selector: {
                    type: "string",
                    description: "CSS selector of input element",
                },
                text: { type: "string", description: "Text to type" },
                delay: {
                    type: "number",
                    description: "Delay between keystrokes in ms",
                },
            },
            required: ["selector", "text"],
        },
    },
    {
        name: "playwright_extract_text",
        description: "Extract text content from elements",
        inputSchema: {
            type: "object",
            properties: {
                selector: {
                    type: "string",
                    description: "CSS selector of element(s)",
                },
                multiple: {
                    type: "boolean",
                    description: "Extract from all matching elements",
                },
            },
            required: ["selector"],
        },
    },
    {
        name: "playwright_evaluate",
        description: "Execute JavaScript in browser context",
        inputSchema: {
            type: "object",
            properties: {
                script: { type: "string", description: "JavaScript code to execute" },
            },
            required: ["script"],
        },
    },
    {
        name: "playwright_hover",
        description: "Hover over an element",
        inputSchema: {
            type: "object",
            properties: {
                selector: {
                    type: "string",
                    description: "CSS selector of element to hover",
                },
            },
            required: ["selector"],
        },
    },
    {
        name: "playwright_select",
        description: "Select an option in a dropdown",
        inputSchema: {
            type: "object",
            properties: {
                selector: {
                    type: "string",
                    description: "CSS selector of select element",
                },
                value: { type: "string", description: "Value to select" },
            },
            required: ["selector", "value"],
        },
    },
    {
        name: "playwright_wait_for_selector",
        description: "Wait for an element to appear",
        inputSchema: {
            type: "object",
            properties: {
                selector: { type: "string", description: "CSS selector to wait for" },
                timeout: { type: "number", description: "Timeout in ms" },
                state: {
                    type: "string",
                    enum: ["attached", "detached", "visible", "hidden"],
                },
            },
            required: ["selector"],
        },
    },
    {
        name: "playwright_get_attribute",
        description: "Get an attribute value from an element",
        inputSchema: {
            type: "object",
            properties: {
                selector: { type: "string", description: "CSS selector of element" },
                attribute: { type: "string", description: "Attribute name" },
            },
            required: ["selector", "attribute"],
        },
    },
    {
        name: "playwright_press_key",
        description: "Press a keyboard key",
        inputSchema: {
            type: "object",
            properties: {
                key: {
                    type: "string",
                    description: "Key to press (e.g., 'Enter', 'Escape')",
                },
            },
            required: ["key"],
        },
    },
    {
        name: "playwright_go_back",
        description: "Navigate back in browser history",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "playwright_go_forward",
        description: "Navigate forward in browser history",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "playwright_reload",
        description: "Reload the current page",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "playwright_set_viewport",
        description: "Set viewport size",
        inputSchema: {
            type: "object",
            properties: {
                width: { type: "number", description: "Viewport width" },
                height: { type: "number", description: "Viewport height" },
            },
            required: ["width", "height"],
        },
    },
    {
        name: "playwright_checkbox",
        description: "Check or uncheck a checkbox",
        inputSchema: {
            type: "object",
            properties: {
                selector: { type: "string", description: "CSS selector of checkbox" },
                checked: {
                    type: "boolean",
                    description: "Check (true) or uncheck (false)",
                },
            },
            required: ["selector", "checked"],
        },
    },
    {
        name: "playwright_drag_and_drop",
        description: "Drag and drop an element",
        inputSchema: {
            type: "object",
            properties: {
                sourceSelector: {
                    type: "string",
                    description: "CSS selector of element to drag",
                },
                targetSelector: {
                    type: "string",
                    description: "CSS selector of drop target",
                },
            },
            required: ["sourceSelector", "targetSelector"],
        },
    },
    {
        name: "playwright_get_page_info",
        description: "Get current page information (URL, title, etc.)",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "playwright_record_start",
        description: "Start recording actions for test generation",
        inputSchema: {
            type: "object",
            properties: {
                name: { type: "string", description: "Name for the recording session" },
            },
            required: ["name"],
        },
    },
    {
        name: "playwright_record_stop",
        description: "Stop recording actions",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "playwright_generate_test",
        description: "Generate a test script from recorded actions",
        inputSchema: {
            type: "object",
            properties: {
                framework: {
                    type: "string",
                    enum: ["playwright", "puppeteer", "selenium"],
                    description: "Test framework",
                },
                language: {
                    type: "string",
                    enum: ["typescript", "javascript", "python"],
                    description: "Programming language",
                },
                fileName: { type: "string", description: "Output file name" },
            },
            required: ["framework", "language", "fileName"],
        },
    },
    {
        name: "playwright_close",
        description: "Close the browser instance",
        inputSchema: { type: "object", properties: {} },
    },
];

// Create MCP server
const server = new Server(
    {
        name: "playwright-mcp-server",
        version: "2.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case "playwright_navigate": {
                const { url, waitUntil } = NavigateSchema.parse(args);
                const page = await browserManager.ensurePage();
                await page.goto(url, { waitUntil: waitUntil || "networkidle" });
                recordAction({ type: "navigate", url, description: `Navigate to ${url}` });
                return {
                    content: [{ type: "text", text: `Successfully navigated to ${url}` }],
                };
            }

            case "playwright_screenshot": {
                const { name: screenshotName, fullPage } = ScreenshotSchema.parse(args);
                const page = await browserManager.ensurePage();
                const screenshot = await page.screenshot({
                    fullPage: fullPage ?? false,
                    type: "png",
                });
                recordAction({ type: "screenshot", value: screenshotName, description: "Take screenshot" });
                return {
                    content: [
                        { type: "text", text: `Screenshot captured: ${screenshotName}` },
                        { type: "image", data: screenshot.toString("base64"), mimeType: "image/png" },
                    ],
                };
            }

            case "playwright_click": {
                const { selector, button, clickCount } = ClickSchema.parse(args);
                const page = await browserManager.ensurePage();
                await page.click(selector, { button, clickCount });
                recordAction({ type: "click", selector, description: `Click ${selector}` });
                return {
                    content: [{ type: "text", text: `Clicked element: ${selector}` }],
                };
            }

            case "playwright_fill": {
                const { selector, value } = FillSchema.parse(args);
                const page = await browserManager.ensurePage();
                await page.fill(selector, value);
                recordAction({ type: "fill", selector, value, description: `Fill ${selector}` });
                return {
                    content: [{ type: "text", text: `Filled ${selector} with: ${value}` }],
                };
            }

            case "playwright_type": {
                const { selector, text, delay } = TypeSchema.parse(args);
                const page = await browserManager.ensurePage();
                await page.type(selector, text, { delay });
                recordAction({ type: "type", selector, value: text, description: `Type into ${selector}` });
                return {
                    content: [{ type: "text", text: `Typed "${text}" into ${selector}` }],
                };
            }

            case "playwright_extract_text": {
                const { selector, multiple } = ExtractTextSchema.parse(args);
                const page = await browserManager.ensurePage();
                if (multiple) {
                    const texts = await page.$$eval(selector, (els) =>
                        els.map((el) => el.textContent || "")
                    );
                    return {
                        content: [
                            {
                                type: "text",
                                text: texts.length > 0 ? texts.join("\n") : "(no elements found)",
                            },
                        ],
                    };
                } else {
                    const text = await page.textContent(selector);
                    return {
                        content: [{ type: "text", text: text || "(empty)" }],
                    };
                }
            }

            case "playwright_evaluate": {
                const { script } = EvaluateSchema.parse(args);
                const page = await browserManager.ensurePage();
                const result = await page.evaluate(script);
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }

            case "playwright_hover": {
                const { selector } = HoverSchema.parse(args);
                const page = await browserManager.ensurePage();
                await page.hover(selector);
                recordAction({ type: "hover", selector, description: `Hover ${selector}` });
                return {
                    content: [{ type: "text", text: `Hovered over: ${selector}` }],
                };
            }

            case "playwright_select": {
                const { selector, value } = SelectSchema.parse(args);
                const page = await browserManager.ensurePage();
                await page.selectOption(selector, value);
                recordAction({ type: "select", selector, value, description: `Select option in ${selector}` });
                return {
                    content: [{ type: "text", text: `Selected "${value}" in ${selector}` }],
                };
            }

            case "playwright_wait_for_selector": {
                const { selector, timeout, state } = WaitForSelectorSchema.parse(args);
                const page = await browserManager.ensurePage();
                await page.waitForSelector(selector, { timeout, state });
                recordAction({ type: "waitForSelector", selector, description: `Wait for ${selector}` });
                return {
                    content: [{ type: "text", text: `Element appeared: ${selector}` }],
                };
            }

            case "playwright_get_attribute": {
                const { selector, attribute } = GetAttributeSchema.parse(args);
                const page = await browserManager.ensurePage();
                const value = await page.getAttribute(selector, attribute);
                return {
                    content: [
                        {
                            type: "text",
                            text: value ? `${attribute}="${value}"` : "(attribute not found)",
                        },
                    ],
                };
            }

            case "playwright_press_key": {
                const { key } = PressKeySchema.parse(args);
                const page = await browserManager.ensurePage();
                await page.keyboard.press(key);
                recordAction({ type: "press", key, description: `Press ${key}` });
                return {
                    content: [{ type: "text", text: `Pressed key: ${key}` }],
                };
            }

            case "playwright_go_back": {
                const page = await browserManager.ensurePage();
                await page.goBack();
                return {
                    content: [{ type: "text", text: "Navigated back" }],
                };
            }

            case "playwright_go_forward": {
                const page = await browserManager.ensurePage();
                await page.goForward();
                return {
                    content: [{ type: "text", text: "Navigated forward" }],
                };
            }

            case "playwright_reload": {
                const page = await browserManager.ensurePage();
                await page.reload();
                return {
                    content: [{ type: "text", text: "Page reloaded" }],
                };
            }

            case "playwright_set_viewport": {
                const { width, height } = SetViewportSchema.parse(args);
                await browserManager.setViewport(width, height);
                return {
                    content: [{ type: "text", text: `Viewport set to ${width}x${height}` }],
                };
            }

            case "playwright_checkbox": {
                const { selector, checked } = CheckboxSchema.parse(args);
                const page = await browserManager.ensurePage();
                if (checked) {
                    await page.check(selector);
                    recordAction({ type: "check", selector, description: `Check ${selector}` });
                } else {
                    await page.uncheck(selector);
                    recordAction({ type: "uncheck", selector, description: `Uncheck ${selector}` });
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: `Checkbox ${checked ? "checked" : "unchecked"}: ${selector}`,
                        },
                    ],
                };
            }

            case "playwright_drag_and_drop": {
                const { sourceSelector, targetSelector } = DragAndDropSchema.parse(args);
                const page = await browserManager.ensurePage();
                await page.dragAndDrop(sourceSelector, targetSelector);
                return {
                    content: [
                        {
                            type: "text",
                            text: `Dragged ${sourceSelector} to ${targetSelector}`,
                        },
                    ],
                };
            }

            case "playwright_get_page_info": {
                const page = await browserManager.ensurePage();
                const url = page.url();
                const title = await page.title();
                return {
                    content: [
                        {
                            type: "text",
                            text: `URL: ${url}\nTitle: ${title}`,
                        },
                    ],
                };
            }

            case "playwright_record_start": {
                const { name } = RecordStartSchema.parse(args);
                isRecording = true;
                recordingName = name;
                recordedActions = [];
                return {
                    content: [
                        {
                            type: "text",
                            text: `Recording started: ${name}. All subsequent actions will be recorded.`,
                        },
                    ],
                };
            }

            case "playwright_record_stop": {
                isRecording = false;
                return {
                    content: [
                        {
                            type: "text",
                            text: `Recording stopped. ${recordedActions.length} actions recorded. Use playwright_generate_test to create a test script.`,
                        },
                    ],
                };
            }

            case "playwright_generate_test": {
                const { framework, language, fileName } = GenerateTestSchema.parse(args);

                if (recordedActions.length === 0) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: "No actions recorded. Start recording with playwright_record_start first.",
                            },
                        ],
                    };
                }

                let testCode = "";

                if (language === "python") {
                    testCode = generatePythonTest(recordedActions, framework as "playwright" | "selenium");
                } else if (framework === "playwright") {
                    testCode = generatePlaywrightTest(recordedActions, language as "typescript" | "javascript");
                } else if (framework === "puppeteer") {
                    testCode = generatePuppeteerTest(recordedActions, language as "typescript" | "javascript");
                }

                // Save to file
                const testsDir = path.join(process.cwd(), "generated-tests");
                if (!fs.existsSync(testsDir)) {
                    fs.mkdirSync(testsDir, { recursive: true });
                }

                const filePath = path.join(testsDir, fileName);
                fs.writeFileSync(filePath, testCode);

                return {
                    content: [
                        {
                            type: "text",
                            text: `Test generated successfully!\nFile: ${filePath}\nFramework: ${framework}\nLanguage: ${language}\nActions: ${recordedActions.length}\n\n${testCode}`,
                        },
                    ],
                };
            }

            case "playwright_close": {
                await browserManager.closeBrowser();
                isRecording = false;
                recordedActions = [];
                return {
                    content: [{ type: "text", text: "Browser closed successfully" }],
                };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            content: [{ type: "text", text: `Error: ${errorMessage}` }],
            isError: true,
        };
    }
});

// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Playwright MCP Server v2.0 running on stdio");
    console.error("Enhanced with 24 tools including test generation");
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
