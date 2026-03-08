const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, '../components/ui');

let count = 0;
fs.readdirSync(uiDir).forEach(file => {
    if (!file.endsWith('.tsx') && !file.endsWith('.ts')) return;
    const filePath = path.join(uiDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // Replace from "./utils" with from "@/lib/utils"
    content = content.replace(/from ["']\.\/utils["']/g, 'from "@/lib/utils"');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Fixed:', file);
        count++;
    }
});
console.log(`Done. Fixed ${count} files.`);
