const fs = require('fs');
let content = fs.readFileSync('src/pages/InterviewSimulator.tsx', 'utf8');
const lines = content.split('\n');

// Find and log problematic lines
lines.forEach((line, i) => {
    const charCodes = [];
    for (let j = 0; j < line.length; j++) {
        if (line.charCodeAt(j) === 92) { // backslash
            charCodes.push({ pos: j, next: line[j+1], nextCode: line.charCodeAt(j+1) });
        }
    }
    if (charCodes.length > 0) {
        console.log(`Line ${i+1}: found backslashes at`, charCodes);
    }
});

// Replace backslash-backtick with just backtick, and backslash-$ with just $
let count = 0;
let fixed = '';
for (let i = 0; i < content.length; i++) {
    if (content[i] === '\\' && (content[i+1] === '`' || content[i+1] === '$')) {
        // Skip the backslash, the next char will be kept
        count++;
        continue;
    }
    fixed += content[i];
}

console.log('Total backslash escapes removed:', count);
if (count > 0) {
    fs.writeFileSync('src/pages/InterviewSimulator.tsx', fixed, 'utf8');
    console.log('File saved.');
}
