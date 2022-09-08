import { InfiniteClient } from "@infinite-fansub/discord-client";
import { ErelaModule, ErelaOptions } from "@infinite-fansub/erela-module";
import { GatewayIntentBits } from "discord.js";
import { join } from "node:path";
import nyaOptions from "./config";
import { Color } from "colours.js/dst";

require("@infinite-fansub/logger");

//#region Setup logger
logger.showMemory = false;
logger.showDay = true;

logger.emojis = {
	emoji: nyaOptions.logger.emoji,
	errorEmoji: nyaOptions.logger.errorEmoji
};

logger.colors = {
	color: Color.fromHex(nyaOptions.logger.color),
	errorColor: Color.fromHex(nyaOptions.logger.errorColor)
};

//#endregion

//#region Setup client
export const client = new InfiniteClient<ErelaOptions>({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates
	],
	disable: {
		warnings: true
	},
	dirs: {
		events: join(__dirname, "./events/discord"),
		slashCommands: join(__dirname, "./commands"),
		erela: join(__dirname, "./events/erela")
	},
	nodes: [
		nyaOptions.music.lavalink
	],
	token: nyaOptions.token
}).withModules<[
	{ name: "erela", ctor: new (client: InfiniteClient) => ErelaModule }
]>([
	{ name: "erela", ctor: ErelaModule }
]);

//#endregion
