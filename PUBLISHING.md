# Chrome Web Store 公開ガイド

## 公開前チェックリスト

### 必須項目
- [ ] アイコン作成完了（16px, 48px, 128px）
- [ ] manifest.jsonのバージョン確認
- [ ] 本番用ビルド実行済み
- [ ] 動作確認済み（Enter=改行、Cmd/Ctrl+Enter=送信、IME対応）
- [ ] 開発者登録料$5の支払い準備

### 推奨項目
- [ ] スクリーンショット撮影（1280x800）
- [ ] 詳細な説明文作成
- [ ] プライバシーポリシー確認

---

## ステップ1: 開発者登録

### 1.1 Chrome Web Store Developer Dashboardにアクセス
```
https://chrome.google.com/webstore/devconsole
```

### 1.2 デベロッパー登録料の支払い
- **費用**: $5（一度きり、すべての拡張機能に適用）
- **支払い方法**: クレジットカード/デビットカード
- **必要情報**:
  - Googleアカウント
  - メールアドレス（公開される）
  - デベロッパー名（公開される）

---

## ステップ2: パッケージング

### 2.1 本番用ビルド
```bash
pnpm run build
```

### 2.2 ZIPファイル作成
```bash
cd dist
zip -r ../gemini-enter-newline.zip .
cd ..
```

**重要**: `dist`フォルダの**中身**を圧縮すること。`dist`フォルダ自体を圧縮しないこと。

### 2.3 ZIPファイルの内容確認
```
gemini-enter-newline.zip
├── manifest.json
├── content-scripts/
│   └── index.js
└── icons/
    ├── icon-16.png
    ├── icon-48.png
    └── icon-128.png
```

---

## ステップ3: ストア掲載情報の準備

### 3.1 詳細な説明（日本語）

```
Gemini（Google AI）でのキーボード操作を改善する拡張機能です。

【機能】
• Enterキー → 改行
• Cmd+Enter（Windows/Linux: Ctrl+Enter）→ メッセージ送信
• 日本語IME完全対応

【特徴】
• 複数行のメッセージが書きやすい
• チャットアプリと同じ操作感
• 軽量・高速動作

【プライバシー】
• ユーザーデータを一切収集しません
• インターネット接続不要
• すべての処理はブラウザ内で完結

【対応サイト】
• https://gemini.google.com/app
```

### 3.2 簡潔な説明（128文字以内）
```
GeminiでEnterキーを改行に変更。Cmd/Ctrl+Enterで送信。複数行のメッセージが書きやすくなります。
```

### 3.3 カテゴリ
- **推奨**: 生産性向上

### 3.4 スクリーンショット（必須：最低1枚）
- **サイズ**: 1280x800 または 640x400
- **枚数**: 1〜5枚
- **内容例**:
  1. Geminiで改行している様子
  2. Cmd+Enterで送信している様子
  3. 使用前後の比較

**撮影方法**:
```bash
# macOSのスクリーンショット
Cmd + Shift + 4 → スペースキー → ウィンドウをクリック
```

### 3.5 プロモーション用画像（任意）
- 小サイズ: 440x280
- 大サイズ: 920x680
- 侯爵サイズ: 1400x560

---

## ステップ4: アップロードと申請

### 4.1 新しいアイテムを作成
1. Developer Dashboardで「新しいアイテム」をクリック
2. ZIPファイルをアップロード
3. 自動検証が実行される

### 4.2 ストア掲載情報を入力

#### 必須項目
- [ ] 詳細な説明
- [ ] カテゴリ選択（生産性向上）
- [ ] 言語選択（日本語）
- [ ] スクリーンショット（1枚以上）

#### 配布設定
- **公開範囲**: 公開（誰でもインストール可能）
- **地域**: すべての地域
- **価格**: 無料

### 4.3 審査申請
1. 「審査のために送信」ボタンをクリック
2. 自動チェック（マルウェア、ポリシー違反）
3. 手動審査（通常1〜3営業日）

---

## ステップ5: 審査と公開

### 審査期間
- **通常**: 1〜3営業日
- **早い場合**: 数時間
- **遅い場合**: 1週間程度

### 審査で見られるポイント
✅ **承認されやすい条件**
- 明確な機能説明
- 最小限のパーミッション
- 高品質なスクリーンショット
- プライバシーへの配慮

❌ **却下される理由**
- 誤解を招く説明
- 不要なパーミッション要求
- マルウェアや悪意のあるコード
- 著作権侵害

### 公開後
- ストアに公開される
- ユーザーがインストール可能になる
- レビューの管理

---

## バージョン更新手順

### 1. バージョン番号を更新
```json
// src/manifest.json
{
  "version": "1.0.1"  // 1.0.0 → 1.0.1
}
```

**バージョン番号のルール**:
```
major.minor.patch
  1  .  0  .  0

major: 大きな変更・破壊的変更
minor: 新機能追加
patch: バグ修正
```

### 2. コードを修正・ビルド
```bash
# 修正後
pnpm run build

# ZIPファイル作成
cd dist
zip -r ../gemini-enter-newline-v1.0.1.zip .
cd ..
```

### 3. Developer Dashboardで更新
1. 該当の拡張機能を選択
2. 「パッケージをアップロード」
3. 新しいZIPファイルを選択
4. 変更内容を記載
5. 「審査のために送信」

### 4. 再審査
- 初回より早い（通常数時間〜1日）
- 承認後、自動的にユーザーに配信

---

## トラブルシューティング

### ビルドエラー
```bash
# node_modulesを削除して再インストール
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm run build
```

### ZIPファイルエラー
- manifest.jsonがルートにあるか確認
- distフォルダ自体を圧縮していないか確認
- ファイルサイズ制限（128MB）を超えていないか確認

### 審査却下
- 却下理由を確認
- 該当箇所を修正
- 再申請

---

## 参考リンク

- **Chrome Web Store開発者ダッシュボード**
  https://chrome.google.com/webstore/devconsole

- **公式ドキュメント**
  https://developer.chrome.com/docs/webstore/

- **ポリシーガイドライン**
  https://developer.chrome.com/docs/webstore/program-policies/

---

## 自動化（将来の拡張）

現在は手動で公開していますが、将来的にGitHub Actionsで自動化可能です：

```yaml
# .github/workflows/publish.yml
on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install
      - run: pnpm run build
      - uses: mnao305/chrome-extension-upload@v4
        with:
          extension-id: ${{ secrets.EXTENSION_ID }}
          # ...
```

詳細は別途ドキュメント化予定。

---

## 費用まとめ

| 項目 | 費用 |
|------|------|
| 開発者登録 | $5（一度きり） |
| 公開・更新 | 無料 |
| ホスティング | 無料 |
| **合計** | **$5のみ** |
