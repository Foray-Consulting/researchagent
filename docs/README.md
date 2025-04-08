# Deep Research App Documentation

Welcome to the documentation for the Deep Research App. This documentation will help you understand how to install, configure, and use the application effectively.

## Table of Contents

- [Installation](installation.md) - How to install the application
- [Usage](usage.md) - How to use the application
- [Configuration](configuration.md) - How to configure the application
- [Fetch Extension](fetch-extension.md) - Detailed documentation for the fetch extension
- [Troubleshooting](troubleshooting.md) - Common issues and solutions

## Overview

The Deep Research App is a web application that automates multi-stage research using the Goose CLI tool. It mimics OpenAI's "Deep Research" feature, allowing users to input a research topic and receive a comprehensive, beautifully formatted report.

The application follows a multi-stage research process:

1. **Initial Research** - Identify key subtopics
2. **Expanded Research** - Explore subtopics in depth
3. **Critical Analysis** - Critically evaluate findings
4. **Supplementary Research** - Fill research gaps
5. **Final Report** - Generate comprehensive report

The application provides real-time progress tracking and elegant markdown rendering of research reports.

## Architecture

The application consists of:

- **Frontend**: A simple web interface for inputting research topics and viewing results
- **Backend**: An Express.js server that orchestrates the research process
- **Goose CLI**: A command-line tool that performs the actual research using AI

## Requirements

- Node.js (v14 or later)
- Goose CLI with the fetch extension
- uv (Python package manager) for the fetch extension

## License

MIT
