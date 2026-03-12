
module.exports = {
    name: "guildCreate",

    async execute(guild,client) {
        console.log(`📥 Bot added to guild: ${guild.name} (${guild.id})`);
        await client.syncGuildCommands(guild.id);
    }
};
