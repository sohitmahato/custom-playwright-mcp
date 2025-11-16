# 🔧 Platform-Specific Setup Guide

This guide provides detailed setup instructions for Windows, macOS, and Linux.

---

## Windows Setup

### Prerequisites

1. **Install Node.js**

   - Download from: https://nodejs.org/
   - Choose "LTS" version (recommended)
   - Run installer, accept defaults
   - Verify installation:
     ```powershell
     node --version
     npm --version
     ```

2. **Install Git** (optional, for cloning)

   - Download from: https://git-scm.com/download/win
   - Or clone via GitHub Desktop

3. **Install VS Code**
   - Download from: https://code.visualstudio.com/
   - Install GitHub Copilot extension

### Installation Steps

```powershell
# 1. Clone repository
git clone <your-repo-url>
cd playwright-mcp-server

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install chromium

# 4. Build the server
npm run build

# 5. Get your absolute path
cd
# Copy this path!

# 6. Configure VS Code
# Create .vscode/mcp.json in your workspace with:
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": [
        "C:\\Users\\YourName\\Path\\To\\playwright-mcp-server\\build\\index.js"
      ]
    }
  }
}

# 7. Reload VS Code
# Ctrl+Shift+P → "Reload Window"
```

### Windows-Specific Notes

- Use **double backslashes** (`\\`) in paths
- Or use forward slashes: `C:/Users/YourName/...`
- PowerShell is recommended over CMD
- If you get execution policy errors:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

---

## macOS Setup

### Prerequisites

1. **Install Node.js**

   ```bash
   # Using Homebrew (recommended)
   brew install node

   # Or download from: https://nodejs.org/
   ```

2. **Install Git** (usually pre-installed)

   ```bash
   git --version
   # If not installed: xcode-select --install
   ```

3. **Install VS Code**
   - Download from: https://code.visualstudio.com/
   - Install GitHub Copilot extension

### Installation Steps

```bash
# 1. Clone repository
git clone <your-repo-url>
cd playwright-mcp-server

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install chromium

# 4. Build the server
npm run build

# 5. Get your absolute path
pwd
# Copy this path!

# 6. Configure VS Code
# Create .vscode/mcp.json in your workspace with:
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": [
        "/Users/yourname/path/to/playwright-mcp-server/build/index.js"
      ]
    }
  }
}

# 7. Reload VS Code
# Cmd+Shift+P → "Reload Window"
```

### macOS-Specific Notes

- Use **forward slashes** (`/`) in paths
- If you get permission errors, use `sudo` carefully
- Homebrew makes Node.js installation easier
- M1/M2 Macs: Use Rosetta if needed (rarely required)

---

## Linux Setup

### Prerequisites

**Ubuntu/Debian:**

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt-get install git

# Install system dependencies for Playwright
sudo apt-get install -y \
  libnss3 \
  libnspr4 \
  libdbus-1-3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libpango-1.0-0 \
  libcairo2 \
  libasound2
```

**Fedora/RHEL/CentOS:**

```bash
# Install Node.js
sudo dnf install nodejs npm

# Install Git
sudo dnf install git

# Install system dependencies
sudo dnf install \
  nss \
  nspr \
  dbus-libs \
  atk \
  at-spi2-atk \
  cups-libs \
  libdrm \
  libxkbcommon \
  libXcomposite \
  libXdamage \
  libXfixes \
  libXrandr \
  mesa-libgbm \
  pango \
  cairo \
  alsa-lib
```

**Arch Linux:**

```bash
# Install Node.js
sudo pacman -S nodejs npm

# Install Git
sudo pacman -S git

# Install Playwright dependencies
sudo pacman -S \
  nss \
  nspr \
  dbus \
  atk \
  at-spi2-atk \
  cups \
  libdrm \
  libxkbcommon \
  libxcomposite \
  libxdamage \
  libxfixes \
  libxrandr \
  mesa \
  pango \
  cairo \
  alsa-lib
```

### Installation Steps

```bash
# 1. Clone repository
git clone <your-repo-url>
cd playwright-mcp-server

# 2. Install dependencies
npm install

# 3. Install Playwright browsers and system dependencies
npx playwright install chromium
npx playwright install-deps chromium

# 4. Build the server
npm run build

# 5. Get your absolute path
pwd
# Copy this path!

# 6. Configure VS Code
# Create .vscode/mcp.json in your workspace with:
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": [
        "/home/username/path/to/playwright-mcp-server/build/index.js"
      ]
    }
  }
}

# 7. Reload VS Code
# Ctrl+Shift+P → "Reload Window"
```

### Linux-Specific Notes

- Use **forward slashes** (`/`) in paths
- You may need `sudo` for system package installation
- Headless servers: Ensure you have X11 libraries installed
- Docker users: See Docker section below

---

## Docker Setup (All Platforms)

### Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
FROM mcr.microsoft.com/playwright:v1.49.1-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

CMD ["node", "build/index.js"]
```

### Build and Run

```bash
# Build image
docker build -t playwright-mcp-server .

# Run container
docker run -it playwright-mcp-server
```

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: Test MCP Server

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps chromium

      - name: Build
        run: npm run build

      - name: Test
        run: node build/index.js
```

---

## Verification Steps

After setup on any platform:

### 1. Check Node Installation

```bash
node --version  # Should show v18 or higher
npm --version   # Should show v9 or higher
```

### 2. Check Build Output

```bash
ls build/index.js  # Should exist
```

### 3. Test Server Manually

```bash
node build/index.js
# Should not error immediately
# Press Ctrl+C to stop
```

### 4. Check VS Code Configuration

```bash
cat .vscode/mcp.json  # Should show correct path
```

### 5. Test with Copilot

Open VS Code and try:

```
Navigate to https://example.com
```

---

## Common Issues by Platform

### Windows

**Issue:** `'node' is not recognized`

```powershell
# Add Node.js to PATH or restart terminal
```

**Issue:** Path with spaces

```json
"args": ["C:\\Program Files\\path\\build\\index.js"]
// Use double backslashes!
```

### macOS

**Issue:** Permission denied

```bash
sudo chown -R $USER:$USER .
```

**Issue:** Command not found

```bash
# Add to ~/.zshrc or ~/.bash_profile
export PATH="/usr/local/bin:$PATH"
```

### Linux

**Issue:** Browser launch fails

```bash
# Install all dependencies
npx playwright install-deps chromium
```

**Issue:** Display not found

```bash
# Set display for headless
export DISPLAY=:99
```

---

## Environment Variables

Optional configuration via environment variables:

```bash
# Browser type (chromium, firefox, webkit)
export PLAYWRIGHT_BROWSER=chromium

# Headless mode
export PLAYWRIGHT_HEADLESS=true

# Slow down operations (ms)
export PLAYWRIGHT_SLOW_MO=100

# Custom browser path
export PLAYWRIGHT_BROWSERS_PATH=/custom/path
```

---

## Next Steps

After successful setup:

1. ✅ Read [README.md](README.md) for full documentation
2. ✅ Try [QUICKSTART.md](QUICKSTART.md) examples
3. ✅ Explore test generation features
4. ✅ Join the community and contribute!

---

## Support

Platform-specific help:

- **Windows**: GitHub Issues (tag: windows)
- **macOS**: GitHub Issues (tag: macos)
- **Linux**: GitHub Issues (tag: linux)
- **Docker**: GitHub Issues (tag: docker)

**Happy automating!** 🚀
