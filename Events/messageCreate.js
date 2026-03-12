module.exports = {
    name: "messageCreate",
    /**
     * @param {import('discord.js').Message} message
     * @param {import('discord.js').Client} client
     */
    async execute(message, client) {
        try {
            if (!message.guild || !message.channel || !message.author || message.author.bot) return;
            if (!message.content) return;

            const mentionRegex = new RegExp(`^<@!?${client.user.id}>$`);
            if (mentionRegex.test(message.content.trim())) {
                const botMember = message.guild.members.me;
                if (botMember && message.channel.permissionsFor(botMember)?.has("SendMessages")) {
                    await message.channel.send(`Hi ${message.author}, if you need help, type \`${client.prefix}help\`!`);
                }
                return;
            }

            if (!message.content.startsWith(client.prefix)) return;

            const args = message.content.slice(client.prefix.length).trim().split(/\s+/);
            const commandName = args.shift()?.toLowerCase();
            if (!commandName) return;

            const cmd =
                client.commands.get(commandName) ||
                client.commands.get(client.aliases.get(commandName));

            if (!cmd) return;

            await cmd.execute(message, args, client);
        } catch (error) {
            console.error("❌ Error in messageCreate event:", error);

            try {
                const botMember = message.guild?.members?.me;
                if (
                    botMember &&
                    message.channel &&
                    message.channel.permissionsFor(botMember)?.has("SendMessages")
                ) {
                    await message.reply("❌ An error occurred while executing the command.");
                }
            } catch (err) {
                console.error("❌ Failed to send error message:", err.message);
            }
        }
    }
};