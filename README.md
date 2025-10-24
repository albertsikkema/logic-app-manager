# Logic App Manager

A Chrome extension to backup and restore Azure Logic Apps directly from the Azure Portal using the Azure Management API.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- ✅ **Backup** Logic Apps to JSON files with timestamped filenames
- ✅ **Restore** Logic Apps from JSON files
- ✅ **Direct API Integration** - Uses Azure Management REST API
- ✅ **Auto-Authentication** - Extracts token from Azure Portal session
- ✅ **Dynamic Icon** - Blue icon on Azure Portal, gray icon elsewhere
- ✅ **Simple UI** - Clean, GitHub-inspired interface
- ✅ **No Data Collection** - All operations are local

## Screenshot

![Extension Screenshot](screenshot-logic-app-manager.png)


## Installation

### Option 1: Install from Release (Recommended)

1. Go to the [Releases page](https://github.com/albertsikkema/logic-app-manager/releases)
2. Download the latest `logic-app-manager-v*.*.*.zip` file
3. Extract the ZIP file to a folder on your computer
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable **Developer mode** (toggle in top-right corner)
6. Click **"Load unpacked"**
7. Select the extracted extension folder
8. The extension icon should appear in your toolbar

### Option 2: Install from Source

Clone this repository:
```bash
git clone https://github.com/albertsikkema/logic-app-manager.git
cd logic-app-manager
```

Then follow steps 4-8 from Option 1 above.

## Usage

### Backup a Logic App

1. Navigate to your Logic App in the [Azure Portal](https://portal.azure.com)
2. Make sure you're on the Logic App designer or code view page
3. Click the extension icon in your Chrome toolbar
4. Click **"Backup to File"**
5. Choose where to save the file
6. File will be saved as: `YYYYMMDD-HHmm-logicappname.json`

### Restore a Logic App

1. Navigate to the Logic App you want to restore
2. Click the extension icon
3. Click **"Restore from File"**
4. Select your backup JSON file
5. The Logic App will be updated immediately
6. Refresh the Azure Portal page to see the changes

## How It Works

1. **Metadata Extraction**: Reads Logic App details from the Azure Portal URL
2. **Authentication**: Extracts the Azure Management API token from browser sessionStorage (MSAL token)
3. **Backup**: Makes a GET request to `https://management.azure.com/.../workflows/{name}`
4. **Restore**: Makes a PUT request to update the Logic App definition

## Requirements

- Chrome 88+ (Manifest V3 support)
- Active Azure Portal session
- Contributor or Owner permissions on the Logic App

## API Endpoints Used

- **GET** (Backup): `/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Logic/workflows/{name}?api-version=2016-10-01&$expand=connections.json,parameters.json`
- **PUT** (Restore): `/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Logic/workflows/{name}?api-version=2016-10-01`

## Troubleshooting

### "Not on a Logic App page"
- Make sure you're on the Logic App editor/designer page
- The URL should contain `/workflows/YOUR-LOGIC-APP`
- Try refreshing the page

### "No auth token found"
- Refresh the Azure Portal page
- Make sure you're logged into Azure
- Check that you have the required permissions

### Backup/Restore fails with 401 Unauthorized
- Your session token has expired
- Refresh the Azure Portal page to get a new token

## Project Structure

```
logic-app-manager/
├── manifest.json              # Extension configuration
├── background.js              # Service worker for icon state management
├── popup.html                 # Extension popup UI
├── popup.js                   # UI logic and API calls
├── content.js                 # Metadata and token extraction
├── styles.css                 # GitHub-inspired styling
├── icons/                     # Extension icons
│   ├── icon.svg               # Active icon source (Azure blue)
│   ├── icon-inactive.svg      # Inactive icon source (grayscale)
│   ├── icon16.png             # 16x16 active icon
│   ├── icon48.png             # 48x48 active icon
│   ├── icon128.png            # 128x128 active icon
│   ├── icon16-inactive.png    # 16x16 inactive icon
│   ├── icon48-inactive.png    # 48x48 inactive icon
│   └── icon128-inactive.png   # 128x128 inactive icon
├── LICENSE                    # MIT License
├── PRIVACY_POLICY.md          # Privacy policy
├── README.md                  # This file
└── screenshot-logic-app-manager.png
```

## Security & Privacy

- ✅ All operations are performed locally in your browser
- ✅ Uses your existing Azure Portal authentication
- ✅ No data is sent to external servers
- ✅ Auth tokens are only used for Azure Management API calls
- ✅ No analytics or tracking
- ✅ Open source - audit the code yourself

📄 Read our full [Privacy Policy](PRIVACY_POLICY.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Ideas for Contributions

- [ ] Support for Azure Logic Apps Standard (not just Consumption)
- [ ] Batch backup multiple Logic Apps
- [ ] Export to ARM templates
- [ ] Backup connections and parameters separately
- [ ] Diff viewer to compare backups
- [ ] Auto-backup on schedule
- [ ] Dark mode

## Development

```bash
# Clone the repository
git clone https://github.com/albertsikkema/logic-app-manager.git
cd logic-app-manager

# Load in Chrome for development
# 1. Go to chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select this folder

# Make your changes and reload the extension
```

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

Created by [Albert Sikkema](https://github.com/albertsikkema)

## Acknowledgments

- Uses Azure Management REST API
- Inspired by the need for quick Logic App version control
- Built with vanilla JavaScript (no frameworks)

## Support

If you find this extension helpful, please ⭐ star this repository!

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Search [existing issues](https://github.com/albertsikkema/logic-app-manager/issues)
3. Create a [new issue](https://github.com/albertsikkema/logic-app-manager/issues/new) with details

---

## Legal Notice

**Disclaimer:** This extension is not officially affiliated with or endorsed by Microsoft or Azure.

**Limitation of Liability:** THE AUTHOR AND CONTRIBUTORS ARE NOT RESPONSIBLE FOR ANY DAMAGE, DATA LOSS, PRODUCTION OUTAGES, OR THE END OF THE WORLD CAUSED BY USING THIS EXTENSION. YOU USE THIS SOFTWARE ENTIRELY AT YOUR OWN RISK. By installing and using this extension, you accept full responsibility for all consequences.
