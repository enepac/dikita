const fs = require('fs');
const path = require('path');

function printTree(dir, prefix = '') {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  // Filter out folders that do not contain .tsx files directly or recursively
  const hasTSX = (p) => {
    const entries = fs.readdirSync(p, { withFileTypes: true });
    return entries.some((entry) => {
      if (entry.isDirectory()) {
        return hasTSX(path.join(p, entry.name));
      }
      return entry.name.endsWith('.tsx');
    });
  };

  const relevantItems = items.filter((item) => {
    if (item.isDirectory()) {
      return hasTSX(path.join(dir, item.name));
    }
    return item.name.endsWith('.tsx');
  });

  for (const item of relevantItems) {
    const fullPath = path.join(dir, item.name);
    const isLast = item === relevantItems[relevantItems.length - 1];
    const connector = isLast ? '└── ' : '├── ';

    if (item.isDirectory()) {
      console.log(`${prefix}${connector}${item.name}/`);
      printTree(fullPath, prefix + (isLast ? '    ' : '│   '));
    } else {
      console.log(`${prefix}${connector}${item.name}`);
    }
  }
}

// Change this to your Dikita frontend path
const root = path.resolve('frontend');
console.log(`📂 TSX Tree: ${root}`);
printTree(root);
