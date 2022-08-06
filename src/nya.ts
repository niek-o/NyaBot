import { IClientOptions, InfiniteClient } from "@infinite-fansub/discord-client/dist";
import { GatewayIntentBits } from "discord.js";
import { Manager, Payload } from "erela.js";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import nyaOptions from "./config";
import { globalLogger } from "@infinite-fansub/logger/dist";
import { Color } from "colours.js/dst";

//#region Setup logger
globalLogger.showDay = true;

globalLogger.emojis = {
	emoji: nyaOptions.logger.emoji,
	errorEmoji: nyaOptions.logger.errorEmoji
};

globalLogger.colors = {
	color: Color.fromHex(nyaOptions.logger.color),
	errorColor: Color.fromHex(nyaOptions.logger.errorColor)
};
//#endregion

export class NyaClient extends InfiniteClient {
	public manager: Manager;
	private musicEventFiles: string[] = readdirSync("src/musicEvents").filter((f) => f.endsWith(".ts") || f.endsWith(".js"));

	constructor(options: IClientOptions, manager: Manager) {
		super(options);
		this.manager = manager
		// MusicEvents handling
		this.musicEventFiles.forEach(async (f) => {
			const event = (await import(`./musicEvents/${f}`)).default;
			this.manager.on(event.name, (...args) => event.execute(...args));
		});
	}
}

export const client = new NyaClient({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
	disable: {
		warnings: true
	},
	dirs: {
		events: join(__dirname, "./events"),
		slashCommands: join(__dirname, "./commands")
	},
	token: nyaOptions.discord.token
}, new Manager({
	// Pass an array of node. Note: You do not need to pass any if you are using the default values (ones shown below).
	nodes: [
		// If you pass an object like so the "host" property is required
		{
			host: nyaOptions.music.lavalink.host, // Optional if Lavalink is local
			port: nyaOptions.music.lavalink.port, // Optional if Lavalink is set to default
			password: nyaOptions.music.lavalink.password, // Optional if Lavalink is set to default
		},
	],
	// A send method to send data to the Discord WebSocket using your library.
	// Getting the shard for the guild and sending the data to the WebSocket.
	send(id: string, payload: Payload) {
		const guild = client.guilds.cache.get(id);
		if (guild) guild.shard.send(payload);
	},
})
);
