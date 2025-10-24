# Logic App Manager v1.1.0 - GitHub Integration

🚀 **Major feature update!** This release adds GitHub integration for centralized backup and version control.

## ⚠️ Important Disclaimer

**USE AT YOUR OWN RISK!** This extension modifies Azure Logic Apps in your environment. The author is NOT liable for any data loss, production outages, or other damages. Always test in non-production environments first. See full disclaimer in README.

## ✨ What's New

### GitHub Integration
- ✨ **Backup to GitHub** - Push Logic App definitions directly to GitHub repositories
- ✨ **Version History** - Browse commit history and restore from specific versions
- ✨ **Organized Storage** - Files saved as `apps/{workflowName}/{YYYY-MM-DD}-workflow.json`
- ✨ **Secure Token Storage** - GitHub Personal Access Tokens stored in `chrome.storage.session`
- ✨ **Options Page** - Configure GitHub repository and PAT in extension settings

### Improvements
- 🔧 **Backward Compatibility** - File-based backup/restore still available as fallback
- 🔧 **Visual Separators** - Clear UI distinction between GitHub and file-based options
- 🔧 **Dual-Mode Operation** - Automatically show/hide GitHub options based on configuration

### Documentation
- 📝 Updated README with GitHub integration instructions
- 📝 Added CLAUDE.md for development workflow
- 📝 Added RELEASE.md with release process documentation

## 📦 Installation

1. Download `logic-app-manager-v1.1.0.zip` from the Assets section below
2. Extract the ZIP file to a folder on your computer
3. Open Chrome and go to `chrome://extensions/`
4. Enable **Developer Mode** (toggle in top-right)
5. Click **"Load unpacked"**
6. Select the extracted folder
7. The extension icon will appear in your toolbar!

## 🚀 GitHub Setup (Optional)

To use GitHub integration:

1. Click the extension icon and select **"Options"**
2. Enter your GitHub repository (format: `owner/repo`)
3. Generate a GitHub Personal Access Token with `repo` scope
4. Enter the token and click **"Save Settings"**
5. Test the connection to verify it works

Once configured, you'll see **"Backup to GitHub"** and **"Restore from GitHub"** buttons in the popup.

## 🚀 Usage

### Backup to GitHub
1. Navigate to your Logic App in Azure Portal
2. Click the extension icon
3. Click **"Backup to GitHub"**
4. Enter a commit message
5. The workflow is saved to your repository

### Restore from GitHub
1. Navigate to the Logic App you want to restore
2. Click the extension icon
3. Click **"Restore from GitHub"**
4. Select a version from the commit history
5. Confirm the restore operation
6. Refresh Azure Portal to see changes

### File-Based Backup/Restore
The original file-based backup and restore functionality remains available:
- Click **"Backup to File"** to download JSON
- Click **"Restore from File"** to upload JSON

## 📋 Technical Details

### GitHub API Integration
- Uses GitHub REST API v2022-11-28
- Authenticates with Personal Access Token
- Requires `repo` scope for private repositories
- Rate limit: 5,000 requests/hour (authenticated)

### File Organization
- Path format: `apps/{workflowName}/{YYYY-MM-DD}-workflow.json`
- Commit messages include workflow name and timestamp
- Full commit history maintained for version control

### Security
- Tokens stored in `chrome.storage.session` (cleared on browser close)
- No token logging or external transmission
- All API calls made directly from browser

## 🔒 Security & Privacy

- All operations performed locally in your browser
- Uses your existing Azure Portal authentication
- GitHub tokens never leave your browser
- No data sent to external servers (except GitHub/Azure APIs)
- No analytics or tracking
- Open source - audit the code yourself

## 📄 Documentation

- [README](https://github.com/albertsikkema/logic-app-manager#readme)
- [Privacy Policy](https://github.com/albertsikkema/logic-app-manager/blob/main/PRIVACY_POLICY.md)
- [Development Guide](https://github.com/albertsikkema/logic-app-manager/blob/main/CLAUDE.md)
- [Release Process](https://github.com/albertsikkema/logic-app-manager/blob/main/RELEASE.md)
- [License](https://github.com/albertsikkema/logic-app-manager/blob/main/LICENSE)

## 🐛 Known Issues

None at this time. Please report issues on the [Issues page](https://github.com/albertsikkema/logic-app-manager/issues).

## 📝 Requirements

- Chrome 88+ (Manifest V3 support)
- Active Azure Portal session
- Contributor or Owner permissions on the Logic App
- (Optional) GitHub account with Personal Access Token for GitHub integration

---

**Full Changelog**: https://github.com/albertsikkema/logic-app-manager/compare/v1.0.0...v1.1.0
