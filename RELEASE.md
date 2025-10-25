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

### Step 6: Publish to Chrome Web Store

#### Prerequisites (First-Time Only)
- Chrome Web Store developer account registered ($5 USD)
- Developer dashboard access: https://chrome.google.com/webstore/developer/dashboard

#### Upload New Version

1. **Navigate to Dashboard**:
   - Go to https://chrome.google.com/webstore/developer/dashboard
   - Click on "Logic App Manager" item

2. **Upload New Package**:
   - Click "Package" tab
   - Click "Upload new package"
   - Select `logic-app-manager-v1.1.0.zip`
   - Wait for validation (automatic)

3. **Review Store Listing** (if needed):
   - Verify description is up to date
   - Check screenshots are current
   - Confirm privacy policy URL is accessible

4. **Submit for Review**:
   - Click "Submit for Review"
   - Choose "Automatic publishing" (published immediately after approval)
   - Confirm submission

5. **Monitor Review Status**:
   - Review typically takes 24-72 hours
   - Email notification on approval/rejection
   - Dashboard shows current status

6. **After Approval**:
   - Extension automatically published (if automatic publishing selected)
   - Users receive automatic update within hours
   - Verify update appears on store listing

#### Publishing Timeline

- **Standard Review**: 24-72 hours (typical for this extension)
- **Extended Review**: Up to 3 weeks (contact support if exceeded)
- **Update Propagation**: 4-6 hours after publication

#### Troubleshooting

**Review Rejected**:
- Read rejection email carefully for specific violations
- Fix issues in code/assets
- Increment patch version (e.g., 1.1.0 → 1.1.1)
- Re-package and resubmit

**Validation Errors on Upload**:
- Verify manifest.json syntax (use `cat manifest.json | python -m json.tool`)
- Check all required fields are present
- Ensure icons exist at declared paths
- Verify ZIP structure is correct

**Review Taking Too Long**:
- Standard wait: 72 hours
- After 3 weeks: Contact chrome-webstore-support@google.com with extension ID

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

## Distribution Channels

Logic App Manager is distributed through two channels:

### Chrome Web Store (Primary)
- **Target Audience**: General users, one-click installation
- **Benefits**: Automatic updates, increased discoverability, user trust
- **Update Process**: See "Step 6: Publish to Chrome Web Store" above
- **URL**: https://chrome.google.com/webstore/detail/[extension-id]

### GitHub Releases (Secondary)
- **Target Audience**: Technical users, enterprise deployments, beta testers
- **Benefits**: Full control, no review delay, manual installation
- **Update Process**: Standard GitHub Release workflow (Steps 1-5)
- **URL**: https://github.com/albertsikkema/logic-app-manager/releases

**Recommendation**: Publish to both channels for maximum reach and flexibility.

## Chrome Web Store Post-Publication

After Chrome Web Store publication:

### Immediate Actions (First 24 Hours)

1. **Verify Store Listing**:
   - Search "Logic App Manager" on Chrome Web Store
   - Verify extension appears in results
   - Check icon, screenshots, description display correctly

2. **Test Installation**:
   - Open store page in incognito window
   - Install extension via "Add to Chrome"
   - Test all features in Azure Portal
   - Verify no console errors

3. **Update GitHub Release**:
   - Add Chrome Web Store link to release notes
   - Pin release as latest

4. **Announce** (Optional):
   - Social media, relevant communities
   - Email to early users/testers

### Ongoing Monitoring

**Weekly**:
- Check dashboard for user reviews
- Review installation/uninstall metrics
- Respond to user reviews (aim for <72 hours)

**Monthly**:
- Export metrics to CSV
- Analyze trends (installs, uninstalls, retention)
- Identify common support issues

**Quarterly**:
- Review privacy policy for needed updates
- Check for Chrome Web Store policy changes
- Consider promotional image refresh

### User Review Management

**Best Practices**:
- Respond to all reviews within 72 hours
- Thank users for positive feedback
- Address issues in negative reviews with solutions
- Update FAQ or docs based on common questions
- Never argue with users - be professional and helpful

**Sample Responses**:

*For bug reports*:
> "Thank you for reporting this! We're investigating and will release a fix in version X.X.X. You can track progress at [GitHub issue link]."

*For feature requests*:
> "Great suggestion! We've added this to our roadmap. Track progress at [GitHub issue link] and feel free to contribute if interested!"

*For positive reviews*:
> "Thank you for the kind words! We're glad Logic App Manager is helpful for your Azure workflow. 🙏"

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
