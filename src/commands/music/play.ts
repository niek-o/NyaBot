import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, TextChannel } from "discord.js";
import { SearchResult } from "erela.js";
import nyaOptions from "../../config";
import { client } from "../../nya";
import { logger } from "../../utils/logger";

export = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play a song.")
		.addStringOption((option) => option.setName("query").setDescription("search query").setRequired(true)),
	async execute(interaction: CommandInteraction) {
		if (
			!interaction.guild ||
			!(interaction.member instanceof GuildMember) ||
			!(interaction.channel instanceof TextChannel)
		)
			return;

		await interaction.deferReply();

		if (!interaction.member.voice.channel) return interaction.editReply("you need to join a voice channel.");

		// Create a new player. This will return the player if it already exists.
		const player = client.manager.create({
			guild: interaction.guild.id,
			voiceChannel: interaction.member.voice.channel.id,
			textChannel: interaction.channel.id,
			volume: nyaOptions.music.options.volume,
			selfDeafen: nyaOptions.music.options.deafenOnJoin,
		});

		if (interaction.member.voice.channel.id !== player.voiceChannel)
			return interaction.editReply("you're not in the same voice channel.");

		if (!player) return interaction.editReply("there is no player for this guild.");

		if (player.state !== "CONNECTED") player.connect();

		let query: string = interaction.options.getString("query", true);

		const req = async (i: string) =>
			await client.manager.search(i, interaction.user).catch((error) => {
				logger.error(error);
			});

		const res = (await req(query)) as SearchResult;

		if (res.loadType === "LOAD_FAILED") {
			if (!player.queue.current) player.destroy();
			throw res.exception;
		}

		switch (res.loadType) {
			case "NO_MATCHES":
				if (!player.queue.current) player.destroy();
				return interaction.editReply("There were no results found");
			case "TRACK_LOADED":
			case "SEARCH_RESULT":
				player.queue.add(res.tracks[0]);

				if (!player.playing && !player.queue.size && !player.paused) await player.play();
				return interaction.editReply(`Enqueuing ${res.tracks[0].title}`);
			case "PLAYLIST_LOADED":
				player.queue.add(res.tracks);

				if (!player.playing && player.queue.totalSize === res.tracks.length && !player.paused) await player.play();
				return interaction.editReply(`Enqueuing ${res.playlist?.name} with ${res.tracks.length} tracks.`);
		}
	},
};
