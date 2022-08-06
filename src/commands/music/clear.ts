import { ISlashCommand }                                 from "@infinite-fansub/discord-client";
import { GuildMember, TextChannel, SlashCommandBuilder } from "discord.js";
import { client }                                        from "../../nya";

export default <ISlashCommand>{
	data: new SlashCommandBuilder()
			  .setName("clear")
			  .setDescription("Clear the queue."),
	async execute(interaction) {
		if (
			!interaction.guild ||
			!(interaction.member instanceof GuildMember) ||
			!(interaction.channel instanceof TextChannel)
		) {
			return;
		}
		
		const player = client.manager.get(interaction.guild.id);
		if (!player) return interaction.reply("there is no player for this guild.");
		
		if (!interaction.member.voice.channel) return interaction.reply("you need to join a voice channel.");
		if (interaction.member.voice.channel.id !== player.voiceChannel) {
			return interaction.reply("you're not in the same voice channel.");
		}
		
		if (!player.queue.current) return interaction.reply("there is no music playing.");
		
		player.queue.clear();
		return interaction.reply("The queue has been cleared.");
	},
};
