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