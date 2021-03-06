import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, TextChannel } from "discord.js";
import { client } from "../../nya";

export = {
	data: new SlashCommandBuilder().setName("stop").setDescription("Stop the player."),
	async execute(interaction: CommandInteraction) {
		if (
			!interaction.guild ||
			!(interaction.member instanceof GuildMember) ||
			!(interaction.channel instanceof TextChannel)
		)
			return;

		const player = client.manager.get(interaction.guild.id);
		if (!player) return interaction.reply("there is no player for this guild.");

		if (!interaction.member.voice.channel) return interaction.reply("you need to join a voice channel.");
		if (interaction.member.voice.channel.id !== player.voiceChannel)
			return interaction.reply("you're not in the same voice channel.");

		if (!player.queue.current) return interaction.reply("there is no music playing.");

		player.destroy();
		return interaction.reply("The player has been destroyed.");
	},
};
