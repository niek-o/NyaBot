import { logger } from "../utils/logger";
import { Player, Track } from "erela.js";
import { client } from "../nya";
import { TextChannel } from "discord.js";

export = {
    name: "queueEnd",
    async execute(player: Player) {
        const channel = client.channels.cache.find(channel => channel.id === player.textChannel)

        if (channel instanceof TextChannel) {
            channel.send("The queue has ended")
        }
        logger.log(`${client.guilds.cache.get(player.guild)?.name}: Queue has ended`)
        player.destroy();
    }
}