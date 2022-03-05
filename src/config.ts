import { INyaOptions } from "./utils/Typings";

export default {
    // Discord data
    discord: {
        token: "", // Discord bot token
        clientId: "", // Discord bot's client id
        guildId: "", // The bot's testing server
    },
    // Music data
    music: {
        // Music options
        options: {
            leaveOnQueueEnd: true, // Leave the voice channel when the queue ends
            timeOut: 0, // Leave timeout in ms
            volume: 100, // The player's volume
            deafenOnJoin: true, // Deafen the bot on join
            progressBar: {
                // The progress bar options
                fullBeginningEmote: "", // The full first emote
                fullMidEmote: "", // The full middle emote
                emptyMidEmote: "", // The empty middle emote
                emptyEndingEmote: "", // The empty last emote
                beginningPointerEmote: "", // The first pointer emote
                pointerEmote: "", // The middle pointer emote
                endingPointerEmote: "", // The last pointer emote
                width: 10, // Progress bar width
            },
        // Lavalink data
        lavalink: {
            host: "0.0.0.0", // Lavalink host
            port: 2333, // Lavalink port
            password: "youshallnotpass", // Lavalink password
        },
        // Spotify data
        spotify: {
            id: "", // Spotify app id
            secret: "", // Spotify app secret
        },
    },
} as INyaOptions;
