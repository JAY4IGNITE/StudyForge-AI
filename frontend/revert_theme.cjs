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
  
  content = content.replace(/text-primary/g, 'text-ember');
  content = content.replace(/bg-primary/g, 'bg-ember');
  content = content.replace(/border-primary/g, 'border-ember');
  content = content.replace(/ring-primary/g, 'ring-ember');
  content = content.replace(/bg-primary-gradient/g, 'bg-ember-gradient');
  content = content.replace(/variant="default"/g, 'variant="ember"');
  content = content.replace(/accent: 'primary'/g, "accent: 'ember'");
  content = content.replace(/from-primary/g, 'from-ember');
  content = content.replace(/to-primary/g, 'to-ember');
  content = content.replace(/text-muted-foreground/g, 'text-secondary');
  content = content.replace(/\bbg-surface\b/g, 'bg-secondary');

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
console.log('Done reverting theme classes.');
