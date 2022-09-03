import { ISlashCommand }                   from "@infinite-fansub/discord-client";
import { SlashCommandBuilder }             from "discord.js";
import { getBaseEmbed, getBaseErrorEmbed } from "../../utils/logic";
import { MineSweeperGame }                 from "../../utils/minesweeper";

export default <ISlashCommand>{
	data: new SlashCommandBuilder()
			  .setName("minesweeper")
			  .setDescription("Play a minesweeper game!")
			  .addIntegerOption((option) => option.setName("width")
												  .setDescription("Width of the minefield. (max 99 tiles)")
												  .setRequired(true))
			  .addIntegerOption((option) => option.setName("height")
												  .setDescription("Height of the minefield. (max 99 tiles)")
												  .setRequired(true))
			  .addIntegerOption((option) => option.setName("bombs")
												  .setDescription("Amount of bombs in the minefield. (cannot be more than the amount of tiles)")
												  .setRequired(true)),
	post: "GLOBAL",
	
	async execute(interaction) {
		const width  = interaction.options.getInteger("width", true);
		const height = interaction.options.getInteger("height", true);
		const bombs  = interaction.options.getInteger("bombs", true);
		
		if (width * height > 99) {
			return interaction.reply({ embeds: [getBaseErrorEmbed(`Amount of tiles too high (${ width * height }). Max 99`)] });
		}
		
		if (bombs >= width * height) {
			return interaction.reply({ embeds: [getBaseErrorEmbed("Mines cannot be equal or more than the amount of tiles")] });
		}
		
		const game = new MineSweeperGame(width, height, bombs);
		
		await interaction.reply({ embeds: [getBaseEmbed(interaction, "MineSweeper", game.generateMessage())] });
	},
};
