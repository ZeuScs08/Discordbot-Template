const fs = require("fs");
const path = require("path");
const {
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
    REST,
    Routes
} = require("discord.js");
const { token, prefix } = require("./config.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        //GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

client.prefix = prefix;
client.commands = new Collection();
client.aliases = new Collection();
client.slashCommands = new Collection();

function loadFiles(folder, callback) {
    const folderPath = path.join(__dirname, folder);

    if (!fs.existsSync(folderPath)) return;

    const files = fs.readdirSync(folderPath).filter(file => file.endsWith(".js"));
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const data = require(filePath);
        callback(data, file);
    }
}

loadFiles("Commands", (command, file) => {
    if (!command.name || typeof command.execute !== "function") {
        return console.warn(`[WARNING] ${file} is not a valid command.`);
    }

    client.commands.set(command.name, command);

    if (Array.isArray(command.aliases)) {
        for (const alias of command.aliases) {
            client.aliases.set(alias, command.name);
        }
    }
});

loadFiles("SlashCommands", (command, file) => {
    if (!command.data || typeof command.execute !== "function") {
        return console.warn(`[WARNING] ${file} is not a valid slash command.`);
    }

    client.slashCommands.set(command.data.name, command);
});

loadFiles("Events", (event, file) => {
    if (!event.name || typeof event.execute !== "function") {
        return console.warn(`[WARNING] ${file} is not a valid event.`);
    }

    const handler = (...args) => event.execute(...args, client);
    event.once ? client.once(event.name, handler) : client.on(event.name, handler);
});

const rest = new REST({ version: "10" }).setToken(token);

client.syncGuildCommands = async (guildId) => {
    try {
        const commands = [...client.slashCommands.values()].map(cmd => cmd.data.toJSON());

        await rest.put(
            Routes.applicationGuildCommands(client.user.id, guildId),
            { body: commands }
        );

        console.log(`[SLASH SYNC] Guild ${guildId} synced (${commands.length} commands)`);
    } catch (error) {
        console.error(`[SLASH SYNC ERROR] Guild ${guildId}`, error);
    }
};

client.login(token);