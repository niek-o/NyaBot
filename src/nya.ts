import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { Client, ClientOptions, Intents } from "discord.js";
import { Manager, Payload } from "erela.js";
import Spotify from "erela.js-spotify";
import { readdirSync } from "node:fs";
import { join } from "path/posix";
import nyaOptions from "./config";
import { logger } from "./utils/logger";
import { ICommand } from "./utils/Typings/Typings";

export class NyaClient extends Client {
	commands = new Map<string, ICommand>();
	declare manager: Manager;
	private djsRest = new REST({ version: "9" });
	private cmds: Array<any> = [];
	private commandFolders: string[] = readdirSync(join(__dirname, "./commands"));
	private eventFiles: string[] = readdirSync("src/events").filter(f => f.endsWith(".ts"));
	private musicEventFiles: string[] = readdirSync("src/musicEvents").filter(f => f.endsWith(".ts"));

	constructor(token: string, options: ClientOptions) {
		super(options);
		this.djsRest.setToken(token);

		// Load commands
		this.commandFolders.forEach(commandFolder => {
			const commandFiles = readdirSync(`src/commands/${commandFolder}`).filter(f => f.endsWith(".ts"));
			commandFiles.forEach(async (f) => {
				const command: ICommand = (await import(`./commands/${commandFolder}/${f}`)).default;
				this.commands.set(command.data.name, command);
			});
		});

		// Event handling
		this.eventFiles.forEach(async (f) => {
			const event = (await import(`./events/${f}`)).default;
			if (event.once) {
				this.once(event.name, (...args) => event.execute(...args));
			} else {
				this.on(event.name, (...args) => event.execute(...args));
			}
		});

		// MusicEvents handling
		this.musicEventFiles.forEach(async (f) => {
			const event = (await import(`./musicEvents/${f}`)).default;
			this.manager.on(event.name, (...args) => event.execute(...args));
		});

		this.login(token).then(() => {
			this.commands.forEach(cmd => {
				this.cmds.push(cmd.data.toJSON());
			});

			this.djsRest.put(Routes.applicationGuildCommands(nyaOptions.discord.clientId, nyaOptions.discord.guildId), { body: this.cmds })
				.then(() => logger.log("Successfully registered application commands."))
				.catch(logger.error);

			this.djsRest.put(Routes.applicationCommands(nyaOptions.discord.clientId), { body: this.cmds })
				.then(() => logger.log("Successfully registered global commands."))
				.catch(logger.error);
		});
	}
}

export const client = new NyaClient(nyaOptions.discord.token, { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

// Command handling
client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);

	if (!command) return;
	try {
		await command.execute(interaction);
	} catch (error) {
		logger.error(error);
		await interaction.reply({ content: `${error}`, ephemeral: false });
	}
});


// Initiate the Manager with some options and listen to some events.
client.manager = new Manager({
	// Pass an array of node. Note: You do not need to pass any if you are using the default values (ones shown below).
	nodes: [
		// If you pass a object like so the "host" property is required
		{
			host: nyaOptions.music.lavalink.host, // Optional if Lavalink is local
			port: nyaOptions.music.lavalink.port, // Optional if Lavalink is set to default
			password: nyaOptions.music.lavalink.password // Optional if Lavalink is set to default
		}
	],
	plugins: [
		// Initiate the plugin and pass the two required options.
		new Spotify({
			clientID: nyaOptions.music.spotify.id,
			clientSecret: nyaOptions.music.spotify.secret
		})
	],
	// A send method to send data to the Discord WebSocket using your library.
	// Getting the shard for the guild and sending the data to the WebSocket.
	send(id: string, payload: Payload) {
		const guild = client.guilds.cache.get(id);
		if (guild) guild.shard.send(payload);
	}
});