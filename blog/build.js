const fs = require('fs');
const path = require('path');

// Directories
const pagesDir = path.join(__dirname, 'pages');
const layoutFile = path.join(__dirname, 'layout', 'default.html');
const outputDir = path.join(__dirname, '..', 'public', 'blog');

// Read the layout template
const layoutTemplate = fs.readFileSync(layoutFile, 'utf-8');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Process all HTML files in the pages directory
function buildPages() {
    const files = fs.readdirSync(pagesDir);
    
    files.forEach(file => {
        if (path.extname(file) === '.html') {
            const inputPath = path.join(pagesDir, file);
            const outputPath = path.join(outputDir, file);
            
            // Read the page content
            const pageContent = fs.readFileSync(inputPath, 'utf-8');
            
            // Extract title from <!-- TITLE: title here --> comment
            const titleMatch = pageContent.match(/<!--\s*TITLE:\s*(.+?)\s*-->/);
            const title = titleMatch ? titleMatch[1] : 'Untitled';
            
            // Remove the title comment from content
            const content = pageContent.replace(/<!--\s*TITLE:\s*.+?\s*-->\s*/, '');
            
            // Replace placeholders in layout
            let output = layoutTemplate
                .replace(/<!--\s*TITLE\s*-->/g, title)
                .replace(/<!--\s*CONTENT\s*-->/, content);
            
            // Write the output file
            fs.writeFileSync(outputPath, output, 'utf-8');
            
            console.log(`Built: ${file} -> ${path.relative(process.cwd(), outputPath)}`);
        }
    });
}

// Run the build
console.log('Building blog pages...');
buildPages();
console.log('Build complete!');