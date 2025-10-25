# Privacy Policy for Logic App Manager

**Last Updated: October 25, 2025**
**Version: 1.1.0**

## Overview

Logic App Manager is a Chrome browser extension that helps users backup and restore Azure Logic Apps. This privacy policy explains how the extension handles user data, including the optional GitHub integration feature added in version 1.1.0.

## Data Collection

**Logic App Manager does NOT collect, store, or transmit any personal data.**

### What We Don't Collect

- ❌ No personal information
- ❌ No usage analytics or telemetry
- ❌ No tracking cookies
- ❌ No browsing history
- ❌ No Azure credentials or passwords
- ❌ No Logic App definitions stored by us (they remain on your computer or your GitHub repository)
- ❌ No GitHub credentials are logged or transmitted to our servers (we don't have servers)
- ❌ No information about which Logic Apps you backup or restore

## Data Usage

### Local Operations

All operations performed by this extension happen entirely within your browser:

1. **Metadata Extraction**: The extension reads Logic App information (name, resource group, subscription ID) from the Azure Portal URL in your current browser tab
2. **Azure Authentication Token**: The extension accesses your existing Azure Portal authentication token from browser session storage to make API calls on your behalf
3. **Backup/Restore to File**: API calls are made directly from your browser to Azure Management API, and files are saved to your local computer
4. **GitHub Integration (Optional)**: If you configure GitHub integration, the extension stores your GitHub Personal Access Token in browser session storage and makes API calls to GitHub on your behalf

### File-Based Operations (Default)

- All backup files are saved directly to your local computer
- All restore operations use files from your local computer
- No data is sent to external servers (except Azure API)

### GitHub Operations (Optional - v1.1.0+)

When you configure GitHub integration:

- **GitHub Token Storage**: Your GitHub Personal Access Token is stored in `chrome.storage.session` (browser session storage)
- **Token Security**: Tokens are automatically cleared when you close your browser
- **Data Sent to GitHub**: Only Logic App workflow definitions (JSON) are sent to your configured GitHub repository
- **Direct API Calls**: All GitHub API calls are made directly from your browser to `api.github.com`
- **User Control**: You choose when to backup to GitHub and can disable this feature at any time

### No Analytics Servers

- The extension does not send any data to our servers (we don't have any servers)
- No backend services or databases are used
- No analytics or telemetry data is collected

## Permissions Explained

The extension requests the following Chrome permissions:

### Required Permissions

- **`activeTab`**: Allows the extension to interact with the currently active Azure Portal tab to extract metadata and authentication tokens
- **`scripting`**: Enables the extension to inject content scripts into Azure Portal pages to read page information
- **`downloads`**: Allows the extension to save backup files to your computer
- **`tabs`**: Enables the extension to detect when you're on an Azure Portal page and update the icon accordingly
- **`storage`**: Allows the extension to store GitHub configuration (repository name and Personal Access Token) in browser session storage. This data is cleared when you close your browser.

### Host Permissions

- **`https://portal.azure.com/*`**: Required to interact with Azure Portal pages
- **`https://*.portal.azure.com/*`**: Required to support all Azure Portal regional domains
- **`https://management.azure.com/*`**: Required to make Azure Management REST API calls for backup/restore operations
- **`https://api.github.com/*`**: Required for optional GitHub integration to backup and restore Logic Apps from GitHub repositories (v1.1.0+)

These permissions are only used for the stated functionality and cannot access any other websites or data.

## Data Security

### Azure Authentication

- The extension uses your existing Azure Portal session token
- Azure tokens are only used for Azure Management API calls within the same browser session
- Azure tokens are never stored permanently
- Azure tokens are never transmitted to any third-party services

### GitHub Authentication (Optional)

- GitHub Personal Access Tokens are stored in `chrome.storage.session` only
- GitHub tokens are automatically cleared when you close your browser
- GitHub tokens are never stored permanently on disk
- GitHub tokens are only used to authenticate with `api.github.com`
- You can revoke GitHub tokens at any time through GitHub settings
- We recommend using tokens with minimal scope (only `repo` permission)

### Backup Files

- **File-based backups**: Saved to your local computer; you control where they're stored
- **GitHub-based backups**: Stored in your GitHub repository; secured by GitHub's infrastructure
- You are responsible for securing backup files if they contain sensitive business logic
- Consider using private GitHub repositories for sensitive Logic Apps

## Third-Party Services

The extension only communicates with:

- **Azure Management API** (`management.azure.com`): Official Microsoft Azure REST API for managing Azure resources
- **Azure Portal** (`portal.azure.com`): Official Microsoft Azure web portal
- **GitHub API** (`api.github.com`) *(Optional, v1.1.0+)*: Official GitHub REST API for storing and retrieving Logic App backups in your GitHub repositories

### GitHub API Usage (Optional)

When you enable GitHub integration:

- **What data is sent**: Only Logic App workflow definitions (JSON format) are sent to GitHub
- **Where it's stored**: In your GitHub repository at paths like `apps/{workflowName}/{date}-workflow.json`
- **Who can access it**: Depends on your repository settings (public or private)
- **GitHub's privacy policy**: GitHub's own privacy policy applies to data stored in your repositories: https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement
- **Rate limits**: GitHub API has rate limits (5,000 requests/hour for authenticated users)

No other third-party services are used or contacted by this extension.

## Open Source

This extension is open source and available on GitHub:
- Repository: https://github.com/albertsikkema/logic-app-manager
- You can review the complete source code to verify these privacy claims
- Community contributions and security audits are welcome

## Changes to Privacy Policy

If we make changes to this privacy policy, we will update the "Last Updated" date at the top of this document and publish the changes in the GitHub repository.

## Contact

For questions or concerns about privacy:

- Create an issue on GitHub: https://github.com/albertsikkema/logic-app-manager/issues
- Visit: https://albertsikkema.com

## Your Rights

You have the right to:

- Review the source code of this extension
- Uninstall the extension at any time
- Disable GitHub integration at any time through the Options page
- Delete your GitHub Personal Access Token from the extension (cleared automatically on browser close)
- Delete backup files from your GitHub repository at any time
- Revoke GitHub token permissions through GitHub settings
- Request information about how the extension works
- Report privacy concerns

## Compliance

This extension:

- ✅ Does not collect personal data (GDPR compliant)
- ✅ Does not use cookies or tracking
- ✅ Operates with minimal necessary permissions
- ✅ Is transparent about all operations (open source)
- ✅ GitHub integration is optional and user-controlled

## Chrome Web Store User Data Policy Compliance

The use of information received from Google APIs will adhere to the [Chrome Web Store User Data Policy](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq), including the Limited Use requirements.

Logic App Manager's use and transfer of information received from Google APIs to any other app will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements.

### Limited Use Compliance

This extension complies with Chrome Web Store Limited Use requirements:

- ✅ **Single Purpose**: Data is used solely for backup and restore of Azure Logic Apps
- ✅ **No Monetization**: User data is not used for advertising, ad targeting, or monetization
- ✅ **No Web Tracking**: Does not collect web browsing activity
- ✅ **Secure Transmission**: All data transmission uses HTTPS
- ✅ **No Third-Party Sharing**: Data is not sold or shared with third parties (except user-initiated GitHub backup)
- ✅ **Transparent Usage**: All data usage is clearly disclosed in this privacy policy

## GitHub Integration Summary (v1.1.0+)

For clarity, here's a complete summary of the GitHub integration feature:

**Opt-In Feature**: GitHub integration is completely optional and disabled by default.

**What Gets Stored**:
- Your GitHub repository name (e.g., `owner/repo`) - in browser session storage
- Your GitHub Personal Access Token - in browser session storage
- Logic App workflow definitions (JSON) - in your GitHub repository

**What Gets Transmitted**:
- Logic App JSON to your GitHub repository via `api.github.com`
- GitHub API authentication using your token

**What Gets Deleted**:
- Repository name and token are automatically deleted when you close your browser
- You can manually disable GitHub integration in Options at any time
- You can delete workflow files from your GitHub repository at any time

**Security Recommendations**:
- Use a GitHub token with minimal scope (`repo` only)
- Use a private GitHub repository for sensitive Logic Apps
- Regularly review and rotate your GitHub tokens
- Review what's stored in your GitHub repository

## Disclaimer

This extension is not officially affiliated with, endorsed by, or supported by Microsoft Corporation, Microsoft Azure, or GitHub, Inc. All Azure, Logic Apps, and related trademarks are property of Microsoft Corporation. GitHub and related trademarks are property of GitHub, Inc.

---

By using Logic App Manager, you acknowledge that you have read and understood this privacy policy.
