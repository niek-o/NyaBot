import { ISlashCommand }                                 from "@infinite-fansub/discord-client";
import { SlashCommandBuilder, GuildMember, TextChannel } from "discord.js";
import { client }                                        from "../../nya";

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
		if (!player) return interaction.editReply("there is no player for this guild.");
		
		if (!interaction.member.voice.channel) return interaction.editReply("you need to join a voice channel.");
		if (interaction.member.voice.channel.id !== player.voiceChannel) {
			return interaction.editReply("you're not in the same voice channel.");
		}
		
		if (!player.queue.current) return interaction.editReply("there is no music playing.");
		
		player.queue.shuffle();
		return interaction.editReply("The queue has been shuffled.");
	},
};
