import { KeyboardHandler } from './keyboard-handler';

// ページ読み込み完了を待つ
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  const handler = new KeyboardHandler();
  handler.init();

  console.log('[Gemini Enter Newline] Extension loaded');
}
