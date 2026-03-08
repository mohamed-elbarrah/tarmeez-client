const fs = require('fs');
const path = require('path');

// The pages folder is at components/pages
// In Vite, pages were at src/app/pages, and UI components at src/app/components
// So relative imports like ../../components/ui/button resolved correctly
// Now in Next.js, pages are at components/pages and UI is at components/ui
// So we need to replace "../../components/" with "@/components/"
// And also "../../figma/" or similar that might reference vite-components

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const fullPath = path.join(dir, f);
        const isDirectory = fs.statSync(fullPath).isDirectory();
        isDirectory ? walk(fullPath, callback) : callback(fullPath);
    });
}

const pagesDir = path.join(__dirname, '../components/pages');

let updatedCount = 0;

walk(pagesDir, (filePath) => {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.css')) return;

    let original = fs.readFileSync(filePath, 'utf-8');
    let content = original;

    // Replace ../../components/ with @/components/
    // These were relative paths in Vite pointing to src/app/components from src/app/pages/subdir
    content = content.replace(/from ["']\.\.\/\.\.\/components\//g, 'from "@/components/');
    content = content.replace(/from ["']\.\.\/\.\.\/\.\.\/components\//g, 'from "@/components/');

    // Handle imports like "../components/ui/button" (one level deep)
    // These would come from pages that imported from pages/subdir context already not double-nested
    content = content.replace(/from ["']\.\.\/components\//g, 'from "@/components/');

    // Also fix figma imports
    content = content.replace(/from ["']\.\.\/\.\.\/figma\//g, 'from "@/components/vite-components/figma/');
    content = content.replace(/from ["']\.\.\/\.\.\/\.\.\/figma\//g, 'from "@/components/vite-components/figma/');
    content = content.replace(/from ["']\.\.\/figma\//g, 'from "@/components/vite-components/figma/');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Fixed imports in:', path.relative(pagesDir, filePath));
        updatedCount++;
    }
});

console.log(`\nDone. Updated ${updatedCount} files.`);
