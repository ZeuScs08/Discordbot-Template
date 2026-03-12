
module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;

        try { 

            await command.execute(interaction, client);

        } catch (error) {
            console.error(`❌ Error executing slash command '${interaction.commandName}':`, error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: '❌ An error occurred while executing the command.', ephemeral: true });
            } else {
                await interaction.reply({ content: '❌ An error occurred while executing the command.', ephemeral: true });
            }
        }
    }
};
