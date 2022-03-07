import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, TextChannel } from "discord.js";
import { client } from "../../nya";
import { generateQueue } from "../../utils/logic";

export = {
	data: new SlashCommandBuilder().setName("queue").setDescription("Display the queue."),
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

		if (!player.queue.current) return interaction.editReply("there is no music playing.");

		return interaction.editReply(generateQueue(player));
	},
};
