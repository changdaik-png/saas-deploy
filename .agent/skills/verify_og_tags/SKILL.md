---
name: verify_og_tags
description: Verify Open Graph meta tags implementation in Next.js project.
---

# Verify Open Graph (OG) Meta Tags

This skill verifies that the Next.js project has properly implemented Open Graph meta tags, specifically focusing on the root layout and page metadata configuration.

## Usage

Run the `verify_og_tags.js` script using Node.js.

```bash
node .agent/skills/verify_og_tags/scripts/verify_og_tags.js
```

## Details

The script performs the following checks:
1.  **Root Layout (`app/layout.tsx`) Analysis**:
    - Checks for `export const metadata`.
    - Verifies presence of `metadataBase` (crucial for OG images).
    - Checks for `openGraph` configuration object.
    - Specifically looks for: `title`, `description`, `url`, `siteName`, `locale`, and `images`.
2.  **Open Graph Image File**:
    - Checks for the existence of `opengraph-image.tsx` (dynamic) or `opengraph-image.png/jpg` (static) in the `app` directory.
3.  **Page Level Analysis (`app/**/page.tsx`)**:
    - Scans page files to see if they define `metadata` (optional but good practice for specific pages).

It outputs a summary of the findings, highlighting missing critical tags or configuration.
