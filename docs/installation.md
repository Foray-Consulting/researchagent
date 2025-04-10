# Installation Guide

This guide will walk you through the process of installing the Deep Research App and its dependencies.

## Prerequisites

Before installing the Deep Research App, ensure you have the following prerequisites:

- [Node.js](https://nodejs.org/) (v14 or later)
- [Goose CLI](https://github.com/goose-ai/goose)
- [uv](https://github.com/astral-sh/uv) (Python package manager)

## Installing Node.js

If you don't have Node.js installed, you can download it from the [official website](https://nodejs.org/) or use a package manager:

### On macOS (using Homebrew):
```bash
brew install node
```

### On Ubuntu/Debian:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### On Windows:
Download and run the installer from the [Node.js website](https://nodejs.org/).

## Installing Goose CLI

The Goose CLI is required for the research functionality. Follow these steps to install it:

1. Visit the [Goose CLI GitHub repository](https://github.com/goose-ai/goose)
2. Download the appropriate version for your operating system
3. Make the binary executable (on Unix-based systems)
4. Add it to your PATH

### On macOS/Linux:
```bash
# Download the latest release (replace with the actual URL)
wget -q -O /usr/local/bin/goose https://github.com/goose-ai/goose/releases/latest/download/goose_linux_x86_64
# Make it executable
chmod +x /usr/local/bin/goose
```

### On Windows:
Download the Windows binary and add it to your PATH.

## Installing uv (Python Package Manager)

The uv package manager is required for the fetch extension. Install it using the following commands:

### On macOS/Linux:
```bash
curl -fsSL https://astral.sh/uv/install.sh | bash
```

### On Windows:
```bash
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

## Configuring Goose CLI

After installing Goose CLI, you need to configure it with your API key:

1. Create a configuration file at `~/.config/goose/config.yaml`
2. Add your OpenRouter API key and model configuration:

```yaml
GOOSE_MODEL: openrouter/quasar-alpha
GOOSE_PROVIDER: openrouter
providers:
  openrouter:
    type: openrouter
    api_key: your-api-key-here
```

Replace `your-api-key-here` with your actual OpenRouter API key.

## Installing the Deep Research App

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd deep-research-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file to configure your environment:
   ```
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Goose CLI Configuration
   GOOSE_PATH=goose
   TEMP_DIR=/tmp/deep-research
   RESEARCH_SESSION_PREFIX=deep-research

   # Extensions
   GOOSE_EXTENSIONS=uvx mcp-server-fetch
   ```

## Verifying the Installation

To verify that everything is installed correctly:

1. Check that Goose CLI is available:
   ```bash
   goose --version
   ```

2. Check that uv is available:
   ```bash
   uv --version
   ```

3. Start the application:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` (or the port you configured in the `.env` file)

If you see the Deep Research App interface, the installation was successful!

## Next Steps

Now that you have installed the Deep Research App, you can proceed to the [Usage Guide](usage.md) to learn how to use the application.
