import jestPlugin from 'eslint-plugin-jest';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...jestPlugin.environments.globals.globals,
            },
        },
        plugins: {
            jest: jestPlugin,
        },
        rules: {
            // Core ESLint rules that don't conflict with Prettier
            'no-unused-vars': 'error',
            'no-undef': 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            ...prettier.rules, // This disables ESLint rules that conflict with Prettier
        },
    },
    // Add Jest specific configuration
    {
        files: ['**/*.test.js', '**/*.spec.js'],
        plugins: {
            jest: jestPlugin,
        },
        rules: {
            ...jestPlugin.configs.recommended.rules,
        },
    },
];
