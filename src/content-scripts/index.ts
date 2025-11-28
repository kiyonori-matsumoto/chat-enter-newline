import { KeyboardHandler } from './keyboard-handler';

// 重複実行を防ぐ
if ((window as any).__geminiEnterNewlineLoaded) {
  console.log('[Gemini Enter Newline] Already loaded, skipping initialization');
} else {
  console.log('[Gemini Enter Newline] Content script starting...');

  // 即座に初期化（document_start で実行されるため、DOMが構築される前でもイベントリスナーは登録可能）
  const handler = new KeyboardHandler();
  handler.init();

  // 読み込み済みフラグを設定
  (window as any).__geminiEnterNewlineLoaded = true;

  console.log('[Gemini Enter Newline] Extension initialized successfully');
}
