import { ISlashCommand }                    from "@infinite-fansub/discord-client";
import { GuildMember, SlashCommandBuilder } from "discord.js";
import { getBaseEmbed }                     from "../../utils/logic";

export default <ISlashCommand>{
	data: new SlashCommandBuilder()
			  .setName("whois")
			  .setDescription("Replies with information about you.")
			  .addUserOption((option) =>
				  option.setName("user")
						.setDescription("The user you want information about")
						.setRequired(false)),
	post: "GLOBAL",
	
	async execute(interaction) {
		const mention = interaction.options.getMember("user") || interaction.member;
		
		if (!(mention instanceof GuildMember) || !mention.joinedTimestamp) return;
		
		const originalCreatedTimestamp = mention.user.createdTimestamp;
		
		const newCreatedTimestamp = (originalCreatedTimestamp - (originalCreatedTimestamp % 1000)) / 1000;
		
		const originalJoinedTimestamp = mention.joinedTimestamp;
		
		const newJoinedTimestamp = (originalJoinedTimestamp - (originalJoinedTimestamp % 1000)) / 1000;
		
		await interaction.reply({
			embeds: [
				getBaseEmbed(interaction, "Whois")
					.setColor(mention.displayHexColor)
					.setThumbnail(`${ mention.user.avatarURL() }`)
					.setFooter({ text: `${ mention.user.tag }`, iconURL: `${ mention.user.avatarURL() }` })
					.addFields(
						{
							name:  "Roles:",
							value: `${ mention.roles.cache.filter(r => r.id != interaction.guild?.id)
											  .map(r => r) }`
						},
						{ name: "Created at:", value: `<t:${ newCreatedTimestamp }>` },
						{ name: "Joined at:", value: `<t:${ newJoinedTimestamp }>` }
					)
			]
		});
	},
};
