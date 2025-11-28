import { DOMDetector } from './dom-detector';

export class KeyboardHandler {
  private detector: DOMDetector;
  private observedElements = new WeakSet<Element>();
  private observer: MutationObserver | null = null;

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
      console.log(
        '[Gemini Enter] Ctrl/Cmd+Enter, dispatching plain Enter for submit'
      );
      this.dispatchModifiedEnter(target as Element, false);
    } else {
      // 通常のEnter単独の場合は改行（Shift+Enterを発火）
      console.log(
        '[Gemini Enter] Plain Enter, dispatching Shift+Enter for newline'
      );
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
   * 入力フィールドを見つけたらイベントリスナーを登録
   */
  private attachToTextbox(element: Element): void {
    if (this.observedElements.has(element)) {
      return; // 既に登録済み
    }

    console.log('[Gemini Enter] Attaching event listener to textbox:', element);

    // 入力フィールドに直接イベントリスナーを登録（キャプチャフェーズ、最高優先度）
    element.addEventListener('keydown', this.handleKeyDown, {
      capture: true,
      passive: false,
    });

    // focus イベントでも再登録（入力フィールドが置き換えられた場合に備えて）
    element.addEventListener('focus', () => {
      console.log('[Gemini Enter] Textbox focused, ensuring listener is attached');
      // フォーカス時に改めて keydown リスナーを登録
      element.addEventListener('keydown', this.handleKeyDown, {
        capture: true,
        passive: false,
      });
    });

    // click イベントでも再登録
    element.addEventListener('click', () => {
      element.addEventListener('keydown', this.handleKeyDown, {
        capture: true,
        passive: false,
      });
    });

    this.observedElements.add(element);
  }

  /**
   * 既存の入力フィールドを検索して登録
   */
  private findAndAttachTextboxes(): void {
    const textboxes = document.querySelectorAll(
      'div[contenteditable="true"][role="textbox"]'
    );

    console.log(`[Gemini Enter] Found ${textboxes.length} textbox(es)`);

    textboxes.forEach((textbox) => {
      this.attachToTextbox(textbox);
    });
  }

  /**
   * DOM変更を監視して新しい入力フィールドを検出
   */
  private observeDOM(): void {
    this.observer = new MutationObserver((mutations) => {
      let foundNew = false;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;

            // 追加されたノード自体が入力フィールドかチェック
            if (this.detector.isGeminiTextbox(element)) {
              this.attachToTextbox(element);
              foundNew = true;
            }

            // 追加されたノードの子孫に入力フィールドがないかチェック
            const textboxes = element.querySelectorAll(
              'div[contenteditable="true"][role="textbox"]'
            );
            textboxes.forEach((textbox) => {
              this.attachToTextbox(textbox);
              foundNew = true;
            });
          }
        });
      });

      if (foundNew) {
        console.log('[Gemini Enter] New textbox(es) detected and attached');
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    console.log('[Gemini Enter] DOM observer started');
  }

  /**
   * イベントリスナーを登録
   */
  init(): void {
    console.log('[Gemini Enter] Initializing KeyboardHandler');

    // 最優先: document レベルで capturing phase でキャプチャ
    document.addEventListener('keydown', this.handleKeyDown, {
      capture: true,
      passive: false,
    });

    // バックアップ: window レベルでもキャプチャ
    window.addEventListener('keydown', this.handleKeyDown, {
      capture: true,
      passive: false,
    });

    // keypress イベントもキャプチャ（念のため）
    document.addEventListener('keypress', this.handleKeyDown as any, {
      capture: true,
      passive: false,
    });

    // 既存の入力フィールドを検索して登録
    this.findAndAttachTextboxes();

    // DOM変更を監視
    this.observeDOM();

    console.log('[Gemini Enter] KeyboardHandler initialized');
  }

  /**
   * クリーンアップ
   */
  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown, true);

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
