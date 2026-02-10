const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const appDir = path.join(rootDir, 'app');

function verifyOGTags() {
    console.log('--- Verifying Open Graph Meta Tags ---\n');

    // 1. Check Root Layout (app/layout.tsx)
    const rootLayoutPath = path.join(appDir, 'layout.tsx');
    if (!fs.existsSync(rootLayoutPath)) {
        console.error('❌ Root layout file (app/layout.tsx) not found.');
        return;
    }

    console.log(`Checking ${path.relative(rootDir, rootLayoutPath)}...`);
    const layoutContent = fs.readFileSync(rootLayoutPath, 'utf8');

    // Check for 'export const metadata: Metadata =' or 'export const metadata ='
    if (!layoutContent.match(/export\s+const\s+metadata\s*:?\s*(Metadata)?\s*=\s*{/)) {
        console.warn('⚠️ No "metadata" export found in root layout. This is crucial for default OG tags.');
    } else {
        console.log('✅ Found metadata export.');

        // Metadata Base
        if (layoutContent.includes('metadataBase:')) {
            console.log('✅ Found "metadataBase" (Required for OG images).');
        } else {
            console.warn('⚠️ Missing "metadataBase". This might cause issues with OG image URLs in production.');
        }

        // Open Graph Object
        const ogMatch = layoutContent.match(/openGraph:\s*{([\s\S]*?)}/);
        if (ogMatch) {
            console.log('✅ Found "openGraph" configuration.');
            const ogContent = ogMatch[1];

            checkField(ogContent, 'title', 'openGraph.title');
            checkField(ogContent, 'description', 'openGraph.description');
            checkField(ogContent, 'url', 'openGraph.url');
            checkField(ogContent, 'siteName', 'openGraph.siteName');
            checkField(ogContent, 'locale', 'openGraph.locale');
            checkField(ogContent, 'images', 'openGraph.images');
            checkField(ogContent, 'type', 'openGraph.type');
        } else {
            console.warn('⚠️ Missing "openGraph" configuration within metadata.');
        }

        // Twitter Object
        const twitterMatch = layoutContent.match(/twitter:\s*{([\s\S]*?)}/);
        if (twitterMatch) {
            console.log('✅ Found "twitter" configuration.');
            const twContent = twitterMatch[1];
            checkField(twContent, 'card', 'twitter.card');
            checkField(twContent, 'title', 'twitter.title');
            checkField(twContent, 'description', 'twitter.description');
            checkField(twContent, 'images', 'twitter.images');
        } else {
            console.warn('⚠️ Missing "twitter" configuration within metadata.');
        }
    }

    // 2. Check for Open Graph Image File
    const ogImageFiles = ['opengraph-image.tsx', 'opengraph-image.png', 'opengraph-image.jpg', 'opengraph-image.jpeg'];
    const foundOgImage = ogImageFiles.find(name => fs.existsSync(path.join(appDir, name)));

    if (foundOgImage) {
        console.log(`\n✅ Found Open Graph Image file: app/${foundOgImage}`);
    } else {
        const hasManualImage = layoutContent.includes('images:') && !layoutContent.includes('opengraph-image'); // rough check
        if (hasManualImage) {
            console.log('\n✅ Found manual "images" configuration in metadata (no opengraph-image file, relying on metadata).');
        } else {
            console.warn('\n⚠️ No "opengraph-image.tsx" or image file found in app directory. Ensure you have defined OG images manually in metadata.');
        }
    }

    // 3. Optional: Quick scan of other pages
    console.log('\n--- Scanning other pages for metadata overrides ---');
    scanPages(appDir);
}

function checkField(content, fieldName, displayName) {
    // Regex to find property key (e.g., title: "..." or title:)
    const regex = new RegExp(`${fieldName}\\s*:`);
    if (regex.test(content)) {
        console.log(`  - ✅ ${displayName}`);
        return true;
    } else {
        console.warn(`  - ⚠️ Missing ${displayName}`);
        return false;
    }
}

function scanPages(dir) {
    const items = fs.readdirSync(dir);

    items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (item !== 'api' && item !== 'components') { // Skip non-page directories if obvious
                scanPages(fullPath);
            }
        } else if (item === 'page.tsx' || item === 'page.js') {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.match(/export\s+const\s+metadata/)) {
                const relPath = path.relative(appDir, fullPath);
                console.log(`ℹ️ Found metadata override in: app/${relPath}`);
            }
        }
    });
}

verifyOGTags();
