# Privacy Policy for Logic App Manager

**Last Updated: October 24, 2025**

## Overview

Logic App Manager is a Chrome browser extension that helps users backup and restore Azure Logic Apps. This privacy policy explains how the extension handles user data.

## Data Collection

**Logic App Manager does NOT collect, store, or transmit any personal data.**

### What We Don't Collect

- ❌ No personal information
- ❌ No usage analytics or telemetry
- ❌ No tracking cookies
- ❌ No browsing history
- ❌ No Azure credentials or passwords
- ❌ No Logic App definitions or business data

## Data Usage

### Local Operations Only

All operations performed by this extension happen entirely within your browser:

1. **Metadata Extraction**: The extension reads Logic App information (name, resource group, subscription ID) from the Azure Portal URL in your current browser tab
2. **Authentication Token**: The extension accesses your existing Azure Portal authentication token from browser session storage to make API calls on your behalf
3. **Backup/Restore**: API calls are made directly from your browser to Azure Management API using your existing session

### No External Servers

- The extension does not send any data to external servers
- There are no backend services or databases
- All backup files are saved directly to your local computer
- All restore operations use files from your local computer

## Permissions Explained

The extension requests the following Chrome permissions:

### Required Permissions

- **`activeTab`**: Allows the extension to interact with the currently active Azure Portal tab to extract metadata and authentication tokens
- **`scripting`**: Enables the extension to inject content scripts into Azure Portal pages to read page information
- **`downloads`**: Allows the extension to save backup files to your computer
- **`tabs`**: Enables the extension to detect when you're on an Azure Portal page and update the icon accordingly

### Host Permissions

- **`https://portal.azure.com/*`**: Required to interact with Azure Portal pages
- **`https://*.portal.azure.com/*`**: Required to support all Azure Portal regional domains
- **`https://management.azure.com/*`**: Required to make Azure Management REST API calls for backup/restore operations

These permissions are only used for the stated functionality and cannot access any other websites or data.

## Data Security

### Authentication

- The extension uses your existing Azure Portal session token
- Tokens are only used for Azure Management API calls within the same browser session
- Tokens are never stored permanently
- Tokens are never transmitted to any third-party services

### Backup Files

- Backup files contain your Logic App definitions and are saved to your local computer
- You control where these files are stored
- You are responsible for securing these files if they contain sensitive business logic

## Third-Party Services

The extension only communicates with:

- **Azure Management API** (`management.azure.com`): Official Microsoft Azure REST API for managing Azure resources
- **Azure Portal** (`portal.azure.com`): Official Microsoft Azure web portal

No other third-party services are used.

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
- Email: [your-email@example.com] *(Update with your actual contact email)*

## Your Rights

You have the right to:

- Review the source code of this extension
- Uninstall the extension at any time
- Request information about how the extension works
- Report privacy concerns

## Compliance

This extension:

- ✅ Does not collect personal data (GDPR compliant)
- ✅ Does not use cookies or tracking
- ✅ Operates with minimal necessary permissions
- ✅ Is transparent about all operations (open source)

## Disclaimer

This extension is not officially affiliated with, endorsed by, or supported by Microsoft Corporation or Microsoft Azure. All Azure, Logic Apps, and related trademarks are property of Microsoft Corporation.

---

By using Logic App Manager, you acknowledge that you have read and understood this privacy policy.
