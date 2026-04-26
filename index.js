const { Client, GatewayIntentBits, Events, AttachmentBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const { applyEffect, EFFECTS } = require('./effect');

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	] 
});

client.once(Events.ClientReady, async c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

	const commands = [
		new SlashCommandBuilder()
			.setName('effect')
			.setDescription('音声ファイルにエフェクトを適用します')
			.addStringOption(option =>
				option.setName('type')
					.setDescription('エフェクトの種類')
					.setRequired(true)
					.addChoices(
						{ name: 'Nightcore (高音・高速化)', value: 'nightcore' },
						{ name: 'Bassboost (低音強調)', value: 'bassboost' },
						{ name: 'Echo (エコー)', value: 'echo' },
						{ name: 'Reverb (リバーブ)', value: 'reverb' },
						{ name: 'Vaporwave (低音・低速化)', value: 'vaporwave' },
						{ name: 'Reverse (逆再生)', value: 'reverse' }
					))
			.addAttachmentOption(option =>
				option.setName('file')
					.setDescription('対象の音声ファイル')
					.setRequired(true)),
	].map(command => command.toJSON());

	const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
	try {
		console.log('スラッシュコマンドを自動同期しています...');
		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);
		console.log('コマンドの同期が完了しました！');
	} catch (error) {
		console.error('コマンドの同期に失敗しました:', error);
	}
});

// スラッシュコマンドのハンドリング
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'effect') {
		await interaction.deferReply();
		
		const effectType = interaction.options.getString('type');
		const attachment = interaction.options.getAttachment('file');

		if (!attachment.contentType?.startsWith('audio/') && !attachment.contentType?.startsWith('video/')) {
			return interaction.editReply('音声または動画ファイルを添付してください。');
		}

		await processAndSendEffect(interaction, attachment.url, effectType, interaction.id);
	}
});

// プレフィックスコマンドのハンドリング (!effect)
client.on(Events.MessageCreate, async message => {
	if (message.author.bot) return;
	
	if (message.content.startsWith('!effect')) {
		const args = message.content.split(' ');
		const effectType = args[1];

		if (!effectType || !EFFECTS[effectType]) {
			return message.reply(`無効なエフェクトです。使用可能なエフェクト:\n${Object.keys(EFFECTS).join(', ')}`);
		}

		const attachment = message.attachments.first();
		if (!attachment) {
			return message.reply('音声ファイルが添付されていません。');
		}

		if (!attachment.contentType?.startsWith('audio/') && !attachment.contentType?.startsWith('video/')) {
			return message.reply('音声または動画ファイルを添付してください。');
		}

		const processingMsg = await message.reply('処理中...');
		await processAndSendEffect(processingMsg, attachment.url, effectType, message.id, true);
	}
});

/**
 * 共通の処理ロジック
 */
async function processAndSendEffect(target, url, effectType, tempId, isMessage = false) {
	try {
		const outputPath = await applyEffect(url, effectType, tempId);
		const attachment = new AttachmentBuilder(outputPath, { name: `${effectType}_effect.mp3` });

		if (isMessage) {
			await target.edit({ content: `処理完了 (${effectType})`, files: [attachment] });
		} else {
			await target.editReply({ content: `処理完了 (${effectType})`, files: [attachment] });
		}

		// 送信後に一時ファイルを削除
		fs.unlink(outputPath, (err) => {
			if (err) console.error('一時ファイルの削除に失敗しました:', err);
		});
	} catch (error) {
		console.error(error);
		const errMsg = 'エラー: ファイル形式が対応していないか、サイズが大きすぎます。';
		if (isMessage) {
			await target.edit({ content: errMsg });
		} else {
			await target.editReply(errMsg);
		}
	}
}

client.login(process.env.DISCORD_TOKEN);
