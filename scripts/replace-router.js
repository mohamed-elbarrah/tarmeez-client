const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(dirPath);
    });
}

walk(path.join(__dirname, '../components/pages'), (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let original = fs.readFileSync(filePath, 'utf-8');
        let content = original;

        // React Router to Next.js conversions

        // Replace imports
        if (content.includes('react-router')) {
            content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]react-router['"];?/g, (match, importsStr) => {
                let imports = importsStr.split(',').map(s => s.trim());
                let nextLines = [];
                let navImports = [];

                if (imports.includes('Link')) {
                    nextLines.push('import Link from "next/link";');
                }
                if (imports.includes('useNavigate')) {
                    navImports.push('useRouter');
                }
                if (imports.includes('useParams')) {
                    navImports.push('useParams');
                }
                if (imports.includes('useLocation')) {
                    navImports.push('usePathname');
                }

                if (navImports.length > 0) {
                    nextLines.push(`import { ${navImports.join(', ')} } from "next/navigation";`);
                }
                return nextLines.join('\n');
            });
        }

        // Replace Link props
        // Careful not to replace inside other components that might have `to=`
        content = content.replace(/<Link([^>]+)to=/g, '<Link$1href=');

        // Hooks adjustments
        content = content.replace(/useNavigate\(/g, 'useRouter(');
        content = content.replace(/useLocation\(/g, 'usePathname(');
        content = content.replace(/const location = usePathname\(\);?/g, 'const pathname = usePathname();\n  const location = { pathname };');

        // Write if changed
        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log('Updated', filePath);
        }
    }
});

console.log('Replacement done.');
