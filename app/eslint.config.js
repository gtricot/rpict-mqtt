import jestPlugin from 'eslint-plugin-jest';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
    // Folder exclusions
    {
        ignores: ['coverage/**', 'dist/**'],
    },
    // TypeScript source files configuration
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: typescriptParser,
            ecmaVersion: 2024,
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
            parserOptions: {
                project: './tsconfig.eslint.json',
            },
        },
        plugins: {
            '@typescript-eslint': typescriptPlugin,
        },
        rules: {
            ...typescriptPlugin.configs.recommended.rules,
            ...prettier.rules,
        },
    },
    // Jest specific configuration for TypeScript
    {
        files: ['**/*.test.ts', '**/*.spec.ts'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                project: './tsconfig.eslint.json',
            },
        },
        plugins: {
            jest: jestPlugin,
            '@typescript-eslint': typescriptPlugin,
        },
        rules: {
            ...typescriptPlugin.configs.recommended.rules,
            ...jestPlugin.configs.recommended.rules,
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
];
