const { prefix } = require('../config.json');


module.exports = {
    name: 'clientReady',
    once: true,
    async execute(client) {
        console.log(`[✅ READY] Logged in as ${client.user.tag}`);

        client.user.setPresence({
            activities: [{ name: `${prefix}help`, type: 2 }],
            status: 'idle'
        });

        for (const guild of client.guilds.cache.values()) {
            await client.syncGuildCommands(guild.id);
        }
    }
};
