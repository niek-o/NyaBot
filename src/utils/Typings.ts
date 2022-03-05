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
        // Music options
        options: {
            leaveOnQueueEnd: boolean; // Leave the voice channel when the queue ends
            timeOut: number; // Leave timeout in ms
            volume: number; // The player's volume
            deafenOnJoin: boolean; // Deafen the bot on join
            progressBar: {
                // The progress bar options
                fullBeginningEmote: string; // The full first emote
                fullMidEmote: string; // The full middle emote
                emptyMidEmote: string; // The empty middle emote
                emptyEndingEmote: string; // The empty last emote
                beginningPointerEmote: string; // The first pointer emote
                pointerEmote: string; // The middle pointer emote
                endingPointerEmote: string; // The last pointer emote
                width: number; // Progress bar width
            }
        }
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