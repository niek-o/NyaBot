import { ISlashCommand }       from "@infinite-fansub/discord-client";
import { SlashCommandBuilder } from "discord.js";
import { client }              from "../../nya";

export default <ISlashCommand>{
	data: new SlashCommandBuilder()
			  .setName("ping")
			  .setDescription("Replies with the websocket heartbeat."),
	post: "GLOBAL",
	
	async execute(interaction) {
		await interaction.reply(`Websocket heartbeat: ${ client.ws.ping }ms.`);
	},
};
