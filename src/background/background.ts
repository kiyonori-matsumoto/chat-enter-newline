console.log('[Gemini Enter Newline] Background service worker starting...');

// コンテンツスクリプトが実行されているかチェックし、未実行なら注入する
async function ensureContentScriptInjected(tabId: number, url: string) {
  // Gemini のページでない場合はスキップ
  if (!url.startsWith('https://gemini.google.com/app')) {
    return;
  }

  console.log(
    '[Gemini Enter Newline] Ensuring content script for tab:',
    tabId,
    url
  );

  try {
    // コンテンツスクリプトが実行されているかチェック
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        // @ts-ignore
        return typeof window.__geminiEnterNewlineLoaded !== 'undefined';
      },
    });

    const isLoaded = results[0]?.result;

    if (!isLoaded) {
      console.log(
        '[Gemini Enter Newline] Content script not loaded, injecting...'
      );

      // コンテンツスクリプトを注入
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content-scripts/index.js'],
      });

      console.log('[Gemini Enter Newline] Content script injected successfully');
    } else {
      console.log('[Gemini Enter Newline] Content script already loaded');
    }
  } catch (error) {
    console.error('[Gemini Enter Newline] Failed to inject content script:', error);
  }
}

// タブがアクティブになったとき
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('[Gemini Enter Newline] Tab activated:', activeInfo.tabId);

  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url) {
      await ensureContentScriptInjected(activeInfo.tabId, tab.url);
    }
  } catch (error) {
    console.error('[Gemini Enter Newline] Error on tab activation:', error);
  }
});

// タブが更新されたとき
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // complete 状態になったときのみチェック
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('[Gemini Enter Newline] Tab updated:', tabId, tab.url);
    await ensureContentScriptInjected(tabId, tab.url);
  }
});

// 拡張機能インストール時・アップデート時
chrome.runtime.onInstalled.addListener(async () => {
  console.log('[Gemini Enter Newline] Extension installed/updated');

  // すべての既存の Gemini タブにコンテンツスクリプトを注入
  const tabs = await chrome.tabs.query({
    url: 'https://gemini.google.com/app*',
  });

  console.log(
    '[Gemini Enter Newline] Found existing Gemini tabs:',
    tabs.length
  );

  for (const tab of tabs) {
    if (tab.id && tab.url) {
      await ensureContentScriptInjected(tab.id, tab.url);
    }
  }
});

console.log('[Gemini Enter Newline] Background service worker initialized');
