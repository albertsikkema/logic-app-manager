// Popup script - Backup and restore Logic Apps via Azure Management API

// UI Elements
const backupToGitHubButton = document.getElementById('backupToGitHubButton');
const backupToFileButton = document.getElementById('backupToFileButton');
const restoreFromGitHubButton = document.getElementById('restoreFromGitHubButton');
const restoreFromFileButton = document.getElementById('restoreFromFileButton');
const uploadFile = document.getElementById('uploadFile');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const infoSection = document.getElementById('infoSection');
const logicAppName = document.getElementById('logicAppName');
const resourceGroup = document.getElementById('resourceGroup');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const actionsSection = document.querySelector('.actions');
const footerSection = document.querySelector('.footer');

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
      actionsSection.style.display = 'none';
      footerSection.style.display = 'none';
      return;
    }

    // Get metadata
    const metadataResponse = await chrome.tabs.sendMessage(tab.id, { action: 'getMetadata' });
    if (!metadataResponse?.success || !metadataResponse?.metadata) {
      updateStatus('error', 'Not on a Logic App page');
      actionsSection.style.display = 'none';
      footerSection.style.display = 'none';
      return;
    }

    metadata = metadataResponse.metadata;
    logicAppName.textContent = metadata.workflowName;
    resourceGroup.textContent = metadata.resourceGroup;

    // Check GitHub configuration
    const { githubToken, githubRepo } = await chrome.storage.session.get(['githubToken', 'githubRepo']);
    const githubConfigured = !!(githubToken && githubRepo);

    document.getElementById('githubStatus').textContent = githubConfigured
      ? `✓ ${githubRepo}`
      : 'Not configured';

    // Show/hide GitHub buttons and separators based on configuration
    const githubSeparator = document.getElementById('githubSeparator');
    const fileSeparator = document.getElementById('buttonSeparator');
    if (githubConfigured) {
      githubSeparator.style.display = 'flex';
      backupToGitHubButton.style.display = 'flex';
      restoreFromGitHubButton.style.display = 'flex';
      fileSeparator.style.display = 'flex';
    } else {
      githubSeparator.style.display = 'none';
      backupToGitHubButton.style.display = 'none';
      restoreFromGitHubButton.style.display = 'none';
      fileSeparator.style.display = 'none';
    }

    infoSection.style.display = 'block';
    actionsSection.style.display = 'flex';
    footerSection.style.display = 'block';

    // Get token
    const tokenResponse = await chrome.tabs.sendMessage(tab.id, { action: 'getToken' });
    if (!tokenResponse?.success || !tokenResponse?.token) {
      updateStatus('error', 'No auth token found');
      showNotification('Could not find auth token. Try refreshing the page.', 'error');
      return;
    }

    authToken = tokenResponse.token;
    updateStatus('ready', 'Ready to backup/restore');

    // Enable all visible buttons
    backupToFileButton.disabled = false;
    restoreFromFileButton.disabled = false;
    if (githubConfigured) {
      backupToGitHubButton.disabled = false;
      restoreFromGitHubButton.disabled = false;
    }

  } catch (error) {
    updateStatus('error', 'Failed to initialize');
  }
}

// Settings button
document.getElementById('settingsButton')?.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

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

// GitHub helper functions

// Base64 encode for GitHub API
function base64Encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

// Get existing file SHA (required for updates)
async function getFileSHA(token, repo, path, branch = 'main') {
  const [owner, repoName] = repo.split('/');
  const url = `https://api.github.com/repos/${owner}/${repoName}/contents/${path}?ref=${branch}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (response.status === 404) {
      return null; // File doesn't exist yet
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data.sha;
  } catch (error) {
    if (error.message.includes('404')) {
      return null;
    }
    throw error;
  }
}

// Push Logic App to GitHub
async function pushToGitHub(token, repo, logicAppData, workflowName, commitMessage) {
  const [owner, repoName] = repo.split('/');

  // Create organized path structure
  const timestamp = new Date().toISOString().slice(0, 10);
  const path = `apps/${workflowName}/${timestamp}-workflow.json`;

  // Get existing file SHA (if updating)
  const sha = await getFileSHA(token, repo, path);

  // Prepare request
  const url = `https://api.github.com/repos/${owner}/${repoName}/contents/${path}`;
  const contentEncoded = base64Encode(JSON.stringify(logicAppData, null, 2));

  const body = {
    message: commitMessage || `Backup ${workflowName} - ${new Date().toLocaleString()}`,
    content: contentEncoded,
    branch: 'main'
  };

  // Include SHA if updating existing file
  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to push to GitHub');
  }

  return await response.json();
}

// Download to file (fallback)
async function downloadToFile(data, workflowName) {
  const now = new Date();
  const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '');
  const hhmm = now.toTimeString().slice(0, 5).replace(':', '');
  const filename = `${yyyymmdd}-${hhmm}-${workflowName}.json`;

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  await chrome.downloads.download({ url: url, filename: filename, saveAs: true });
  URL.revokeObjectURL(url);
}

// Backup to GitHub
backupToGitHubButton.addEventListener('click', async () => {
  try {
    updateStatus('', 'Backing up...');
    backupToGitHubButton.disabled = true;

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
    const { githubToken, githubRepo } = await chrome.storage.session.get(['githubToken', 'githubRepo']);

    // Push to GitHub
    const commitMessage = prompt(
      'Enter commit message (optional):',
      `Backup ${metadata.workflowName}`
    );

    if (commitMessage !== null) { // User didn't cancel
      const result = await pushToGitHub(
        githubToken,
        githubRepo,
        data,
        metadata.workflowName,
        commitMessage
      );

      updateStatus('ready', 'Backed up to GitHub!');
      showNotification(
        `Logic App pushed to GitHub!\nView: ${result.content.html_url}`,
        'success'
      );
    } else {
      // User cancelled
      updateStatus('ready', 'Backup cancelled');
    }

  } catch (error) {
    updateStatus('error', 'Backup failed');
    showNotification('Backup failed: ' + error.message, 'error');
  } finally {
    backupToGitHubButton.disabled = false;
  }
});

// Backup to File
backupToFileButton.addEventListener('click', async () => {
  try {
    updateStatus('', 'Backing up...');
    backupToFileButton.disabled = true;

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
    await downloadToFile(data, metadata.workflowName);

    updateStatus('ready', 'Backup completed!');
    showNotification('Logic App backed up to file successfully!', 'success');

  } catch (error) {
    updateStatus('error', 'Backup failed');
    showNotification('Backup failed: ' + error.message, 'error');
  } finally {
    backupToFileButton.disabled = false;
  }
});

// List commits for a specific Logic App path
async function listCommits(token, repo, workflowName, perPage = 20) {
  const [owner, repoName] = repo.split('/');
  const path = `apps/${workflowName}`;
  const params = new URLSearchParams({
    path: path,
    per_page: perPage
  });

  const url = `https://api.github.com/repos/${owner}/${repoName}/commits?${params}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch commits: ${response.status}`);
  }

  return await response.json();
}

// Get file content from a specific commit
async function getFileFromCommit(token, repo, commitSha, workflowName) {
  const [owner, repoName] = repo.split('/');

  // First get tree to find the actual file
  const treeUrl = `https://api.github.com/repos/${owner}/${repoName}/git/trees/${commitSha}?recursive=1`;

  const treeResponse = await fetch(treeUrl, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  if (!treeResponse.ok) {
    throw new Error(`Failed to fetch tree: ${treeResponse.status}`);
  }

  const treeData = await treeResponse.json();
  const path = `apps/${workflowName}`;
  const file = treeData.tree.find(item =>
    item.path.startsWith(path) && item.path.endsWith('.json')
  );

  if (!file) {
    throw new Error('No workflow file found in this commit');
  }

  // Get file content
  const fileUrl = `https://api.github.com/repos/${owner}/${repoName}/contents/${file.path}?ref=${commitSha}`;

  const fileResponse = await fetch(fileUrl, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  if (!fileResponse.ok) {
    throw new Error(`Failed to fetch file: ${fileResponse.status}`);
  }

  const fileData = await fileResponse.json();

  // Decode base64 content
  const content = atob(fileData.content.replace(/\s/g, ''));
  return JSON.parse(content);
}

// Escape HTML for safe display
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Show commit selector modal
async function showCommitSelector() {
  const { githubToken, githubRepo } = await chrome.storage.session.get(['githubToken', 'githubRepo']);

  if (!githubToken || !githubRepo) {
    showNotification('Please configure GitHub settings first', 'error');
    chrome.runtime.openOptionsPage();
    return;
  }

  try {
    updateStatus('', 'Loading commits...');

    const commits = await listCommits(githubToken, githubRepo, metadata.workflowName, 20);

    if (commits.length === 0) {
      showNotification('No commits found for this Logic App', 'error');
      updateStatus('ready', 'No commits found');
      return;
    }

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'commitModal';
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Select a commit to restore</h3>
            <button id="closeModal" class="close-btn">&times;</button>
          </div>
          <div class="commit-list">
            ${commits.map(commit => `
              <div class="commit-item" data-sha="${commit.sha}">
                <div class="commit-message">${escapeHtml(commit.commit.message)}</div>
                <div class="commit-meta">
                  ${escapeHtml(commit.commit.author.name)} ·
                  ${new Date(commit.commit.author.date).toLocaleString()}
                </div>
                <div class="commit-sha">${commit.sha.substring(0, 7)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Handle commit selection
    modal.querySelectorAll('.commit-item').forEach(item => {
      item.addEventListener('click', async () => {
        const sha = item.dataset.sha;
        document.body.removeChild(modal);
        await restoreFromCommit(githubToken, githubRepo, sha);
      });
    });

    // Handle close
    document.getElementById('closeModal').addEventListener('click', () => {
      document.body.removeChild(modal);
      updateStatus('ready', 'Restore cancelled');
    });

    updateStatus('ready', 'Select a commit');

  } catch (error) {
    updateStatus('error', 'Failed to load commits');
    showNotification('Error: ' + error.message, 'error');
  }
}

// Restore from specific commit
async function restoreFromCommit(token, repo, commitSha) {
  try {
    updateStatus('', 'Restoring from commit...');

    const logicAppData = await getFileFromCommit(token, repo, commitSha, metadata.workflowName);

    // Push to Azure (existing restore logic)
    const apiUrl = `${API_BASE}/subscriptions/${metadata.subscriptionId}/resourceGroups/${metadata.resourceGroup}/providers/Microsoft.Logic/workflows/${metadata.workflowName}?api-version=${API_VERSION}`;

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(logicAppData)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    updateStatus('ready', 'Restored from commit!');
    showNotification(
      `Logic App restored from Git (${commitSha.substring(0, 7)})!\nRefresh the page to see changes.`,
      'success'
    );

  } catch (error) {
    updateStatus('error', 'Restore failed');
    showNotification('Restore failed: ' + error.message, 'error');
  }
}

// Restore from GitHub
restoreFromGitHubButton.addEventListener('click', async () => {
  await showCommitSelector();
});

// Restore from File
restoreFromFileButton.addEventListener('click', () => {
  uploadFile.click();
});

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
    restoreFromFileButton.disabled = false;
    uploadFile.value = '';
  }
});

// Start
initialize();
