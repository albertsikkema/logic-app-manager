# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Logic App Manager** is a Chrome Manifest V3 extension that enables backup and restore of Azure Logic Apps directly from the Azure Portal. The extension uses vanilla JavaScript with no build tools or frameworks.

## Core Architecture

### Three-Component Chrome Extension Architecture

The extension follows the standard Chrome extension architecture with three isolated contexts:

1. **Background Service Worker** (`background.js`)
   - Manages dynamic icon state (blue on Azure Portal, gray elsewhere)
   - No direct access to page DOM or popup

2. **Content Script** (`content.js`)
   - Injected into all `portal.azure.com` pages
   - Extracts Logic App metadata from URL structure
   - Retrieves Azure Management API token from sessionStorage (MSAL token cache)
   - Cannot directly interact with popup UI

3. **Popup** (`popup.html`, `popup.js`, `styles.css`)
   - Main user interface (360px width)
   - Communicates with content script via `chrome.tabs.sendMessage`
   - Makes direct calls to Azure Management API and GitHub API
   - No direct access to page context

**Critical**: These three contexts cannot share variables or function calls. All communication must use Chrome messaging APIs.

### Authentication Flow

The extension leverages Azure Portal's existing authentication:

1. Content script scans `sessionStorage` for MSAL token keys
2. Looks for keys matching pattern: `msal*.accesstoken*management.core.windows.net`
3. Extracts JWT token (starts with `eyJ`)
4. Popup uses this token for Azure Management API calls

**Note**: Tokens expire with Azure Portal session. No token persistence.

### GitHub Integration (v1.1.0+)

Two-mode operation system:

**When GitHub is NOT configured:**
- Shows only "Backup to File" and "Restore from File" buttons
- Uses Chrome downloads API for file operations
- No external dependencies

**When GitHub IS configured:**
- Shows all four buttons: GitHub + File options
- GitHub backup: Creates/updates files at `apps/{workflowName}/{YYYY-MM-DD}-workflow.json`
- GitHub restore: Fetches commit history, shows modal selector for version
- Tokens stored in `chrome.storage.session` (cleared on browser close)
- Uses GitHub REST API v2022-11-28

### URL Metadata Extraction

Logic App metadata is parsed from Azure Portal URL structure:

```
/id/subscriptions/{subscriptionId}/resourcegroups/{resourceGroup}/providers/Microsoft.Logic/workflows/{workflowName}
```

Content script decodes this and provides to popup as structured data.

## Development Workflow

### Loading Extension for Development

```bash
# Navigate to extension management
# Chrome: chrome://extensions/
# Edge: edge://extensions/

# 1. Enable "Developer mode" (toggle top-right)
# 2. Click "Load unpacked"
# 3. Select this directory
# 4. Extension loads with blue icon
```

### Making Changes

```bash
# After editing any file:
# 1. Go to chrome://extensions/
# 2. Click reload button (circular arrow) on Logic App Manager card
# 3. Refresh any open Azure Portal tabs
# 4. Re-open popup to see changes
```

**Important**: Changes to `manifest.json` require full extension reload. Changes to `popup.js`, `popup.html`, `options.js`, `options.html` require popup close/reopen. Changes to `content.js` require page refresh.

### Creating Release Package

```bash
./package.sh
# Creates: logic-app-manager-v{version}.zip
# Version is read from manifest.json
```

Package includes only distribution files (excludes `.git`, `thoughts/`, etc.)

## File Responsibilities

### popup.js (Core Logic)
- **Lines 1-100**: Initialization, UI element references, Azure authentication
- **Lines 100-210**: GitHub helper functions (base64, SHA retrieval, push/pull operations)
- **Lines 210-300**: Backup event handlers (GitHub and File modes)
- **Lines 300-430**: Restore functions (commit listing, modal, file selection)
- **Lines 430-520**: File upload handler (fallback restore mode)

**Key Functions**:
- `initialize()`: Sets up popup state, checks GitHub config, enables buttons
- `pushToGitHub()`: Creates/updates files in GitHub repo with SHA handling
- `listCommits()`: Fetches commits filtered by Logic App path
- `showCommitSelector()`: Builds dynamic modal with commit history
- `getFileFromCommit()`: Retrieves workflow JSON from specific commit SHA

### content.js (Data Extraction)
- `extractMetadata()`: Parses subscription/resourceGroup/workflow from URL
- `extractToken()`: Scans sessionStorage for MSAL access token
- Message handlers respond to popup requests synchronously

### options.js (Settings Management)
- Validates GitHub PAT and repository format (`owner/repo`)
- Tests connection before saving via GitHub API
- Stores credentials in `chrome.storage.session` (not `local`)

## API Integration

### Azure Management API
- **Base URL**: `https://management.azure.com`
- **API Version**: `2016-10-01`
- **Backup**: `GET /subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Logic/workflows/{name}?api-version=2016-10-01&$expand=connections.json,parameters.json`
- **Restore**: `PUT /subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Logic/workflows/{name}?api-version=2016-10-01`
- **Auth**: `Authorization: Bearer {token}` (extracted from sessionStorage)

### GitHub REST API
- **Base URL**: `https://api.github.com`
- **API Version**: `2022-11-28` (hardcoded in headers)
- **Auth**: `Authorization: Bearer {pat}`
- **Rate Limit**: 5,000 requests/hour (authenticated)

**Key Endpoints**:
- `GET /repos/{owner}/{repo}` - Validate repository access
- `GET /repos/{owner}/{repo}/contents/{path}?ref={branch}` - Get file SHA
- `PUT /repos/{owner}/{repo}/contents/{path}` - Create/update file
- `GET /repos/{owner}/{repo}/commits?path={path}` - List commits for path
- `GET /repos/{owner}/{repo}/git/trees/{sha}?recursive=1` - Find files in commit

## Styling Architecture

Uses GitHub Primer-inspired design system:

**Color Palette**:
- Primary action: `#1f883d` (GitHub green)
- Background: `#f6f8fa` (light gray)
- Text: `#24292f` (dark gray)
- Borders: `#d0d7de` (medium gray)
- Info box: `#ddf4ff` background, `#0969da` blue text

**Layout**:
- Popup: Fixed 360px width, auto height
- Options page: Centered 600px max-width, rounded corners
- Buttons: Full-width with 10px gap, flexbox layout

**Important**: Chrome controls the outer popup frame (gray border/shadow). Only inner content can be styled. Do not attempt to add `border-radius` to popup window itself.

## Chrome Extension Limitations

1. **Popup dimensions**: Max 800px width × 600px height
2. **Icon state**: Managed per-tab, not globally
3. **Storage**: `chrome.storage.session` cleared on browser close
4. **Content Security Policy**: No inline scripts or `eval()`
5. **Cross-context**: Cannot share functions between popup/content/background

## Testing Checklist

When making changes, verify:

1. Extension loads without console errors
2. Icon is blue on `portal.azure.com`, gray elsewhere
3. Popup displays correct Logic App metadata
4. Backup downloads file with correct timestamp format
5. Restore updates Logic App (verify by refreshing Azure Portal)
6. GitHub settings page validates token/repo before saving
7. Commit selector modal displays and handles selection
8. Both GitHub and file modes work independently

## Common Development Patterns

### Adding a New API Call

```javascript
// In popup.js, add function:
async function callAzureAPI(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return await response.json();
}
```

### Adding New UI Elements

1. Add HTML structure to `popup.html` or `options.html`
2. Add styles to `styles.css` following existing patterns
3. Add event listeners in `popup.js` or `options.js`
4. Use `updateStatus()` and `showNotification()` for user feedback

### Modifying GitHub File Structure

Current structure: `apps/{workflowName}/{YYYY-MM-DD}-workflow.json`

To change, update `popup.js`:
- Line 151-152: Path generation in `pushToGitHub()`
- Line 277: Path filter in `listCommits()`
- Line 320: Path matching in `getFileFromCommit()`

## Security Considerations

- **Never log tokens**: Azure tokens and GitHub PATs are sensitive
- **Use chrome.storage.session**: More secure than `local` for credentials
- **Escape HTML**: Always use `escapeHtml()` before inserting user content (commit messages, author names)
- **Validate inputs**: Check repository format before API calls
- **No external dependencies**: Keep extension self-contained

## Documentation Structure

- `README.md` - User-facing installation and usage guide
- `PRIVACY_POLICY.md` - Privacy and data handling policy
- `RELEASE.md` - Release process documentation
- `thoughts/` - Development notes, plans, ADRs, research
- `thoughts/technical_docs/` - Chrome Extensions API docs, Azure API docs
- `thoughts/shared/plans/` - Implementation plans (follow `/create_plan` format)
- `thoughts/shared/reviews/` - Code reviews (follow `/code_reviewer` format)

## Metadata Helper

Use the metadata helper script for structured documentation:

```bash
./claude-helpers/spec_metadata.sh
```

Outputs: date, UUID, git commit, branch, session ID for frontmatter.
