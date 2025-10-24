// Content script - Extracts metadata and auth token from Azure Portal

(function() {
  'use strict';

  // Extract Logic App metadata from URL
  function extractMetadata() {
    const url = window.location.href;
    const idMatch = url.match(/\/id\/([^/]+)/i);

    if (idMatch) {
      const decodedId = decodeURIComponent(idMatch[1]);
      const match = decodedId.match(/subscriptions\/([^/]+)\/resourcegroups\/([^/]+)\/providers\/Microsoft\.Logic\/workflows\/([^/]+)/i);

      if (match) {
        return {
          subscriptionId: match[1],
          resourceGroup: match[2],
          workflowName: match[3]
        };
      }
    }

    return null;
  }

  // Extract Azure Management API token from sessionStorage
  function extractToken() {
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.includes('msal') && key.includes('accesstoken') &&
            key.includes('management.core.windows.net')) {

          const value = sessionStorage.getItem(key);
          const parsed = JSON.parse(value);

          if (parsed.secret && parsed.secret.startsWith('eyJ')) {
            return parsed.secret;
          }
        }
      }
    } catch (error) {
      // Silent fail
    }

    return null;
  }

  // Message handler
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getMetadata') {
      const metadata = extractMetadata();
      sendResponse({ success: !!metadata, metadata: metadata });
      return true;
    }

    if (request.action === 'getToken') {
      const token = extractToken();
      sendResponse({ success: !!token, token: token });
      return true;
    }

    return false;
  });

})();
