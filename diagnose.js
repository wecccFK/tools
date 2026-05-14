var fs = require('fs');
var content = fs.readFileSync('C:/Users/adm/Desktop/web-tools-next/src/constants.ts', 'utf8');

// Track brace depth line by line
var lines = content.split('\n');
var braceCount = 0;
var errors = [];
var lastValidLine = 0;

for (var i = 0; i < lines.length; i++) {
    var l = lines[i];
    for (var j = 0; j < l.length; j++) {
        if (l[j] === '{') braceCount++;
        if (l[j] === '}') braceCount--;
    }

    if (braceCount < 0) {
        errors.push('NEGATIVE at line ' + (i+1) + ': ' + l.trim().substring(0,80));
        break;
    }
    
    if (braceCount === 0) lastValidLine = i;
}

console.log('Final brace count:', braceCount);
console.log('Last valid line with braceCount=0:', lastValidLine+1);

// Find all places where },  immediately precedes {
var prevClosed = false;
for (var i = 0; i < lines.length; i++) {
    var l = lines[i].trim();
    if (l === '}' || l === '},') {
        prevClosed = true;
    } else if (prevClosed) {
        if (l.startsWith('{')) {
            console.log('Missing comma after } at line ' + (i+1) + ' before ' + l.trim().substring(0,60));
        } else if (!l.match(/^(id|name|description|category|icon|tags|seoTitle|seoDescription|seoContent):/)) {
            prevClosed = false;
        }
    }
}

// Find orphan blocks (tool fields after closing } )
for (var i = 1; i < lines.length; i++) {
    var l = lines[i].trim();
    var prev = lines[i-1].trim();
    if (l.match(/^(id|name|description|category|icon|tags|seoTitle|seoDescription|seoContent):/) && (prev === '}' || prev === '},')) {
        console.log('Orphan at line ' + (i+1) + ': ' + l.substring(0,60));
    }
}