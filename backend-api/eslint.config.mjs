import eslintPluginJest from "eslint-plugin-jest";

export default [
  {
    files: ["**/*.js", "**/*.mjs"],  // Apply this config to all JS and MJS files
    languageOptions: {
      ecmaVersion: 2021,  // or use the latest ECMAScript version
      sourceType: "module",  // Ensure you're using ES modules, adjust if needed
      globals: {
        __dirname: "readonly",  // Define Node.js globals if needed
        process: "readonly",
        jest: "readonly",  // If you're using Jest for testing
      },
    },
    plugins: {
      jest: eslintPluginJest,  // Enable Jest plugin for Jest testing
    },
    rules: {
      "no-console": "warn",  // Warn about console.log statements
      "no-unused-vars": "error",  // Error for unused variables
      // Add other Node.js or custom linting rules here
    },
  },
];
