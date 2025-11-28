# Gemini Enter for Newline

Gemini（gemini.google.com/app）でエンターキーの動作を変更するChrome拡張機能です。

## 機能

- **Enterキー**: 改行を挿入
- **Ctrl+Enter（MacではCmd+Enter）**: メッセージ送信

## インストール方法

### 開発モードでの読み込み

1. プロジェクトをビルド：
   ```bash
   pnpm install
   pnpm run build
   ```

2. Chromeで `chrome://extensions/` を開く

3. 右上の「デベロッパーモード」をONにする

4. 「パッケージ化されていない拡張機能を読み込む」をクリック

5. このプロジェクトの `dist/` ディレクトリを選択

## 使い方

1. [Gemini](https://gemini.google.com/app) にアクセス

2. メッセージ入力欄で：
   - **Enter**: 改行が挿入されます
   - **Ctrl+Enter（Mac: Cmd+Enter）**: メッセージが送信されます

## 開発

### 必要な環境

- Node.js 18以上
- pnpm

### セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発モードでビルド（ファイル変更を監視）
pnpm run dev

# 本番用ビルド
pnpm run build

# コードのリント
pnpm run lint

# コードのフォーマット
pnpm run format
```

### プロジェクト構造

```
chat-enter-newline/
├── src/
│   ├── content-scripts/
│   │   ├── index.ts              # エントリーポイント
│   │   ├── keyboard-handler.ts   # キーボードイベント処理
│   │   └── dom-detector.ts       # DOM要素検出
│   ├── common/
│   │   ├── types.ts              # 型定義
│   │   └── constants.ts          # 定数
│   └── manifest.json             # Chrome拡張マニフェスト
├── dist/                         # ビルド出力先
├── vite.config.ts                # Vite設定
├── tsconfig.json                 # TypeScript設定
└── package.json
```

## テスト

1. 拡張機能を読み込んだ状態で [Gemini](https://gemini.google.com/app) にアクセス

2. 以下の動作を確認：
   - ✓ Enterキーで改行が挿入される
   - ✓ Ctrl+Enter（Mac: Cmd+Enter）でメッセージが送信される
   - ✓ 複数行のテキストが正しく送信される

## 技術スタック

- **TypeScript**: 型安全性の確保
- **Vite**: 高速なビルドツール
- **Chrome Extension Manifest V3**: 最新の拡張機能仕様

## ライセンス

MIT
