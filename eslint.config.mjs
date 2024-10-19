import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginStorybook from "eslint-plugin-storybook"; // Import the Storybook plugin
import babelEslintParser from "@babel/eslint-parser"; // Ensure you import the Babel parser

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        // Add any other globals your project may need
      },
      parser: babelEslintParser, // Use the imported Babel parser
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Enable JSX support
        },
        ecmaVersion: 2020, // Use ECMAScript 2020 features
        sourceType: 'module', // Allow for the use of imports
        requireConfigFile: false, // Allow Babel parser to work without a config file
      },
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the version of React
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // Disable rule requiring React in scope
      'react/jsx-no-bind': [
        'error',
        {
          ignoreRefs: true, // Ignore refs if you use them
          allowArrowFunctions: true, // Allow arrow functions
        },
      ],
    },
  },
  {
    files: ["**/*.stories.{js,jsx,mjs,cjs}"], // Apply Storybook rules to story files
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        // Add any other globals your project may need for Storybook
      },
      parser: babelEslintParser, // Use the Babel parser for Storybook files
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Enable JSX support
        },
        ecmaVersion: 2020, // Use ECMAScript 2020 features
        sourceType: 'module', // Allow for the use of imports
        requireConfigFile: false, // Allow Babel parser to work without a config file
      },
    },
    plugins: {
      storybook: pluginStorybook, // Use Storybook plugin
    },
    rules: {
      // Add any specific rules for Storybook here, if needed
    },
  },
  pluginJs.configs.recommended, // ESLint recommended rules
  pluginReact.configs.flat.recommended, // React recommended rules
];
