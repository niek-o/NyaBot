import { GuildMember, TextChannel, SlashCommandBuilder } from "discord.js";
import { generateNowPlayingData, getBaseEmbed, getBaseErrorEmbed, getThumbnail } from "../../utils/logic";
import { client } from "../../nya";
import { Track } from "erela.js";
import { ISlashCommand } from "@infinite-fansub/discord-client";

export default <ISlashCommand>{
	data: new SlashCommandBuilder()
		.setName("nowplaying")
		.setDescription("Get the song that is currently playing."),
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

		const player = client.erela.manager.get(interaction.guild.id);
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

		return interaction.editReply({
			embeds: [
				getBaseEmbed(interaction, "Now playing")
					.addFields(
						{
							name: "Author",
							value: player.queue.current.author
								? player.queue.current.author
								: "",
							inline: true
						},
						{ name: "Track", value: player.queue.current.title, inline: true },
						{
							name: "Progress", value: generateNowPlayingData(
								player.queue.current.duration,
								player.position
							)
						}
					)
					.setImage(await getThumbnail(player.queue.current as Track))
			]
		});
	},
};
