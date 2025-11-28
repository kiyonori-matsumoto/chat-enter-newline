# Chrome Web Store 公開手順

## 準備完了項目 ✅

- [x] 拡張機能のビルド（dist/）
- [x] 配布用ZIPファイル作成（gemini-enter-newline-v1.0.0.zip）
- [x] ストア掲載情報（STORE_LISTING.md）
- [x] プライバシーポリシー（PRIVACY_POLICY.md）
- [x] アイコン（16x16, 48x48, 128x128）

## 必要な準備

### 1. Chrome Web Store Developer アカウント
- URL: https://chrome.google.com/webstore/devconsole/
- 登録料: $5（一度のみ）
- Googleアカウントが必要

### 2. スクリーンショット（必須）
Chrome Web Storeに掲載するには、最低1枚のスクリーンショットが必要です。

**推奨サイズ**: 1280x800 または 640x400
**フォーマット**: PNG または JPEG
**枚数**: 1〜5枚

#### スクリーンショットのアイデア:
1. **Enterで改行**
   - Geminiの入力欄でEnterを押して改行している様子

2. **Ctrl+Enterで送信**
   - Ctrl+Enter（Cmd+Enter）で送信している様子

3. **複数行テキスト**
   - 複数行のテキストを入力している例

#### スクリーンショット作成方法:
```bash
# Geminiのページを開いて、以下を実行:
1. ブラウザをフルスクリーン表示
2. 入力欄にフォーカス
3. スクリーンショットを撮影（Cmd+Shift+4 on Mac）
4. 必要に応じて注釈を追加
```

### 3. プライバシーポリシーのホスティング
PRIVACY_POLICY.mdをWeb上に公開する必要があります。

**オプション**:
- GitHub Pages（推奨）
- Googleドキュメント（公開設定）
- 個人のWebサイト

#### GitHub Pagesでの公開方法:
```bash
# リポジトリの Settings > Pages で有効化
# PRIVACY_POLICY.md を公開
# URL: https://kiyonori-matsumoto.github.io/chat-enter-newline/PRIVACY_POLICY.html
```

## 公開手順

### Step 1: Developer Console にアクセス
1. https://chrome.google.com/webstore/devconsole/ にアクセス
2. Googleアカウントでログイン
3. 初回の場合、$5の登録料を支払う

### Step 2: 新しいアイテムを作成
1. 「新しいアイテム」ボタンをクリック
2. `gemini-enter-newline-v1.0.0.zip` をアップロード
3. アップロード完了を待つ

### Step 3: ストア掲載情報を入力

#### 商品の詳細
- **言語**: 日本語を選択
- **拡張機能の名前**: Gemini Enter for Newline
- **概要**: （STORE_LISTING.mdの「短い説明」をコピー）
- **詳細な説明**: （STORE_LISTING.mdの「詳細な説明」をコピー）
- **カテゴリ**: 生産性向上ツール（Productivity）

#### アイコンとスクリーンショット
- **アイコン**: public/icons/icon-128.png をアップロード
- **スクリーンショット**: 作成したスクリーンショット（1〜5枚）をアップロード

#### プライバシーの設定
- **単一目的**: 「Geminiでのキーボード入力動作の改善」
- **権限の正当性**:
  - `scripting`: キーボードイベントハンドラーを注入するため
  - `tabs`: ブラウザ起動時の正常動作を保証するため
  - `host_permissions`: Geminiページでのみ動作するため
- **プライバシーポリシー**: ホスティングしたURLを入力

#### 配信
- **公開設定**: 公開
- **価格**: 無料

### Step 4: 審査に提出
1. すべての情報を入力
2. 「審査のために送信」ボタンをクリック
3. 審査完了を待つ（通常1〜3営業日）

## 審査後

### 承認された場合
- Chrome Web Storeに公開されます
- ストアURLを取得できます
- READMEに公開URLを追加

### 却下された場合
- 却下理由を確認
- 必要な修正を行う
- 再提出

## 更新方法

バージョンアップ時：
1. `src/manifest.json` のバージョンを更新（例: 1.0.1）
2. `pnpm run build` でビルド
3. 新しいZIPファイルを作成
4. Developer Consoleから「パッケージをアップロード」
5. 変更点を記載して審査に提出

## チェックリスト

公開前に確認：

- [ ] 拡張機能が正常に動作することを確認
- [ ] スクリーンショットを準備（1〜5枚）
- [ ] プライバシーポリシーをWeb上に公開
- [ ] STORE_LISTING.mdの内容を確認
- [ ] manifest.jsonのバージョンを確認
- [ ] ZIPファイルのサイズを確認（20KB程度）
- [ ] アイコンの品質を確認

## 参考リンク

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
- [Chrome Web Store 公開ガイド](https://developer.chrome.com/docs/webstore/publish/)
- [プライバシーポリシーの要件](https://developer.chrome.com/docs/webstore/program-policies/)
