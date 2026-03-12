const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('ping'),

    async execute(interaction) {
        await interaction.reply(`Pong!`);
    }
};
