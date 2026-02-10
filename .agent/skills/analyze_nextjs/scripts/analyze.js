const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const searchDirs = ['app', 'src', 'components', 'lib', 'utils', 'hooks'];

const results = {
    serverToClientLeaks: [],
    clientComponentMetadata: [],
    dangerousHtml: [],
    hardcodedSecrets: [],
    evalUsage: [],
    totalFilesScanned: 0,
};

const secretPatterns = [
    /sk_[a-zA-Z0-9]{20,}/,  // Stripe/OpenAI like
    /ey[a-zA-Z0-9]{30,}/,   // JWT/Base64 tokens
    /AIza[a-zA-Z0-9]{35}/,  // Google API Key
];

const sensitiveServerImports = [
    'fs', 'path', 'os', 'child_process', // Node.js built-ins
    '@prisma/client', 'pg', 'mysql2', 'mongoose', // Databases
    'jsonwebtoken', 'bcrypt', // Auth/Sensitive logic
];

function scanDirectory(dir) {
    const fullPath = path.join(projectRoot, dir);
    if (!fs.existsSync(fullPath)) return;

    const items = fs.readdirSync(fullPath);

    items.forEach(item => {
        const itemPath = path.join(fullPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            if (item !== 'node_modules' && item !== '.next' && item !== '.git') {
                scanDirectory(path.relative(projectRoot, itemPath));
            }
        } else if (stat.isFile()) {
            const ext = path.extname(item);
            if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
                analyzeFile(itemPath);
            }
        }
    });
}

function analyzeFile(filePath) {
    results.totalFilesScanned++;
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(projectRoot, filePath);

    const isClient = content.includes('"use client"') || content.includes("'use client'");

    // 1. Check for Server Imports in Client Components
    if (isClient) {
        sensitiveServerImports.forEach(mod => {
            // Very basic import check: import ... from 'mod' or require('mod')
            const regex = new RegExp(`(import\\s+.*\\s+from\\s+['"]${mod}['"]|require\\(['"]${mod}['"]\\))`);
            if (regex.test(content)) {
                results.serverToClientLeaks.push({ file: relativePath, module: mod });
            }
        });

        // 2. Check for Metadata export in Client Components (Next.js error)
        if (content.match(/export\s+(const|var|let)\s+metadata\s*:/) || content.match(/export\s+const\s+metadata\s*=/)) {
            results.clientComponentMetadata.push({ file: relativePath });
        }
    }

    // 3. Security: dangerouslySetInnerHTML
    if (content.includes('dangerouslySetInnerHTML')) {
        results.dangerousHtml.push({ file: relativePath });
    }

    // 4. Security: eval()
    if (content.match(/\beval\(/)) {
        results.evalUsage.push({ file: relativePath });
    }

    // 5. Security: Hardcoded Secrets
    // Skip environment files or config files that might legit have public keys
    if (!relativePath.includes('.env') && !relativePath.includes('config')) {
        secretPatterns.forEach(pattern => {
            const match = content.match(pattern);
            if (match) {
                // Mask the secret for display
                const masked = match[0].substring(0, 4) + '...';
                results.hardcodedSecrets.push({ file: relativePath, secret: masked });
            }
        });
    }
}

// Start Analysis
console.log('Starting Next.js Code Analysis...');
searchDirs.forEach(dir => scanDirectory(dir));

console.log('\n--- Analysis Summary ---');
console.log(`Files Scanned: ${results.totalFilesScanned}`);

function printIssues(title, issues, detailFn) {
    if (issues.length > 0) {
        console.log(`\n❌ ${title}: ${issues.length} issues found`);
        issues.forEach(i => console.log(`   - ${detailFn(i)}`));
    } else {
        console.log(`\n✅ ${title}: No issues found`);
    }
}

printIssues('Sensitive Imports in Client Components', results.serverToClientLeaks, i => `${i.file} imports '${i.module}'`);
printIssues('Metadata Export in Client Components', results.clientComponentMetadata, i => `${i.file}`);
printIssues('Dangerous HTML Usage (XSS Risk)', results.dangerousHtml, i => `${i.file}`);
printIssues('Eval Usage', results.evalUsage, i => `${i.file}`);
printIssues('Potential Hardcoded Secrets', results.hardcodedSecrets, i => `${i.file} (found potential secret: ${i.secret})`);

if (results.serverToClientLeaks.length === 0 &&
    results.clientComponentMetadata.length === 0 &&
    results.dangerousHtml.length === 0 &&
    results.evalUsage.length === 0 &&
    results.hardcodedSecrets.length === 0) {
    console.log('\n🎉 Great job! No major Next.js structural or security issues found.');
} else {
    console.log('\n⚠️  Please review the warnings above.');
}
