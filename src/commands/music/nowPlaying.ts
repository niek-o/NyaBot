import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, TextChannel } from "discord.js";
import { generateNowPlayingData } from "../../utils/logic";
import { client } from "../../nya";

export = {
	data: new SlashCommandBuilder().setName("nowplaying").setDescription("Get the song that is currently playing."),
	async execute(interaction: CommandInteraction) {
		if (
			!interaction.guild ||
			!(interaction.member instanceof GuildMember) ||
			!(interaction.channel instanceof TextChannel)
		)
			return;

		await interaction.deferReply();

		const player = client.manager.get(interaction.guild.id);
		if (!player) return interaction.reply("there is no player for this guild.");

		if (!interaction.member.voice.channel) return interaction.editReply("you need to join a voice channel.");
		if (interaction.member.voice.channel.id !== player.voiceChannel)
			return interaction.editReply("you're not in the same voice channel.");

		if (!player.queue.current || !player.queue.current.duration)
			return interaction.editReply("there is no music playing.");

		let thumbnail: string;
		if (!player.queue.current.displayThumbnail) thumbnail = "No thumbnail found";
		else
			thumbnail = player.queue.current.displayThumbnail("maxresdefault")
				? player.queue.current.displayThumbnail("maxresdefault")
				: (thumbnail = "No thumbnail found");

		return interaction.editReply(
			`${player.queue.current.title}\n${generateNowPlayingData(
				player.queue.current.duration,
				player.position
			)}\n${thumbnail}`
		);
	},
};
