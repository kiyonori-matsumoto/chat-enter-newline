import { SUBMIT_BUTTON_SELECTORS } from '../common/constants';

export class DOMDetector {
  /**
   * 現在フォーカスされている要素がGeminiの入力フィールドかチェック
   */
  isGeminiTextbox(element: Element | null): boolean {
    if (!element) return false;

    const isContentEditable =
      element instanceof HTMLElement && element.contentEditable === 'true';

    const hasTextboxRole = element.getAttribute('role') === 'textbox';

    return isContentEditable && hasTextboxRole;
  }

  /**
   * Geminiの送信ボタンを検出
   */
  findSubmitButton(): HTMLElement | null {
    for (const selector of SUBMIT_BUTTON_SELECTORS) {
      const button = document.querySelector(selector);
      if (button instanceof HTMLElement) {
        return button;
      }
    }
    return null;
  }
}
