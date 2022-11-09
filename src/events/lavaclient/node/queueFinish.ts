import { TextChannel } from "discord.js";
import nyaOptions from "../../../config";
import { client } from "../../../nya";
import { getBaseEmbed, timeout } from "../../../utils/logic";
import { Queue } from "@lavaclient/queue";

export default {
    name: "queueEnd",
    async execute(queue: Queue) {
        const channel = client.channels.cache.find((channel) => channel.id === queue.channel);

        if (channel instanceof TextChannel) {
            await channel.send({ embeds: [getBaseEmbed(channel, "Queue ended", "The queue has ended.")] });
        }

        logger.log(`${ client.guilds.cache.get(queue.player.guildId)?.name }: Queue has ended`);

        await timeout(nyaOptions.music.options.timeOut);

        if (nyaOptions.music.options.leaveOnQueueEnd && !queue.player.playing) {
            queue.player.disconnect();
            await queue.player.node.destroyPlayer(queue.player.guildId);
        }
    }
};
