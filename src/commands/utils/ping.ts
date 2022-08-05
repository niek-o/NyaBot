import { ISlashCommand } from "@infinite-fansub/discord-client/dist";
import { SlashCommandBuilder } from "discord.js";
import { client } from "../../nya";

export default <ISlashCommand>{
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),
	async execute(interaction) {
		await interaction.reply(`Websocket heartbeat: ${client.ws.ping}ms.`);
	},
};
