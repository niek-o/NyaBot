import { TextChannel }                from "discord.js";
import { Player, Track }              from "erela.js";
import { client }                     from "../nya";
import { getBaseEmbed, getThumbnail } from "../utils/logic";

export = {
	name: "trackStart",
	async execute(player: Player, track: Track) {
		const channel = client.channels.cache.find((channel) => channel.id === player.textChannel);
		
		if (channel instanceof TextChannel) {
			const embed = getBaseEmbed(channel, "Now playing", `${ track.author } - ${ track.title }`)
				.setImage(await getThumbnail(track));
			
			await channel.send({ embeds: [embed] });
		}
		logger.log(`${ client.guilds.cache.get(player.guild)?.name }: Playing ${ track.title }`);
	},
};
