import { CommandInteraction, TextChannel } from "discord.js";
import { logger } from "../utils/logger";

export = {
	name: "interactionCreate",
	async execute(interaction: CommandInteraction) {
		if (
			!interaction.isCommand ||
			!interaction.channel ||
			!interaction.guild ||
			!(interaction.channel instanceof TextChannel)
		)
			return;

		logger.log(
			`${interaction.guild.name}: ${interaction.user.tag} in ${interaction.channel.name} triggered ${interaction}`
		);
	},
};
