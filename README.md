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
2.必要なライブラリをインストール
```
npm install
```
3.プロジェクト直下に .env を作成して以下を記入：

```
DISCORD_TOKEN=Botトークン
CLIENT_ID=クライアントID
GUILD_ID=サーバーID
```
### 2. 起動
```bash
node index.js
```

### 3.スラッシュコマンドを削除したい場合
```bash
node clear-commands.js
```

# ライセンス
MITライセンスで公開されています。

