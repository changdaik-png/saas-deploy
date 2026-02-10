const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd(); // Assume running from project root
const resultsPath = path.join(rootDir, '.vitest-results.json');
const command = 'npx vitest run --reporter=json --outputFile=' + `"${resultsPath}"`;

console.log('Running tests...');
try {
    execSync(command, { stdio: 'inherit', cwd: rootDir });
    console.log('Tests completed successfully.');
} catch (error) {
    console.log('Tests failed.');
}

if (fs.existsSync(resultsPath)) {
    try {
        const rawData = fs.readFileSync(resultsPath);
        const results = JSON.parse(rawData);

        const passed = results.numPassedTests;
        const failed = results.numFailedTests;
        const total = results.numTotalTests;

        console.log('\n--- Test Summary ---');
        console.log(`Total: ${total}`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${failed}`);

        if (failed > 0) {
            console.log('\nFailed Tests:');

            // Recursive function to find failed tests in testResults
            const findFailedTests = (testResults) => {
                let failedNames = [];

                testResults.forEach(fileResult => {
                    if (fileResult.assertionResults) {
                        fileResult.assertionResults.forEach(assertion => {
                            if (assertion.status === 'failed') {
                                failedNames.push(`${fileResult.name}: ${assertion.title} ${assertion.ancestorTitles.join(' > ')}`);
                            }
                        });
                    }
                });
                return failedNames;
            };

            const failedTestNames = findFailedTests(results.testResults);
            failedTestNames.forEach(name => console.log(`- ${name}`));
        }

    } catch (parseError) {
        console.error('Error parsing test results:', parseError);
    }
} else {
    console.error('No test results file found.');
}
