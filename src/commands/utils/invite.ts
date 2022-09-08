import { ISlashCommand } from "@infinite-fansub/discord-client";
import { SlashCommandBuilder } from "discord.js";
import { getBaseEmbed } from "../../utils/logic";
import { client } from "../../nya";

export default <ISlashCommand>{
	data: new SlashCommandBuilder()
		.setName("invite")
		.setDescription("Replies with invite link for the bot."),
	post: "GLOBAL",

	async execute(interaction) {
		await interaction.reply({
			embeds: [
				getBaseEmbed(interaction, "Information")
					.addFields(
						{
							name: "Invite",
							value: "[LINK](https://discord.com/api/oauth2/authorize?client_id=923164262740938812&permissions=1635614386518&scope=applications.commands%20bot)"
						},
						{ name: "Author", value: "Niek#8051" },
						{
							name: "Repository",
							value: "[LINK](https://github.com/niek-o/NyaBot)"
						}
					)
					.setThumbnail(client.user?.avatarURL() ?? "")
			]
		});
	},
};
