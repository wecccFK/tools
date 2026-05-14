var fs = require('fs');
var content = fs.readFileSync('src\\constants.ts', 'utf8');
var lines = content.split('\n');
var errors = [];
var braceCount = 0;
for (var i = 0; i < lines.length; i++) {
    var l = lines[i];
    for (var j = 0; j < l.length; j++) {
        if (l[j] === '{') braceCount++;
        if (l[j] === '}') braceCount--;
    }
    if (braceCount < 0) {
        errors.push('Line ' + (i+1) + ': NEGATIVE: ' + braceCount + ' | ' + l.trim().substring(0,80));
    }
}
console.log('Final braces: ' + braceCount);
if (errors.length > 0) {
    errors.forEach(function(e) { console.log(e); });
} else {
    console.log('OK - no negative braces');
}