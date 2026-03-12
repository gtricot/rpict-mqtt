# Copilot Coding Agent Instructions for rpict-mqtt

## Overview
**rpict-mqtt** is a Node.js/TypeScript application that reads energy and temperature data from LeChacal RPICT series devices (via serial port) and publishes it to an MQTT broker. It supports Home Assistant MQTT discovery for automatic integration. The project is containerized with Docker for Raspberry Pi deployment.

**Repository Size:** ~50MB (with node_modules and coverage), ~2MB (source code)  
**Type:** Node.js TypeScript backend service  
**Target Runtime:** Node.js v22 (as of current Dockerfile)  
**Build Tool:** npm with TypeScript compilation  
**Main Language:** TypeScript  

## Key Project Structure

```
rpict-mqtt/
├── app/                          # Main application code (npm workspace)
│   ├── src/                       # TypeScript source code
│   │   ├── index.ts              # Application entry point (main run function)
│   │   ├── config/index.ts       # Configuration parsing from env variables
│   │   ├── rpict/index.ts        # Serial port reader for RPICT device
│   │   ├── mqtt/index.ts         # MQTT client and frame publishing
│   │   ├── hass/index.ts         # Home Assistant discovery configuration
│   │   ├── log/index.ts          # Bunyan logging setup
│   │   ├── types/                # TypeScript type definitions
│   │   └── rpict/device-mapping/ # JSON files mapping sensor fields per device type
│   ├── dist/                      # Compiled JavaScript output (created by build)
│   ├── coverage/                  # Jest coverage reports (created by test)
│   ├── package.json              # Dependencies and scripts
│   ├── tsconfig.json             # TypeScript compiler configuration
│   ├── eslint.config.js          # ESLint configuration
│   ├── jest.config.js            # Jest test configuration
│   └── jest.setup.js             # Jest environment setup
├── Dockerfile                     # Multi-platform Docker build
├── entrypoint.sh                  # Docker container entry point
├── .github/workflows/build-app.yml # GitHub Actions CI/CD pipeline
└── docs/                          # Docsify documentation site

```

## Build & Validation Commands

All commands must be run from `rpict-mqtt/app` directory.

### 1. Install Dependencies
```bash
npm install
```
- **Required before any other command**
- Installs all production and development dependencies listed in package.json
- Creates `node_modules/` directory
- **Typical duration:** 30-60 seconds

### 2. Build (TypeScript Compilation)
```bash
npm run build
```
- Compiles TypeScript files in `src/` to JavaScript in `dist/` using tsc
- Runs postbuild script that copies device-mapping JSON files to `dist/rpict/device-mapping/`
- **Must be done before running tests or starting the application**
- **Typical duration:** 3-5 seconds
- **Success indicator:** No errors, `dist/` directory populated with `.js` files

### 3. Test Execution
```bash
npm test
```
- Runs Jest test suite with coverage reporting
- Generates `coverage/` directory with coverage reports
- **Coverage thresholds enforced:** 80% minimum for branches, functions, lines, and statements
- All 30 tests across 5 test suites must pass
- **Typical duration:** 5-10 seconds
- **Success indicator:** "Test Suites: 5 passed, 5 total" and "Tests: 30 passed"

### 4. Linting (ESLint)
```bash
npm run eslint
```
- Lints TypeScript source and tests using the flat ESLint config in `eslint.config.js`
- Uses `tsconfig.eslint.json` for parser project resolution so test files are linted correctly
- Ignores generated output (`dist/`, `coverage/`) to avoid false positives
- **Expected result:** no lint errors for a clean workspace
- **Known non-blocking warning:** Node may print `[MODULE_TYPELESS_PACKAGE_JSON]` for `eslint.config.js`; this is a runtime warning and does not indicate lint rule failures

### 5. Format Code (Prettier)
```bash
npm run prettier
```
- Auto-fixes code formatting using Prettier on all files
- Applies formatting in-place (modifies files)

## Recommended Command Sequences

### For Code Changes
```bash
# Always start with clean install
npm install

# Build to validate TypeScript compilation
npm run build

# Run tests to ensure no regression (all tests must pass)
npm test
```

### For Cleanup & Fresh Start
```bash
cd app
rm -rf dist coverage node_modules
npm install
npm run build
npm test
```

## Critical Architecture Details

- **Entry Point:** `src/index.ts` exports `run()` async function and auto-executes if `NODE_ENV !== 'test'`
- **Serial Communication:** Uses `serialport` v13 with readline parser at 38400 baud (configurable)
- **MQTT:** Uses `async-mqtt` v2.6.3 for async/await support
- **Logging:** Bunyan logger with configurable levels (DEBUG, INFO, WARN, ERROR)
- **Configuration:** All settings via environment variables (see `config/index.ts` for all options)
- **Device Mappings:** JSON files in `src/rpict/device-mapping/` define sensor fields per device type (RPICT3T1, RPICT3V1, RPICT4V3, RPICT7V1, RPICT8)
- **Home Assistant Integration:** Automatic MQTT discovery if `HASS_DISCOVERY=true` (default)
- **Data Processing:** Applies precision rounding, absolute value conversion, and threshold filtering to sensor readings

## CI/CD Pipeline

GitHub Actions workflow in `.github/workflows/build-app.yml`:
- Triggers on: push to `master`, all tags, and pull requests
- Builds Docker images for platforms: linux/arm/v6, linux/arm/v7, linux/arm64/v8, linux/amd64
- Pushes to Docker Hub (on non-PR builds)
- Uses Docker BuildKit for cross-platform builds
- Caches builds with GitHub Actions cache

## Dependencies to Know

**Key Production Dependencies:**
- `serialport` (v13): Serial port communication
- `async-mqtt` (v2.6.3): MQTT broker client
- `bunyan` (v1.8.15): Structured logging

**Key Dev Dependencies:**
- `typescript` (v5.9.3): Language compiler
- `jest` (v30.2.0): Test framework
- `ts-jest`: TypeScript to Jest transformer
- `eslint` (v9.39.2): Code linting
- `prettier` (v3.7.4): Code formatting

## Trust These Instructions

These instructions are comprehensive and accurate. Only perform additional searches or exploration if:
1. Instructions reference a file that doesn't exist
2. A command fails with an unexpected error not mentioned here
3. You need to add a new feature type not covered by existing patterns

For standard code changes, modifications, and bug fixes, follow the command sequences above and trust that they will work as documented.
