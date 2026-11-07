# Playwright TypeScript Automation Framework

This is a beginner-friendly UI automation framework for testing the EA
Employee application with Playwright and TypeScript.

## Prerequisites

- Node.js 18 or newer
- Internet access for the EA Employee tests

## Installation

```bash
npm install
npx playwright install
```

### Windows PowerShell execution-policy fix

If PowerShell displays `npm.ps1 cannot be loaded because running scripts is
disabled`, allow locally installed scripts for your Windows user. Open
PowerShell and run:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Confirm with `Y`, restart the VS Code terminal, and then use the normal `npm`
commands. This changes only the current Windows user, not the whole machine.

If you cannot change the execution policy, use the Windows command shims
instead:

```powershell
npm.cmd install
npm.cmd test
npm.cmd run test:headed
npm.cmd run report
```

## Run tests

```bash
# Run all tests headlessly
npm test

# Run with the browser visible
npm run test:headed

# Open Playwright Inspector for step-by-step debugging
npm run test:debug

# Type-check the project
npm run build

# Open the latest HTML report
npm run report
```

## Playwright MCP in VS Code

This workspace includes a project-scoped MCP configuration at
[.vscode/mcp.json](./.vscode/mcp.json). VS Code uses it to start the official
Playwright MCP server with `npx`, so no additional dependency is required in
`package.json`.

To use it:

1. Open this folder in VS Code with the GitHub Copilot Chat extension enabled.
2. Open the Chat view, select **Agent**, and make sure the `playwright` MCP
   server is enabled when prompted.
3. Ask Copilot to inspect or interact with a page. The MCP server will launch
   its own Playwright browser session.

The MCP browser session is separate from the automated test runner. Test
execution still uses the settings in
[playwright.config.ts](./playwright.config.ts), including the base URL,
timeouts, and reporting.

## Framework flow

1. Playwright reads [playwright.config.ts](./playwright.config.ts).
2. The configuration selects the browser, base URL, timeouts, retries,
   screenshots, videos, traces, and reporters.
3. Playwright discovers tests inside [tests](./tests).
4. The test creates an `EAEmployeePage` object from
   [src/pages/EAEmployeePage.ts](./src/pages/EAEmployeePage.ts).
5. The page object owns locators and user actions such as `login()`,
   `openEmployees()`, and `searchByName()`. This keeps selectors out of test
   cases and makes maintenance easier.
6. Playwright runs browser actions and assertions.
7. Results are saved under `test-results/`.

## Project structure

```text
.
├── src/
│   └── pages/                 # Page Object Model classes
│       └── EAEmployeePage.ts
├── tests/                    # Test specifications
│   └── ea-employee.spec.ts
├── playwright.config.ts      # Browser, execution, and reporting settings
├── tsconfig.json             # TypeScript compiler settings
├── package.json              # Commands and dependencies
└── README.md                 # This guide
```

## Reporting and failure evidence

Three reporters are enabled:

- **List reporter:** readable results in the terminal.
- **HTML reporter:** interactive report at `test-results/html-report`.
- **JUnit reporter:** XML results at `test-results/results.xml` for CI tools.

On failure, Playwright keeps screenshots and videos. A trace is captured on
the first retry, which can be opened from the HTML report to inspect actions,
DOM snapshots, and network information.

## Adding a new test

1. Add or reuse a page object in `src/pages`.
2. Create a `.spec.ts` file in `tests`.
3. Use Playwright fixtures such as `{ page }`.
4. Prefer user-facing locators (`getByRole`, `getByLabel`, and
   `getByPlaceholder`) over CSS/XPath selectors.
5. Run `npm run build` and `npm test` before committing.

Example:

```ts
import { test, expect } from '@playwright/test';

test('example', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/EAEmployee/i);
});
```

## CI usage

The configuration automatically uses two retries and one worker when the
`CI` environment variable is set:

```bash
CI=true npm test
```

On Windows PowerShell:

```powershell
$env:CI = "true"
npm test
```
