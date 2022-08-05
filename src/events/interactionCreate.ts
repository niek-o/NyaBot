import { Event } from "@infinite-fansub/discord-client/dist";
import { TextChannel } from "discord.js";
import { logger } from "../utils/logger";

export default <Event<"interactionCreate">>{
	event: "interactionCreate",
	type: "on",
	async run(interaction) {
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
