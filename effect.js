const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

const EFFECTS = {
    'nightcore': 'asetrate=44100*1.25,aresample=44100,atempo=1.25',
    'bassboost': 'bass=g=20:f=110:w=0.3',
    'echo': 'aecho=0.8:0.9:1000:0.3,volume=1.2',
    'reverb': 'aecho=1.0:1.0:15:0.4,aecho=1.0:1.0:35:0.3,aecho=1.0:1.0:65:0.2,aecho=1.0:1.0:105:0.15,aecho=1.0:1.0:155:0.1,volume=1.2',
    'vaporwave': 'asetrate=44100*0.8,aresample=44100,atempo=0.8',
    'reverse': 'areverse'
};

/**
 * 添付ファイルにエフェクトを適用し、一時ファイルのパスを返す
 * @param {string} inputUrl - Discordの添付ファイルURL
 * @param {string} effectType - エフェクト名
 * @param {string} tempId - 一意のID（ファイル名用）
 * @returns {Promise<string>} 生成されたファイルのパス
 */
async function applyEffect(inputUrl, effectType, tempId) {
    return new Promise((resolve, reject) => {
        const filter = EFFECTS[effectType];
        if (!filter) {
            return reject(new Error('不明なエフェクトです。'));
        }

        const outputPath = path.join(__dirname, `output_${tempId}.mp3`);

        ffmpeg(inputUrl)
            .audioFilters(filter)
            .toFormat('mp3')
            .on('end', () => {
                resolve(outputPath);
            })
            .on('error', (err) => {
                console.error('FFmpeg Error:', err);
                reject(err);
            })
            .save(outputPath);
    });
}

module.exports = { applyEffect, EFFECTS };
