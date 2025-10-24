// Background service worker - manages icon state based on current tab

// Active (Azure Portal) icons
const ACTIVE_ICONS = {
  16: 'icons/icon16.png',
  48: 'icons/icon48.png',
  128: 'icons/icon128.png'
};

// Inactive (not on Azure Portal) icons
const INACTIVE_ICONS = {
  16: 'icons/icon16-inactive.png',
  48: 'icons/icon48-inactive.png',
  128: 'icons/icon128-inactive.png'
};

// Check if URL is Azure Portal
function isAzurePortal(url) {
  if (!url) return false;
  return url.includes('portal.azure.com');
}

// Update icon based on tab URL
async function updateIcon(tabId, url) {
  const icons = isAzurePortal(url) ? ACTIVE_ICONS : INACTIVE_ICONS;

  try {
    await chrome.action.setIcon({
      tabId: tabId,
      path: icons
    });
  } catch (error) {
    console.error('Failed to update icon:', error);
  }
}

// Listen for tab updates (URL changes, page loads, etc.)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only update when URL changes or page completes loading
  if (changeInfo.url || changeInfo.status === 'complete') {
    updateIcon(tabId, tab.url);
  }
});

// Listen for tab activation (switching between tabs)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  updateIcon(activeInfo.tabId, tab.url);
});

// Initialize icon when extension loads
chrome.runtime.onInstalled.addListener(async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length > 0) {
    updateIcon(tabs[0].id, tabs[0].url);
  }
});

// Also update on startup
chrome.runtime.onStartup.addListener(async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length > 0) {
    updateIcon(tabs[0].id, tabs[0].url);
  }
});
