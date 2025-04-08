# Usage Guide

This guide will walk you through how to use the Deep Research App to conduct comprehensive research on any topic.

## Starting the Application

1. Navigate to the application directory:
   ```bash
   cd deep-research-app
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
   (or the port you configured in the `.env` file)

## Conducting Research

### Starting a New Research Session

1. On the main page, you'll see a text input field labeled "Research Topic"
2. Enter your research topic (e.g., "Quantum Computing", "Climate Change", "Artificial Intelligence")
3. Click the "Begin Research" button to start the research process

### Understanding the Research Process

The Deep Research App follows a multi-stage research process:

1. **Initial Research** (Stage 1/5)
   - The system identifies key subtopics related to your main topic
   - This stage sets the foundation for deeper exploration

2. **Expanded Research** (Stage 2/5)
   - The system explores each subtopic in depth
   - It gathers detailed information on each aspect of the topic

3. **Critical Analysis** (Stage 3/5)
   - The system critically evaluates the findings
   - It identifies strengths, weaknesses, and gaps in the research

4. **Supplementary Research** (Stage 4/5)
   - The system fills in any gaps identified during the critical analysis
   - It ensures comprehensive coverage of the topic

5. **Final Report** (Stage 5/5)
   - The system compiles all the research into a comprehensive report
   - The report is formatted in markdown for easy reading

### Monitoring Research Progress

As the research progresses, you'll see:

- The current stage of research
- A progress bar indicating overall completion
- Status updates for each stage

The research process can take several minutes to complete, depending on the complexity of the topic.

### Viewing Research Results

Once the research is complete:

1. The final report will be displayed in the main area of the application
2. The report is formatted in markdown with:
   - Headings and subheadings
   - Bullet points and numbered lists
   - Emphasis on key points
   - Citations where applicable

3. You can read the report directly in the application or copy it for use elsewhere

## Managing Research Sessions

### Viewing Active Sessions

The application keeps track of active research sessions. To view them:

1. Look for the "Active Sessions" section on the main page
2. Each session shows:
   - The research topic
   - Current status
   - Start time
   - Progress

### Cleaning Up Sessions

To clean up a completed research session:

1. Find the session in the "Active Sessions" list
2. Click the "Delete" button next to the session
3. Confirm the deletion when prompted

This will remove the session data from the server.

## Using Research Results

The research results are provided in markdown format, which can be:

- Copied and pasted into a markdown editor
- Converted to other formats (e.g., PDF, Word) using markdown conversion tools
- Used as a basis for further research or content creation

## Tips for Effective Research

- **Be Specific**: More specific research topics tend to yield more focused and useful results
- **Use Clear Language**: Avoid ambiguous terms or jargon unless necessary
- **Review All Stages**: Each stage of the research provides valuable insights
- **Follow Up**: Use the final report as a starting point for deeper investigation

## Next Steps

For information on configuring the application, see the [Configuration Guide](configuration.md).

If you encounter any issues, refer to the [Troubleshooting Guide](troubleshooting.md).
