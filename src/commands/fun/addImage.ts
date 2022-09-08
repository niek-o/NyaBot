import { ISlashCommand }                                         from "@infinite-fansub/discord-client";
import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { getBaseEmbed, getBaseErrorEmbed }                       from "../../utils/logic";
import nyaOptions                                                from "../../config";

export default <ISlashCommand>{
	data: new SlashCommandBuilder()
			  .setName("addimage")
			  .setDescription("Add an image.")
			  .addStringOption((option) => option.setName("folder")
												 .setDescription("The folder it goes in")
												 .setRequired(true))
			  .addStringOption((option) => option.setName("url")
												 .setDescription("URL of the image")
												 .setRequired(true))
			  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	post: nyaOptions.guildId,
	
	async execute(interaction) {
		if (
			!interaction.guild ||
			!(interaction.member instanceof GuildMember)
		) {
			return;
		}
		
		const BASE_IP = nyaOptions.imageAPI.host + ":" + nyaOptions.imageAPI.port;
		
		const folder = interaction.options.getString("folder", true);
		const url    = interaction.options.getString("url", true);
		
		if (!url.match(/\.(gif|jpg|jpeg|tiff|png)$/i)) {
			return interaction.reply({
				embeds: [
					getBaseErrorEmbed("Invalid URL")
				]
			});
		}
		
		fetch(BASE_IP, {
			method:  "POST",
			headers: {
				"content-type": "application/json"
			}, body: JSON.stringify({
				path: folder,
				url:  url,
			})
		});
		
		await interaction.reply({
			embeds: [
				getBaseEmbed(
					interaction,
					"Add Image",
					`Added image to ${ folder }.`
				)
			]
		});
	},
};


