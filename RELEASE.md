# Release Instructions

This document explains how to create and publish a new release of Logic App Manager.

## Pre-Release Checklist

Before creating a release, ensure:

- [ ] All features are tested and working
- [ ] Extension loads without errors in Chrome
- [ ] Icons display correctly (both active and inactive states)
- [ ] Backup and restore functions work on Azure Portal
- [ ] README.md is up to date
- [ ] No console errors or warnings
- [ ] Privacy policy is current

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR.MINOR.PATCH** (e.g., 1.0.0)
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## Creating a Release

### Step 1: Update Version

1. Edit `manifest.json` and update the version:
   ```json
   "version": "1.1.0"
   ```

2. Commit the version change:
   ```bash
   git add manifest.json
   git commit -m "Bump version to 1.1.0"
   ```

### Step 2: Create Package

Run the package script:

```bash
./package.sh
```

This creates a ZIP file: `logic-app-manager-v1.1.0.zip`

### Step 3: Test the Package

1. Extract the ZIP to a test folder
2. Load it in Chrome (`chrome://extensions/` → Load unpacked)
3. Test all features:
   - Icon changes when navigating to/from Azure Portal
   - Backup creates a JSON file
   - Restore uploads and applies changes
   - UI displays correctly

### Step 4: Create Git Tag

```bash
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin main
git push origin v1.1.0
```

### Step 5: Create GitHub Release

1. Go to https://github.com/albertsikkema/logic-app-manager/releases
2. Click **"Draft a new release"**
3. Choose the tag you just created (v1.1.0)
4. Set release title: `Logic App Manager v1.1.0`
5. Write release notes (see template below)
6. Attach the ZIP file: `logic-app-manager-v1.1.0.zip`
7. Click **"Publish release"**

## Release Notes Template

```markdown
## What's New in v1.1.0

### Features
- ✨ Added dynamic icon states (blue on Azure Portal, gray elsewhere)
- ✨ New feature description here

### Improvements
- 🔧 Improved error handling for API calls
- 🔧 Updated UI styling

### Bug Fixes
- 🐛 Fixed issue with token extraction
- 🐛 Fixed another bug

### Documentation
- 📝 Updated README with new features
- 📝 Added privacy policy

## Installation

1. Download `logic-app-manager-v1.1.0.zip` below
2. Extract to a folder
3. Open Chrome and go to `chrome://extensions/`
4. Enable Developer Mode
5. Click "Load unpacked" and select the extracted folder

## Full Changelog

**Full Changelog**: https://github.com/albertsikkema/logic-app-manager/compare/v1.0.0...v1.1.0
```

## Post-Release

After publishing:

1. Verify the release appears on GitHub
2. Test downloading and installing the release ZIP
3. Update project board/issues if applicable
4. Announce on relevant channels (if any)

## Troubleshooting

### Package script fails

Make sure the script is executable:
```bash
chmod +x package.sh
```

### ZIP file too large

The package should be under 1MB. If larger, check for:
- Unnecessary files being included
- Large image files
- Development artifacts

### Git push rejected

Make sure you've committed all changes:
```bash
git status
git add .
git commit -m "Prepare for release"
git push
```

## Automated Releases (Future)

Consider setting up GitHub Actions for automated releases:
- Automatically create ZIP on tag push
- Run tests before release
- Auto-generate changelog

See `.github/workflows/release.yml` (to be created)
