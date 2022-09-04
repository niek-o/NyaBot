import { ISlashCommand }                    from "@infinite-fansub/discord-client";
import { GuildMember, SlashCommandBuilder } from "discord.js";
import { getBaseEmbed, getBaseErrorEmbed }  from "../../utils/logic";
import { request }                          from "node:https";

export default <ISlashCommand>{
	data: new SlashCommandBuilder()
			  .setName("steal")
			  .setDescription("Steal an emoji")
			  .addStringOption((option) => option.setName("emoji")
												 .setDescription("The emoji or direct link to the emoji.")
												 .setRequired(true))
			  .addStringOption((option) => option.setName("name")
												 .setDescription("Name of the emoji")
												 .setRequired(true)),
	post: "GLOBAL",
	
	async execute(interaction) {
		if (
			!interaction.guild ||
			!(interaction.member instanceof GuildMember)
		) {
			return;
		}
		
		let emoji  = interaction.options.getString("emoji", true);
		const name = interaction.options.getString("name", true);
		
		if (emoji.startsWith("<") && emoji.endsWith(">")) {
			const extractedId = emoji.match(/\d{15,}/g);
			
			emoji = emoji.startsWith("<a:")
					? `https://cdn.discordapp.com/emojis/${ extractedId }.gif`
					: `https://cdn.discordapp.com/emojis/${ extractedId }.png`;
		}
		
		function isValidUrl(str: string): boolean {
			try {
				return !!(new URL(str));
			}
			catch {
				return false;
			}
		}
		
		if (isValidUrl(emoji)) {
			request(emoji, (async (res) => {
				if (res.statusCode === 404) {
					return await interaction.reply({
						embeds: [
							getBaseErrorEmbed("Emoji not found.")
						]
					});
				}
			})).end();
		}
		else {
			return await interaction.reply({
				embeds: [
					getBaseErrorEmbed("Invalid URL.")
				]
			});
		}
		
		const emj = await interaction.guild.emojis.create({ attachment: emoji, name: name });
		
		const emojiString = emoji.includes(".gif")
							? `<a:${ emj.name }:${ emj.id }>`
							: `<:${ emj.name }:${ emj.id }>`;
		
		await interaction.reply({
			embeds: [
				getBaseEmbed(
					interaction,
					"Steal",
					`Added emoji ${ emojiString } with name ${ emj.name }`
				)
			]
		});
	},
};


