---
name: analyze_nextjs
description: Analyze Next.js framework code for best practices and security vulnerabilities.
---

# Analyze Next.js Code

This skill analyzes the Next.js project structure, focusing on Server vs. Client Component usage and potential security risks.

## Usage

Run the `analyze.js` script using Node.js.

```bash
node .agent/skills/analyze_nextjs/scripts/analyze.js
```

## Details

The script scans the `app` and `src` directories to identify:
1.  **Server/Client Separation**:
    - Invalid use of metadata or async/await in Client Components.
    - Potential misuse of Client Components for sensitive logic.
2.  **Security Risks**:
    - Use of `dangerouslySetInnerHTML`.
    - Hardcoded secrets (API keys, etc.).
    - Usage of `eval()`.
    - Sensitive server-side imports in Client Components (e.g., direct DB access).

It outputs a summary of findings to the console.
