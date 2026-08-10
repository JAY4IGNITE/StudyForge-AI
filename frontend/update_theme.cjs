const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content.replace(/text-ember/g, 'text-primary');
  content = content.replace(/bg-ember/g, 'bg-primary');
  content = content.replace(/border-ember/g, 'border-primary');
  content = content.replace(/ring-ember/g, 'ring-primary');
  content = content.replace(/bg-ember-gradient/g, 'bg-primary-gradient');
  content = content.replace(/variant="ember"/g, 'variant="default"');
  content = content.replace(/accent: 'ember'/g, "accent: 'primary'");
  content = content.replace(/from-ember/g, 'from-primary');
  content = content.replace(/to-ember/g, 'to-primary');
  content = content.replace(/text-secondary/g, 'text-muted-foreground');
  // Only replace exact 'bg-secondary' to 'bg-surface'
  content = content.replace(/\bbg-secondary\b/g, 'bg-surface');

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
console.log('Done replacing theme classes.');
