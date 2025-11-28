export interface KeyEventConfig {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
}

export interface DOMElements {
  textbox: HTMLElement | null;
  submitButton: HTMLElement | null;
}
