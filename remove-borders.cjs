const fs = require('fs');
const path = require('path');

const componentsDir = 'd:\\1_Github\\Music-Filtering-System\\src';

function processFiles(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      processFiles(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let newContent = content.replace(/\s+\bborder(?:-[a-zA-Z0-9\/\[\]#]+)?\b/g, (match) => {
        if (item === 'LibraryBrowser.jsx' && (match.includes('border-r') || match.includes('border-border'))) {
          return match;
        }
        return ' ';
      });
      
      newContent = newContent.replace(/\s+className="\s+/g, ' className="');
      newContent = newContent.replace(/\s+className={`\s+/g, ' className={`');
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Modified ' + item);
      }
    }
  }
}

processFiles(componentsDir);
