const fs = require('fs');
const content = fs.readFileSync('src/constants.ts', 'utf8');
const lines = content.split('\n');

let braceCount = 0;
let errors = [];

for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    for (const ch of l) {
        if (ch === '{') braceCount++;
        if (ch === '}') braceCount--;
    }

    if (braceCount < 0) {
        errors.push('Line ' + (i+1) + ': NEGATIVE braces (' + braceCount + '): ' + l.trim().substring(0, 80));
        for (let j = Math.max(0, i-3); j <= Math.min(lines.length-1, i+3); j++) {
            errors.push('  ' + (j+1) + ': ' + lines[j]);
        }
        break;
    }
}

console.log('Final brace count: ' + braceCount);
if (errors.length > 0) {
    console.log('ERRORS:');
    errors.forEach(function(e) { console.log(e); });
} else {
    console.log('No negative brace errors found');
}

// Find orphaned content blocks
for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l.match(/^(id|name|description|category|icon|tags|seoTitle|seoDescription|seoContent):/) && i > 0) {
        var prev = lines[i-1].trim().replace(/,\s*$/, ',');
        if (prev === '}' || prev === '},') {
            console.log('Orphaned block at line ' + (i+1) + ': ' + l.substring(0, 60));
        }
    }
}