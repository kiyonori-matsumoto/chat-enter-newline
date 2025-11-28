import { DOMDetector } from './dom-detector';

export class KeyboardHandler {
  private detector: DOMDetector;

  constructor() {
    this.detector = new DOMDetector();
  }

  /**
   * キーボードイベントを処理
   */
  handleKeyDown = (event: KeyboardEvent): void => {
    // Enterキー以外は無視
    if (event.key !== 'Enter') return;

    // 自分が発火させたイベントは無視（無限ループ防止）
    if ((event as any).__geminiEnterModified) {
      console.log('[Gemini Enter] Modified event, allowing through');
      return;
    }

    // IME入力中（日本語入力の確定など）は無視
    if (event.isComposing) {
      console.log('[Gemini Enter] IME composing, ignoring');
      return;
    }

    const target = event.target;

    console.log('[Gemini Enter] Enter key detected', {
      target,
      isGeminiTextbox: this.detector.isGeminiTextbox(target as Element),
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      isComposing: event.isComposing,
    });

    // Geminiの入力フィールドでない場合は無視
    if (!this.detector.isGeminiTextbox(target as Element)) {
      console.log('[Gemini Enter] Not a Gemini textbox, ignoring');
      return;
    }

    // Shift+Enterはそのまま通す（既に改行として動作する）
    if (event.shiftKey) {
      console.log('[Gemini Enter] Shift+Enter, allowing through');
      return;
    }

    // 元のイベントを抑止
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    // Ctrl+Enter または Cmd+Enter の場合は送信（通常のEnterを発火）
    if (event.ctrlKey || event.metaKey) {
      console.log('[Gemini Enter] Ctrl/Cmd+Enter, dispatching plain Enter for submit');
      this.dispatchModifiedEnter(target as Element, false);
    } else {
      // 通常のEnter単独の場合は改行（Shift+Enterを発火）
      console.log('[Gemini Enter] Plain Enter, dispatching Shift+Enter for newline');
      this.dispatchModifiedEnter(target as Element, true);
    }
  };

  /**
   * shiftKeyを変更した新しいEnterイベントを発火
   */
  private dispatchModifiedEnter(target: Element, shiftKey: boolean): void {
    const newEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      shiftKey: shiftKey,
      bubbles: true,
      cancelable: true,
    });

    // カスタムプロパティでマーク（無限ループ防止）
    (newEvent as any).__geminiEnterModified = true;

    console.log('[Gemini Enter] Dispatching new event with shiftKey:', shiftKey);
    target.dispatchEvent(newEvent);
  }

  /**
   * イベントリスナーを登録
   */
  init(): void {
    // windowレベルでキャプチャフェーズで処理（Geminiの処理より先に実行）
    window.addEventListener('keydown', this.handleKeyDown, true);
  }

  /**
   * クリーンアップ
   */
  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown, true);
  }
}
