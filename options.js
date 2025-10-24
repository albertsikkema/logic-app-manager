// Options page script - GitHub configuration

const githubTokenInput = document.getElementById('githubToken');
const githubRepoInput = document.getElementById('githubRepo');
const saveButton = document.getElementById('saveSettings');
const testButton = document.getElementById('testConnection');
const statusMessage = document.getElementById('statusMessage');

// Load saved settings
async function loadSettings() {
  const settings = await chrome.storage.session.get(['githubToken', 'githubRepo']);

  if (settings.githubToken) {
    githubTokenInput.value = settings.githubToken;
  }
  if (settings.githubRepo) {
    githubRepoInput.value = settings.githubRepo;
  }
}

// Show status message
function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  statusMessage.style.display = 'block';

  if (type === 'success') {
    setTimeout(() => {
      statusMessage.style.display = 'none';
    }, 5000);
  }
}

// Validate repository format
function validateRepoFormat(repo) {
  return /^[\w-]+\/[\w-]+$/.test(repo);
}

// Test GitHub connection
async function testConnection(token, repo) {
  const [owner, repoName] = repo.split('/');
  const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Repository not found. Check the repository name or create it first.');
    } else if (response.status === 401) {
      throw new Error('Invalid token. Please check your Personal Access Token.');
    } else {
      throw new Error(`GitHub API error: ${response.status}`);
    }
  }

  return await response.json();
}

// Save settings
saveButton.addEventListener('click', async () => {
  const token = githubTokenInput.value.trim();
  const repo = githubRepoInput.value.trim();

  if (!token || !repo) {
    showStatus('Please fill in all fields', 'error');
    return;
  }

  if (!validateRepoFormat(repo)) {
    showStatus('Invalid repository format. Use: owner/repo', 'error');
    return;
  }

  try {
    saveButton.disabled = true;
    showStatus('Testing connection...', 'info');

    // Test the connection before saving
    await testConnection(token, repo);

    // Save to chrome.storage.session
    await chrome.storage.session.set({
      githubToken: token,
      githubRepo: repo
    });

    showStatus('✓ Settings saved successfully!', 'success');

  } catch (error) {
    showStatus(`✗ Error: ${error.message}`, 'error');
  } finally {
    saveButton.disabled = false;
  }
});

// Test connection button
testButton.addEventListener('click', async () => {
  const token = githubTokenInput.value.trim();
  const repo = githubRepoInput.value.trim();

  if (!token || !repo) {
    showStatus('Please fill in all fields', 'error');
    return;
  }

  if (!validateRepoFormat(repo)) {
    showStatus('Invalid repository format. Use: owner/repo', 'error');
    return;
  }

  try {
    testButton.disabled = true;
    showStatus('Testing connection...', 'info');

    const repoData = await testConnection(token, repo);

    showStatus(
      `✓ Connection successful! Repository: ${repoData.full_name} (${repoData.private ? 'Private' : 'Public'})`,
      'success'
    );

  } catch (error) {
    showStatus(`✗ ${error.message}`, 'error');
  } finally {
    testButton.disabled = false;
  }
});

// Initialize
loadSettings();
