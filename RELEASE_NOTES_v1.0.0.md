# Logic App Manager v1.0.0 - Initial Release

🎉 **First release of Logic App Manager!**

A Chrome extension to backup and restore Azure Logic Apps directly from the Azure Portal.

## ⚠️ Important Disclaimer

**USE AT YOUR OWN RISK!** This extension modifies Azure Logic Apps in your environment. The author is NOT liable for any data loss, production outages, or other damages. Always test in non-production environments first. See full disclaimer in README.

## ✨ Features

- ✅ **Backup Logic Apps** to JSON files with timestamped filenames
- ✅ **Restore Logic Apps** from JSON files
- ✅ **Direct API Integration** with Azure Management REST API
- ✅ **Auto-Authentication** using Azure Portal session token
- ✅ **Dynamic Icon States** - Blue when on Azure Portal, gray elsewhere
- ✅ **Simple UI** - Clean, GitHub-inspired interface
- ✅ **Privacy-Focused** - No data collection, all operations are local

## 📦 Installation

1. Download `logic-app-manager-v1.0.0.zip` from the Assets section below
2. Extract the ZIP file to a folder on your computer
3. Open Chrome and go to `chrome://extensions/`
4. Enable **Developer Mode** (toggle in top-right)
5. Click **"Load unpacked"**
6. Select the extracted folder
7. The extension icon will appear in your toolbar!

## 🚀 Usage

### Backup a Logic App
1. Navigate to your Logic App in Azure Portal
2. Click the extension icon
3. Click "Backup to File"
4. Save the JSON file

### Restore a Logic App
1. Navigate to the Logic App you want to restore
2. Click the extension icon
3. Click "Restore from File"
4. Select your backup JSON file
5. Refresh Azure Portal to see changes

## 📋 What's Included

- Background service worker for dynamic icon management
- Content script for Azure Portal integration
- Privacy policy and liability disclaimers
- MIT License
- Full source code

## 🔒 Security & Privacy

- All operations performed locally in your browser
- Uses your existing Azure Portal authentication
- No data sent to external servers
- No analytics or tracking
- Open source - audit the code yourself

## 📄 Documentation

- [README](https://github.com/albertsikkema/logic-app-manager#readme)
- [Privacy Policy](https://github.com/albertsikkema/logic-app-manager/blob/main/PRIVACY_POLICY.md)
- [License](https://github.com/albertsikkema/logic-app-manager/blob/main/LICENSE)

## 🐛 Known Issues

None at this time. Please report issues on the [Issues page](https://github.com/albertsikkema/logic-app-manager/issues).

## 📝 Requirements

- Chrome 88+ (Manifest V3 support)
- Active Azure Portal session
- Contributor or Owner permissions on the Logic App

---

**Full Changelog**: https://github.com/albertsikkema/logic-app-manager/commits/v1.0.0
