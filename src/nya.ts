import { IClientOptions, InfiniteClient } from "@infinite-fansub/discord-client";
import { GatewayIntentBits, ClientUser }  from "discord.js";
import { Manager, Payload }               from "erela.js";
import { readdirSync }                    from "node:fs";
import { join }                           from "node:path";
import nyaOptions                         from "./config";
import { Color }                          from "colours.js/dst";

require("@infinite-fansub/logger");

//#region Setup logger
logger.showMemory = false;
logger.showDay    = true;

logger.emojis = {
	emoji:      nyaOptions.logger.emoji,
	errorEmoji: nyaOptions.logger.errorEmoji
};

logger.colors = {
	color:      Color.fromHex(nyaOptions.logger.color),
	errorColor: Color.fromHex(nyaOptions.logger.errorColor)
};

//#endregion

//#region Define client
export class NyaClient extends InfiniteClient {
	declare public user: ClientUser;
	public manager: Manager;
	private musicEventFiles: string[] = readdirSync(join(__dirname, "./events/erela"))
		.filter((f) => f.endsWith(".ts") || f.endsWith(".js"));
	
	constructor(options: IClientOptions, manager: Manager) {
		super(options);
		this.manager = manager;
		// MusicEvents handling
		this.musicEventFiles.forEach(async (f) => {
			const event = (await import(`./events/erela/${ f }`)).default;
			this.manager.on(event.name, (...args) => event.execute(...args));
		});
	}
}

//#endregion

//#region Setup client
export const client = new NyaClient({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildVoiceStates
		],
		disable: {
			warnings: true
		},
		dirs:    {
			events:        join(__dirname, "./events/discord"),
			slashCommands: join(__dirname, "./commands")
		},
		token:   nyaOptions.token
	}, new Manager({
		nodes: [
			nyaOptions.music.lavalink
		],
		send(id: string, payload: Payload) {
			const guild = client.guilds.cache.get(id);
			if (guild) guild.shard.send(payload);
		},
	})
);

//#endregion
