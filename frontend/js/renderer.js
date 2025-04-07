/**
 * Markdown Renderer
 * Uses marked.js to render markdown with code highlighting
 */
class MarkdownRenderer {
  constructor() {
    // Set up marked.js options
    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
      langPrefix: 'hljs language-',
      pedantic: false,
      gfm: true,
      breaks: false,
      sanitize: false,
      smartypants: false,
      xhtml: false
    });
  }

  /**
   * Render markdown to HTML
   * @param {string} markdown - Markdown content to render
   * @returns {string} - HTML content
   */
  render(markdown) {
    if (!markdown) return '';
    
    try {
      const html = marked.parse(markdown);
      return html;
    } catch (error) {
      console.error('Error rendering markdown:', error);
      return `<p class="error">Error rendering markdown: ${error.message}</p>`;
    }
  }

  /**
   * Render markdown to an element
   * @param {string} markdown - Markdown content to render
   * @param {HTMLElement} element - Element to render to
   */
  renderToElement(markdown, element) {
    if (!element) {
      console.error('No element provided for rendering');
      return;
    }
    
    const html = this.render(markdown);
    element.innerHTML = html;
    
    // Initialize syntax highlighting on code blocks
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });
    
    // Add table classes for styling
    document.querySelectorAll('table').forEach((table) => {
      table.classList.add('table');
    });
  }
}

// Export as a global variable
window.markdownRenderer = new MarkdownRenderer();
