---
name: verify_tests
description: Run the Vitest test suite and report results.
---

# Verify Tests

This skill runs the Vitest test suite and provides a summary.

## Usage

Run the `run_tests.js` script using Node.js to execute tests and parse the output.

```bash
node .agent/skills/verify_tests/scripts/run_tests.js
```

## Details

The script executes `npx vitest run --reporter=json --outputFile=./.vitest-results.json` and then parses the JSON file to extract:
- Total tests passed
- Total tests failed
- List of failed test names
