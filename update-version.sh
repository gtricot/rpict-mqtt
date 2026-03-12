#!/bin/bash

set -e

NEW_VERSION=$1

if [ -z "$NEW_VERSION" ]; then
    echo "Usage: $0 <new_version>"
    echo "Example: $0 4.0.2"
    exit 1
fi

# Get current version from app/package.json
CURRENT_VERSION=$(grep '"version":' app/package.json | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')

if [ -z "$CURRENT_VERSION" ]; then
    echo "Error: Could not determine current version from app/package.json"
    exit 1
fi

echo "Updating version from $CURRENT_VERSION to $NEW_VERSION"

# Update app/package.json and app/package-lock.json (only the root package version)
(cd app && npm version "$NEW_VERSION" --no-git-tag-version)

# Update docs/package.json and docs/package-lock.json (only the root package version)
(cd docs && npm version "$NEW_VERSION" --no-git-tag-version)

# Update docs/_coverpage.md
sed -i "s/rpict-mqtt\*\* <small>$CURRENT_VERSION<\/small>/rpict-mqtt** <small>$NEW_VERSION<\/small>/" docs/_coverpage.md

# Add changelog entry at the top (after the # Changelog heading)
TODAY=$(date +%Y-%m-%d)
sed -i "s/^# Changelog$/# Changelog\n\n## $NEW_VERSION ($TODAY)\n\n- TODO: Add changelog description/" docs/changelog/README.md

echo ""
echo "Version updated to $NEW_VERSION"
echo "Don't forget to fill in the changelog entry in docs/changelog/README.md"
