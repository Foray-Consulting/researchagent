# Fetch Extension Documentation

This document provides detailed information about the `mcp-server-fetch` extension used in the Deep Research App.

## Overview

The Fetch MCP Server is a Model Context Protocol server that provides web content fetching capabilities. This extension enables the Goose CLI to retrieve and process content from web pages, converting HTML to markdown for easier consumption by language models.

## Features

- Fetches content from web URLs
- Converts HTML to markdown for better readability
- Supports pagination through content using start_index
- Configurable maximum length for content retrieval
- Option to get raw content without markdown conversion

## Installation

The fetch extension can be installed and used in several ways:

### Using uv (Recommended)

The uv package manager provides the simplest way to use the fetch extension:

```bash
# Install uv if not already installed
curl -fsSL https://astral.sh/uv/install.sh | bash

# The extension can be used directly with uvx
uvx mcp-server-fetch
```

### Using pip

Alternatively, you can install the extension via pip:

```bash
pip install mcp-server-fetch

# After installation, run it as a script
python -m mcp_server_fetch
```

### Using Docker

You can also run the extension using Docker:

```bash
docker run --rm -i ghcr.io/modelcontextprotocol/mcp-server-fetch
```

## Configuration in the Deep Research App

The Deep Research App uses the fetch extension through the Goose CLI. This is configured in the `.env` file:

```
# Extensions
GOOSE_EXTENSIONS=uvx mcp-server-fetch
```

This tells the Goose CLI to use the `uvx mcp-server-fetch` command to enable the fetch extension.

## How It Works

When the Deep Research App starts a research session, it executes the Goose CLI with the fetch extension:

```bash
goose run -i /path/to/instructions.txt --name session-name --with-extension "uvx mcp-server-fetch"
```

The Goose CLI then uses the fetch extension to retrieve web content as part of the research process.

### Fetch Tool Capabilities

The fetch extension provides a tool called `fetch` with the following parameters:

- `url` (string, required): URL to fetch
- `max_length` (integer, optional): Maximum number of characters to return (default: 5000)
- `start_index` (integer, optional): Start content from this character index (default: 0)
- `raw` (boolean, optional): Get raw content without markdown conversion (default: false)

### Content Truncation and Pagination

The fetch tool will truncate the response to the specified `max_length`. However, by using the `start_index` argument, you can specify where to start the content extraction. This allows the model to read a webpage in chunks until it finds the information it needs.

## Advanced Configuration

### Robots.txt Compliance

By default, the server will obey a website's robots.txt file if the request came from the model (via a tool), but not if the request was user-initiated (via a prompt). This can be disabled by adding the argument `--ignore-robots-txt` to the extension command.

### User-Agent Customization

By default, the server uses one of two user-agents depending on whether the request came from the model or was user-initiated:

- Model-initiated: `ModelContextProtocol/1.0 (Autonomous; +https://github.com/modelcontextprotocol/servers)`
- User-initiated: `ModelContextProtocol/1.0 (User-Specified; +https://github.com/modelcontextprotocol/servers)`

You can customize this by adding the argument `--user-agent=YourUserAgent` to the extension command.

### Proxy Configuration

The server can be configured to use a proxy by using the `--proxy-url` argument.

## Debugging

You can use the MCP inspector to debug the server:

```bash
# For uvx installations
npx @modelcontextprotocol/inspector uvx mcp-server-fetch

# For package installations
cd path/to/servers/src/fetch
npx @modelcontextprotocol/inspector uv run mcp-server-fetch
```

## Troubleshooting

### Common Issues

1. **Extension not found**
   - Error: `Failed to start extension: Transport error: Stdio process error: No such file or directory`
   - Solution: Ensure uv is installed and the uvx command is available

2. **Network errors**
   - Error: `Failed to fetch URL: Network error`
   - Solution: Check your internet connection and the URL validity

3. **Permission errors**
   - Error: `Permission denied`
   - Solution: Ensure you have the necessary permissions to execute the extension

### Checking Extension Status

To check if the fetch extension is working correctly:

```bash
# Try running the extension directly
uvx mcp-server-fetch

# Check if it's available in the PATH
which uvx
```

## Resources

- [MCP Server Fetch GitHub Repository](https://github.com/modelcontextprotocol/servers)
- [Model Context Protocol Documentation](https://github.com/modelcontextprotocol/mcp)
- [uv Package Manager](https://github.com/astral-sh/uv)

## License

The mcp-server-fetch extension is licensed under the MIT License.
