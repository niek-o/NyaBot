import { ISlashCommand } from "@infinite-fansub/discord-client";
import { SlashCommandBuilder, GuildMember, TextChannel } from "discord.js";
import { client } from "../../nya";
import { generateQueue, getBaseEmbed, getBaseErrorEmbed, getThumbnail } from "../../utils/logic";
import { Track } from "erela.js";

export default <ISlashCommand>{
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Display the queue."),
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

		if (!player.queue.current || !player.queue.current.duration) {
			return interaction.editReply({ embeds: [getBaseErrorEmbed("There is no music playing.")] });
		}

		return interaction.editReply({
			embeds: [
				getBaseEmbed(interaction, "Queue")
					.addFields(
						{ name: "Now playing", value: `${player.queue.current.author} - ${player.queue.current.title}` },
						{ name: "Queue", value: generateQueue(player) }
					)
					.setImage(await getThumbnail(player.queue.current as Track))
			]
		});
	},
};
