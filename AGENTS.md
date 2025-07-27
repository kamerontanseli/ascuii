# AGENTS.md

## Build, Lint, and Test Commands

- **Install dependencies:**  
  `npm install`
- **Start server:**  
  `npm start`
- **Run all tests:**  
  `npx vitest run`
- **Run a single test file:**  
  `npx vitest run path/to/file.test.js`
- **Run a single test by line:**  
  `npx vitest run path/to/file.test.js:10`
- **No linting is configured by default.**

## Code Style Guidelines

- **Imports:**  
  Use ES module imports in tests (`import { ... } from '...'`), CommonJS (`require`) in server code.
- **Formatting:**  
  Indent with 2 spaces. Keep lines ≤ 100 chars. Use semicolons.
- **Types:**  
  JavaScript only; no TypeScript or type annotations.
- **Naming:**  
  Use `camelCase` for variables/functions, `UPPER_SNAKE_CASE` for constants.
- **Error Handling:**  
  Always check for missing/invalid input and handle errors with appropriate HTTP status codes and JSON error messages.
- **Test Style:**  
  Use `describe`, `it`, and `expect` from Vitest. Group related tests.
- **Other:**  
  No Cursor or Copilot rules are present.  
  Keep code minimal and readable.  
  Document public endpoints and environment variables in README.md.

---

If you add linting, type checking, or formatting tools, update this file accordingly.
