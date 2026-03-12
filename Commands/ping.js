module.exports = {
    name: 'ping',
    description: 'ping',
    async execute(message) {
        await message.reply(`Pong`);
    }
};