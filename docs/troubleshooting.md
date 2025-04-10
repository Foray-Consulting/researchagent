# Troubleshooting Guide

This guide helps you diagnose and resolve common issues with the Deep Research App.

## Common Issues

### Server Won't Start

**Symptoms:**
- Error when running `npm start`
- Server crashes immediately after starting

**Possible Causes and Solutions:**

1. **Port already in use**
   - Error message: `Error: listen EADDRINUSE: address already in use :::3000`
   - Solution: Change the port in the `.env` file or kill the process using the port:
     ```bash
     # Find the process using the port
     lsof -i :3000
     # Kill the process
     kill -9 <PID>
     ```

2. **Missing dependencies**
   - Error message: `Error: Cannot find module 'express'`
   - Solution: Install dependencies:
     ```bash
     npm install
     ```

3. **Invalid .env file**
   - Error message: `Error: Invalid .env file`
   - Solution: Check your `.env` file for syntax errors or use the example file:
     ```bash
     cp .env.example .env
     ```

### Goose CLI Not Found

**Symptoms:**
- Error when starting research
- Error message: `Error: Command failed: goose run ...`

**Possible Causes and Solutions:**

1. **Goose CLI not installed**
   - Solution: Install Goose CLI as described in the [Installation Guide](installation.md)

2. **Goose CLI not in PATH**
   - Solution: Add Goose CLI to your PATH or specify the full path in the `.env` file:
     ```
     GOOSE_PATH=/path/to/goose
     ```

3. **Incorrect permissions**
   - Solution: Make sure the Goose CLI executable has the correct permissions:
     ```bash
     chmod +x /path/to/goose
     ```

### Extension Errors

**Symptoms:**
- Error when starting research
- Error message: `Failed to start extension: Transport error: Stdio process error: No such file or directory`

**Possible Causes and Solutions:**

1. **Missing uv package manager**
   - Solution: Install uv as described in the [Installation Guide](installation.md)

2. **Missing fetch extension**
   - Solution: Make sure the `uvx mcp-server-fetch` extension is available:
     ```bash
     # Check if uvx is available
     which uvx
     # Try running the extension directly
     uvx mcp-server-fetch --help
     ```

3. **Incorrect extension configuration**
   - Solution: Check the `GOOSE_EXTENSIONS` variable in your `.env` file:
     ```
     GOOSE_EXTENSIONS=uvx mcp-server-fetch
     ```

### API Key Issues

**Symptoms:**
- Research starts but fails during execution
- Error message: `Authentication failed` or `Invalid API key`

**Possible Causes and Solutions:**

1. **Missing or invalid API key**
   - Solution: Check your Goose CLI configuration file (`~/.config/goose/config.yaml`) and ensure the API key is correct:
     ```yaml
     providers:
       openrouter:
         type: openrouter
         api_key: your-api-key-here
     ```

2. **API key expired or rate limited**
   - Solution: Check your API key status on the provider's website and obtain a new key if necessary

### Research Process Hangs

**Symptoms:**
- Research starts but never completes
- Progress bar stops updating

**Possible Causes and Solutions:**

1. **Network issues**
   - Solution: Check your internet connection and try again

2. **Server overloaded**
   - Solution: Restart the server and try a simpler research topic

3. **Timeout issues**
   - Solution: Check the Goose CLI logs for timeout errors and increase timeouts if necessary

### Frontend Issues

**Symptoms:**
- UI not loading properly
- JavaScript errors in the browser console

**Possible Causes and Solutions:**

1. **Browser cache issues**
   - Solution: Clear your browser cache and reload the page

2. **JavaScript errors**
   - Solution: Check the browser console for specific errors and fix the corresponding code

3. **CSS issues**
   - Solution: Check if the CSS files are loading properly and fix any styling issues

## Debugging Techniques

### Server Logs

To see detailed server logs:

```bash
# Run the server with more verbose logging
NODE_ENV=development DEBUG=* npm start
```

### Goose CLI Logs

To see Goose CLI logs:

```bash
# Check the logs directory
ls -la ~/.local/state/goose/logs
# View the latest log file
cat ~/.local/state/goose/logs/latest.log
```

### Temporary Files

To inspect temporary files created during research:

```bash
# List temporary files
ls -la /tmp/deep-research
# View a specific file
cat /tmp/deep-research/deep-research-<session-id>-<stage>.txt
```

### Network Debugging

To debug network issues:

```bash
# Check if the server is listening on the expected port
netstat -tuln | grep 3000
# Test API endpoints
curl http://localhost:3000/api/research
```

## Getting Help

If you're still experiencing issues after trying the solutions in this guide:

1. Check the [GitHub repository](https://github.com/your-username/deep-research-app) for known issues
2. Search for similar issues in the repository's issue tracker
3. Create a new issue with detailed information about your problem:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Error messages
   - System information (OS, Node.js version, etc.)

## Reporting Bugs

When reporting bugs, please include:

1. A clear description of the issue
2. Steps to reproduce the problem
3. Error messages (if any)
4. Your environment details:
   - Operating system
   - Node.js version
   - Goose CLI version
   - Browser version (for frontend issues)
5. Screenshots or videos (if applicable)

This information will help the developers diagnose and fix the issue more quickly.
