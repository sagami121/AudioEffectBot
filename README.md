# Discord Music Bot

YouTube の音楽をボイスチャンネルで再生できる Discord Bot です。

## 機能
- **YouTube 対応**: URL または検索ワードから再生
- **SoundCloud 対応**: 直接 URL を貼って再生可能
- **Apple Music 対応**: URL から曲を特定し YouTube で再生
- `/skip`: 次の曲へ
- `/stop`: 再生停止・退出
- `/queue`: キューを表示

## 導入方法

### 1. リポジトリのクローン
```bash
git clone [あなたのリポジトリURL]
cd Disbot
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 設定ファイルの作成
`.env.example` をコピーして `.env` を作成し、必要な情報を入力してください。
```bash
cp .env.example .env
```

- `DISCORD_TOKEN`: Discord Developer Portal で取得したトークン
- `CLIENT_ID`: アプリケーションの ID
- `GUILD_ID`: テスト用サーバーの ID

### 4. コマンドの登録
```bash
node deploy-commands.js
```

### 5. 起動
```bash
node index.js
```

## ライセンス
MIT License
