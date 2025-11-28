// Geminiの入力フィールド検出用セレクタ（複数のパターンを試行）
export const TEXTBOX_SELECTORS = [
  'div[contenteditable="true"][role="textbox"]',
  'div[contenteditable="true"]',
  '[role="textbox"]',
];

// Geminiの送信ボタン検出用セレクタ
export const SUBMIT_BUTTON_SELECTORS = [
  'button[aria-label*="Send"]',
  'button[aria-label*="送信"]',
  'button[jsname]', // Gemini特有の属性
];
