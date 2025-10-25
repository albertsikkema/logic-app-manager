#!/bin/bash

# Package Logic App Manager extension for distribution
# Creates a ZIP file excluding development files

set -e

# Get version from manifest.json
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\(.*\)".*/\1/')

# Output filename
OUTPUT="logic-app-manager-v${VERSION}.zip"

echo "📦 Packaging Logic App Manager v${VERSION}..."

# Remove old package if exists
if [ -f "$OUTPUT" ]; then
    echo "   Removing old package: $OUTPUT"
    rm "$OUTPUT"
fi

# Create ZIP with only necessary files
echo "   Creating ZIP archive..."
zip -r "$OUTPUT" \
    manifest.json \
    background.js \
    content.js \
    popup.html \
    popup.js \
    options.html \
    options.js \
    styles.css \
    icons/*.png \
    icons/*.svg \
    LICENSE \
    PRIVACY_POLICY.md \
    README.md \
    screenshot.png \
    -x "*.DS_Store" \
    -x "__MACOSX/*"

# Show file size
FILE_SIZE=$(ls -lh "$OUTPUT" | awk '{print $5}')

echo ""
echo "✅ Package created successfully!"
echo "   File: $OUTPUT"
echo "   Size: $FILE_SIZE"
echo ""
echo "📋 Next steps:"
echo "   1. Test the extension by loading it in Chrome"
echo "   2. Create a new release on GitHub (see RELEASE.md)"
echo "   3. Upload $OUTPUT to the GitHub release"
echo "   4. Upload $OUTPUT to Chrome Web Store Dashboard"
echo "   5. Submit for review on Chrome Web Store"
echo ""
echo "📚 See RELEASE.md for detailed publishing instructions"
echo ""
