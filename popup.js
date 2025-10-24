// Popup script - Backup and restore Logic Apps via Azure Management API

// UI Elements
const backupButton = document.getElementById('backupButton');
const restoreButton = document.getElementById('restoreButton');
const uploadFile = document.getElementById('uploadFile');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const infoSection = document.getElementById('infoSection');
const logicAppName = document.getElementById('logicAppName');
const resourceGroup = document.getElementById('resourceGroup');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

// State
let metadata = null;
let authToken = null;

const API_BASE = 'https://management.azure.com';
const API_VERSION = '2016-10-01';

// Initialize
async function initialize() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url || !tab.url.includes('portal.azure.com')) {
      updateStatus('error', 'Not on Azure Portal');
      return;
    }

    // Get metadata
    const metadataResponse = await chrome.tabs.sendMessage(tab.id, { action: 'getMetadata' });
    if (!metadataResponse?.success || !metadataResponse?.metadata) {
      updateStatus('error', 'Not on a Logic App page');
      return;
    }

    metadata = metadataResponse.metadata;
    logicAppName.textContent = metadata.workflowName;
    resourceGroup.textContent = metadata.resourceGroup;
    infoSection.style.display = 'block';

    // Get token
    const tokenResponse = await chrome.tabs.sendMessage(tab.id, { action: 'getToken' });
    if (!tokenResponse?.success || !tokenResponse?.token) {
      updateStatus('error', 'No auth token found');
      showNotification('Could not find auth token. Try refreshing the page.', 'error');
      return;
    }

    authToken = tokenResponse.token;
    updateStatus('ready', 'Ready to backup/restore');
    backupButton.disabled = false;
    restoreButton.disabled = false;

  } catch (error) {
    updateStatus('error', 'Failed to initialize');
  }
}

// Update status
function updateStatus(type, message) {
  statusIndicator.className = 'status-indicator ' + type;
  statusText.textContent = message;
}

// Show notification
function showNotification(message, type = 'success') {
  notificationText.textContent = message;
  notification.className = 'notification ' + type;
  notification.style.display = 'block';
  setTimeout(() => notification.style.display = 'none', 3000);
}

// Backup
backupButton.addEventListener('click', async () => {
  try {
    updateStatus('', 'Backing up...');
    backupButton.disabled = true;

    const apiUrl = `${API_BASE}/subscriptions/${metadata.subscriptionId}/resourceGroups/${metadata.resourceGroup}/providers/Microsoft.Logic/workflows/${metadata.workflowName}?api-version=${API_VERSION}&$expand=connections.json,parameters.json`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const now = new Date();
    const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '');
    const hhmm = now.toTimeString().slice(0, 5).replace(':', '');
    const filename = `${yyyymmdd}-${hhmm}-${metadata.workflowName}.json`;

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    await chrome.downloads.download({ url: url, filename: filename, saveAs: true });
    URL.revokeObjectURL(url);

    updateStatus('ready', 'Backup completed!');
    showNotification('Logic App backed up successfully!', 'success');

  } catch (error) {
    updateStatus('error', 'Backup failed');
    showNotification('Backup failed: ' + error.message, 'error');
  } finally {
    backupButton.disabled = false;
  }
});

// Restore
restoreButton.addEventListener('click', () => uploadFile.click());

uploadFile.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    updateStatus('', 'Restoring...');
    restoreButton.disabled = true;

    const content = await file.text();
    const data = JSON.parse(content);

    const apiUrl = `${API_BASE}/subscriptions/${metadata.subscriptionId}/resourceGroups/${metadata.resourceGroup}/providers/Microsoft.Logic/workflows/${metadata.workflowName}?api-version=${API_VERSION}`;

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    updateStatus('ready', 'Restore completed!');
    showNotification('Logic App restored! Refresh the page to see changes.', 'success');

  } catch (error) {
    updateStatus('error', 'Restore failed');
    showNotification('Restore failed: ' + error.message, 'error');
  } finally {
    restoreButton.disabled = false;
    uploadFile.value = '';
  }
});

// Start
initialize();
