# Configuration Guide

This guide explains how to configure the Deep Research App to suit your needs.

## Environment Variables

The Deep Research App uses environment variables for configuration. These are stored in a `.env` file in the root directory of the application.

### Creating the .env File

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your preferred text editor:
   ```bash
   nano .env
   ```

### Available Configuration Options

#### Server Configuration

```
# Server Configuration
PORT=3000
NODE_ENV=development
```

- `PORT`: The port on which the server will run (default: 3000)
- `NODE_ENV`: The environment mode (development, production, test)

#### Goose CLI Configuration

```
# Goose CLI Configuration
GOOSE_PATH=goose
TEMP_DIR=/tmp/deep-research
RESEARCH_SESSION_PREFIX=deep-research
```

- `GOOSE_PATH`: Path to the Goose CLI executable (default: "goose")
- `TEMP_DIR`: Directory for temporary files (default: "/tmp/deep-research")
- `RESEARCH_SESSION_PREFIX`: Prefix for research session names (default: "deep-research")

#### Extensions Configuration

```
# Extensions
GOOSE_EXTENSIONS=uvx mcp-server-fetch
```

- `GOOSE_EXTENSIONS`: Space-separated list of extensions to use with Goose CLI

## Goose CLI Configuration

The Goose CLI has its own configuration, which is stored in `~/.config/goose/config.yaml`.

### OpenRouter Configuration

To use OpenRouter as the AI provider:

```yaml
GOOSE_MODEL: openrouter/quasar-alpha
GOOSE_PROVIDER: openrouter
providers:
  openrouter:
    type: openrouter
    api_key: your-api-key-here
```

- `GOOSE_MODEL`: The model to use (e.g., "openrouter/quasar-alpha")
- `GOOSE_PROVIDER`: The provider to use (e.g., "openrouter")
- `api_key`: Your OpenRouter API key

### Other Providers

The Goose CLI supports other providers as well. Refer to the Goose CLI documentation for details.

## Research Templates

The research process is guided by templates located in the `backend/research/templates` directory:

- `initial-research.txt`: Template for the initial research stage
- `expanded-research.txt`: Template for the expanded research stage
- `critical-analysis.txt`: Template for the critical analysis stage
- `supplementary-research.txt`: Template for the supplementary research stage
- `final-report.txt`: Template for the final report stage

### Customizing Templates

You can customize these templates to change the research process. Each template contains instructions for the AI, with a placeholder `{{TOPIC}}` that gets replaced with the actual research topic.

For example, the initial research template might look like:

```
Use your fetch tools to research the topic "{{TOPIC}}". Before you're done, identify the top 5 additional subtopics, subdomains, or related items to research further in order to better understand this topic.
```

## Frontend Configuration

The frontend configuration is minimal and is mostly handled through the backend API. However, you can customize the appearance and behavior by editing the files in the `frontend` directory:

- `frontend/index.html`: The main HTML file
- `frontend/css/styles.css`: CSS styles
- `frontend/js/app.js`: Main JavaScript file
- `frontend/js/renderer.js`: Markdown rendering logic

## Docker Configuration

If you're using Docker, you can configure the application through environment variables in the Docker run command:

```bash
docker run -p 3000:3000 \
  -e PORT=3000 \
  -e NODE_ENV=production \
  -e GOOSE_PATH=goose \
  -e TEMP_DIR=/tmp/deep-research \
  -e RESEARCH_SESSION_PREFIX=deep-research \
  -e GOOSE_EXTENSIONS="uvx mcp-server-fetch" \
  deep-research-app
```

Alternatively, you can use a Docker Compose file for more complex configurations.

## Advanced Configuration

### Changing the Research Process

To change the research process (e.g., adding or removing stages):

1. Update the `RESEARCH_STAGES` constant in `shared/constants.js`
2. Add or remove corresponding templates in `backend/research/templates`
3. Update the stage descriptions in `STAGE_DESCRIPTIONS` in `shared/constants.js`

### Customizing Temporary File Handling

The application creates temporary files for each research session. You can customize how these are handled by modifying the `cleanupSession` method in `backend/research/goose.js`.

### Modifying the API

The API endpoints are defined in `backend/server.js`. You can add, modify, or remove endpoints as needed.

## Next Steps

For information on troubleshooting common issues, see the [Troubleshooting Guide](troubleshooting.md).
