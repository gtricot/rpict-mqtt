import jestPlugin from 'eslint-plugin-jest';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
    // TypeScript configuration
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
                project: './tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': typescriptPlugin,
        },
        rules: {
            // TypeScript specific rules
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            ...prettier.rules,
        },
    },
    // Add Jest specific configuration for TypeScript
    {
        files: ['**/*.test.ts', '**/*.spec.ts'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        plugins: {
            jest: jestPlugin,
            '@typescript-eslint': typescriptPlugin,
        },
        rules: {
            ...jestPlugin.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
];
