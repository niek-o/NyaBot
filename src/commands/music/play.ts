import { ISlashCommand }                                 from "@infinite-fansub/discord-client";
import { GuildMember, TextChannel, SlashCommandBuilder } from "discord.js";
import { SearchResult }                                  from "erela.js";
import nyaOptions                                        from "../../config";
import { client }                                        from "../../nya";
import { getBaseEmbed, getBaseErrorEmbed, getThumbnail } from "../../utils/logic";

export default <ISlashCommand>{
	data: new SlashCommandBuilder()
			  .setName("play")
			  .setDescription("Play a song.")
			  .addStringOption((option) => option.setName("query")
												 .setDescription("search query")
												 .setRequired(true)),
	post: "GLOBAL",
	
	async execute(interaction) {
		if (
			!interaction.guild ||
			!(interaction.member instanceof GuildMember) ||
			!(interaction.channel instanceof TextChannel)
		) {
			return;
		}
		
		await interaction.deferReply();
		
		if (!interaction.member.voice.channel) {
			return interaction.editReply({ embeds: [getBaseErrorEmbed("You need to join a voice channel.")] });
		}
		
		// Create a new player. This will return the player if it already exists.
		const player = client.manager.create({
			guild:        interaction.guild.id,
			voiceChannel: interaction.member.voice.channel.id,
			textChannel:  interaction.channel.id,
			volume:       nyaOptions.music.options.volume,
			selfDeafen:   nyaOptions.music.options.deafenOnJoin,
		});
		
		if (interaction.member.voice.channel.id !== player.voiceChannel) {
			return interaction.editReply({ embeds: [getBaseErrorEmbed("You're not in the same voice channel.")] });
		}
		
		if (!player) {
			return interaction.editReply({ embeds: [getBaseErrorEmbed("There is no player for this guild.")] });
		}
		
		if (player.state !== "CONNECTED") player.connect();
		
		const query = interaction.options.getString("query", true);
		
		const req = async (i: string) =>
			await client.manager.search(i, interaction.user)
						.catch((error) => {
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
				return interaction.editReply({ embeds: [getBaseErrorEmbed("There were no results found")] });
			case "TRACK_LOADED":
			case "SEARCH_RESULT":
				player.queue.add(res.tracks[0]);
				
				if (!player.playing && !player.queue.size && !player.paused) await player.play();
				return interaction.editReply({
					embeds: [
						getBaseEmbed(interaction, "Enqueuing", `${ res.tracks[0].author } - ${ res.tracks[0].title }`)
							.setThumbnail(await getThumbnail(res.tracks[0]))
					]
				});
			case "PLAYLIST_LOADED":
				player.queue.add(res.tracks);
				
				if (!player.playing && player.queue.totalSize === res.tracks.length && !player.paused) await player.play();
				return interaction.editReply({
					embeds: [
						getBaseEmbed(interaction, "Enqueuing", `Enqueuing ${ res.playlist?.name } with ${ res.tracks.length } tracks.`)
							.setThumbnail(await getThumbnail(res.tracks[0]))
					]
				});
		}
	},
};
