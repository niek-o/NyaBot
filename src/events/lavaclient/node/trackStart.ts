import { TextChannel } from "discord.js";
import { client } from "../../../nya";
import { getBaseEmbed, getThumbnail } from "../../../utils/logic";
import { TrackInfo } from "@lavaclient/types/v3";
import { Queue } from "@lavaclient/queue";

export default {
    name: "trackStart",
    async execute(queue: Queue, track: TrackInfo) {
        const channel = client.channels.cache.find((channel) => channel.id === queue.channel);

        if (!(channel instanceof TextChannel)) {
            return;
        }

        await channel.send({
            embeds: [
                getBaseEmbed(channel, "Now playing", `${ track.author } - ${ track.title }`)
                    .setImage(await getThumbnail(track))
            ]
        });

        logger.log(`${ client.guilds.cache.get(queue.player.guildId)?.name }: Playing ${ track.title }`);
    }
};
