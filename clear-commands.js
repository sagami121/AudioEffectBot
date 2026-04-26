const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		console.log('不要なスラッシュコマンドの削除を開始します...');

		// 1. ギルド（サーバー）固有のコマンドをすべて削除
		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: [] },
		);
		console.log('ギルドコマンドの削除に成功しました。');

		// 2. グローバルコマンド（Python版などで登録された可能性があるもの）をすべて削除
		await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: [] },
		);
		console.log('グローバルコマンドの削除に成功しました。');

		console.log('すべての古いコマンドの消去が完了しました！\n再度 `node deploy-commands.js` を実行して、新しいコマンドのみを登録してください。');
	} catch (error) {
		console.error('コマンドの削除中にエラーが発生しました:', error);
	}
})();
