import { ISlashCommand }                                 from "@infinite-fansub/discord-client";
import { SlashCommandBuilder, GuildMember, TextChannel } from "discord.js";
import { client }                                        from "../../nya";
import { getBaseEmbed, getBaseErrorEmbed }               from "../../utils/logic";

export default <ISlashCommand>{
	data: new SlashCommandBuilder()
			  .setName("pause")
			  .setDescription("Pause the current track."),
	post: "GLOBAL",
	
	async execute(interaction) {
		if (
			!interaction.guild ||
			!(interaction.member instanceof GuildMember) ||
			!(interaction.channel instanceof TextChannel)
		) {
			return;
		}
		
		const player = client.manager.get(interaction.guild.id);
		if (!player) {
			return interaction.reply({ embeds: [getBaseErrorEmbed("There is no player for this guild.")] });
		}
		
		if (!interaction.member.voice.channel) {
			return interaction.reply({ embeds: [getBaseErrorEmbed("You need to join a voice channel.")] });
		}
		
		if (interaction.member.voice.channel.id !== player.voiceChannel) {
			return interaction.reply({ embeds: [getBaseErrorEmbed("You're not in the same voice channel.")] });
		}
		
		if (!player.queue.current || !player.queue.current.duration) {
			return interaction.reply({ embeds: [getBaseErrorEmbed("There is no music playing.")] });
		}
		
		if (!player.queue.current) return interaction.reply("there is no music playing.");
		
		player.pause(true);
		return interaction.reply({ embeds: [getBaseEmbed(interaction, "Paused", `${ player.queue.current.title } has been paused.`)] });
	},
};
