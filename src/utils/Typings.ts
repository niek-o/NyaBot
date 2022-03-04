import { Awaitable, CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders"
import { Color } from "colours.js/dst";

export interface ICommand {
    data: Omit<SlashCommandBuilder, "addSubCommand" | "addSubCommandGroup">;
    description?: string;
    execute: SlashCommandExecute;
}

export type SlashCommandExecute = (interaction: CommandInteraction) => Awaitable<void>

export type DefaultColors = {
    color: Color;
    errorColor: Color;
}

export interface INyaOptions {
    // Discord data
    discord: {
        token: string;  // Discord bot token
        clientId: string; // Discord bot's client id
        guildId: string; // The bot's testing server
    },
    // Music data
    music: {
        // Lavalink data
        lavalink: {
            host: string; // Lavalink host
            port: number; // Lavalink port
            password: string; // Lavalink password
        },
        // Spotify app data
        spotify: {
            id: string; // Spotify app id
            secret: string; // Spotify app secret
        }
    }
}