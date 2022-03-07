import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { client } from "../../nya";

export = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
	async execute(interaction: CommandInteraction) {
		await interaction.reply(`Websocket heartbeat: ${client.ws.ping}ms.`);
	},
};
