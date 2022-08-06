import { ISlashCommand }                                 from "@infinite-fansub/discord-client";
import { SlashCommandBuilder, GuildMember, TextChannel } from "discord.js";
import { client }                                        from "../../nya";
import { getBaseEmbed, getBaseErrorEmbed }               from "../../utils/logic";

export default <ISlashCommand>{
	data: new SlashCommandBuilder()
			  .setName("shuffle")
			  .setDescription("Shuffle the queue."),
	async execute(interaction) {
		if (
			!interaction.guild ||
			!(interaction.member instanceof GuildMember) ||
			!(interaction.channel instanceof TextChannel)
		) {
			return;
		}
		
		await interaction.deferReply();
		
		const player = client.manager.get(interaction.guild.id);
		if (!player) {
			return interaction.editReply({ embeds: [getBaseErrorEmbed("There is no player for this guild.")] });
		}
		
		if (!interaction.member.voice.channel) {
			return interaction.editReply({ embeds: [getBaseErrorEmbed("You need to join a voice channel.")] });
		}
		
		if (interaction.member.voice.channel.id !== player.voiceChannel) {
			return interaction.editReply({ embeds: [getBaseErrorEmbed("You're not in the same voice channel.")] });
		}
		
		if (!player.queue.current || !player.queue.current.duration) {
			return interaction.editReply({ embeds: [getBaseErrorEmbed("There is no music playing.")] });
		}
		
		player.queue.shuffle();
		return interaction.reply({ embeds: [getBaseEmbed(interaction, "Shuffle", "The queue has been shuffled.")] });
	},
};
