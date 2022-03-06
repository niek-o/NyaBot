import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { NyaClient } from "../../nya";
import { generateQueue } from "../../utils/logic";

export = {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Display the queue."),
	async execute(interaction: CommandInteraction) {
		if (!interaction.guild
			|| !interaction.member
			|| !(interaction.member instanceof GuildMember)
			|| !interaction.guild
			|| !interaction.guild.me
			|| !interaction.member.voice.channelId
			|| !interaction.channel)
			return;

		await interaction.deferReply();

		const client = interaction.client as NyaClient;

		const player = client.manager.get(interaction.guild.id);
		if (!player) return interaction.reply("there is no player for this guild.");

		if (!player.queue.current) return interaction.editReply("there is no music playing.");

		return interaction.editReply(generateQueue(player));
	}
};