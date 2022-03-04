import { logger } from "../utils/logger";
import { Player, Track } from "erela.js";
import { client } from "../nya";
import { TextChannel } from "discord.js";

export = {
    name: "trackStart",
    async execute(player: Player, track: Track) {
        const channel = client.channels.cache.find(channel => channel.id === player.textChannel)

        if (channel instanceof TextChannel) {
            channel.send(`NOW PLAYING: ${track.title}`)
        }
        logger.log(`${client.guilds.cache.get(player.guild)?.name}: Playing ${track.title}`)
    }
}