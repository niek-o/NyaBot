import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export = {
	data: new SlashCommandBuilder().setName("invite").setDescription("Replies with invite link for the bot."),
	async execute(interaction: CommandInteraction) {
		await interaction.reply(
			"https://discord.com/api/oauth2/authorize?client_id=923164262740938812&permissions=1635614386518&scope=applications.commands%20bot"
		);
	},
};
