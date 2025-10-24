#!/bin/bash

# This script creates simple placeholder icons for the Chrome extension
# These can be replaced with better icons later using generate-icons.html or generate-icons.py

echo "Creating placeholder icons..."

# Create a simple colored square for icon16.png (16x16 purple square)
cat > icon16.png << 'EOF'
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz
AAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABNSURB
VDiN7ZMxDgAgCAPh/z+aGDQhqYPRQXd6ScPQAgDM7H0CgKqWiNxEZKmq3f/gFwCwqto9XgGgA4Cd
/QLAnYh0VbVbVe0AwANZmQ0h3xv5GQAAAABJRU5ErkJggg==
EOF

echo "✓ icon16.png created"

# For now, let's create a note that users should generate proper icons
cat > README_ICONS.txt << 'EOT'
ICON GENERATION INSTRUCTIONS
=============================

The extension requires icon files in three sizes: 16x16, 48x48, and 128x128 pixels.

You have three options to generate the icons:

OPTION 1: Use the HTML Generator (Easiest)
------------------------------------------
1. Open 'generate-icons.html' in your web browser
2. Click "Generate All Icons"
3. Save the downloaded PNG files in this icons folder
4. Rename them to: icon16.png, icon48.png, icon128.png

OPTION 2: Use the Python Script
--------------------------------
1. Install Pillow: pip install pillow
2. Run: python3 generate-icons.py
3. Icons will be generated automatically

OPTION 3: Create Your Own Icons
--------------------------------
Create PNG files with these exact names and sizes:
- icon16.png (16x16 pixels)
- icon48.png (48x48 pixels)
- icon128.png (128x128 pixels)

Design Tips:
- Use the Azure Logic Apps brand colors (blue/purple gradient)
- Include a workflow/diagram symbol
- Keep it simple and recognizable at small sizes

TEMPORARY WORKAROUND:
--------------------
Until you generate proper icons, you can use simple colored squares.
The extension will still work, just with basic placeholder icons.
EOT

echo "✓ README_ICONS.txt created"

echo ""
echo "Please generate proper icons using one of these methods:"
echo "1. Open generate-icons.html in a browser"
echo "2. Run: python3 generate-icons.py (requires Pillow)"
echo "3. Create your own PNG icons manually"
echo ""
echo "See README_ICONS.txt for detailed instructions"
