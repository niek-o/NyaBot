import { SlashCommandBuilder } from "@discordjs/builders";
import { Awaitable, CommandInteraction } from "discord.js";
import { Color } from "colours.js";

export interface ICommand {
	data: Omit<SlashCommandBuilder, "addSubCommand" | "addSubCommandGroup">;
	description?: string;
	execute: SlashCommandExecute;
}

export type SlashCommandExecute = (interaction: CommandInteraction) => Awaitable<void>

/**
 * The color type for the logger
 * @property {Color} color - The default logging color
 * @property {Color} errorColor - The error logging color
 *
 * @author Niek
 */
export type DefaultColors = {
	color: Color;
	errorColor: Color
}