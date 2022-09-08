import { ISlashCommand }                                       from "@infinite-fansub/discord-client";
import { AttachmentBuilder, GuildMember, SlashCommandBuilder } from "discord.js";
import { getBaseEmbed }                     from "../../utils/logic";
import nyaOptions                                              from "../../config";

export default <ISlashCommand>{
	data: new SlashCommandBuilder()
			  .setName("dog")
			  .setDescription("Get an image of a dog."),
	post: "GLOBAL",
	
	async execute(interaction) {
		if (
			!interaction.guild ||
			!(interaction.member instanceof GuildMember)
		) {
			return;
		}
		
		const BASE_IP = nyaOptions.imageAPI.host + ":" + nyaOptions.imageAPI.port;
		
		const img = await fetch(BASE_IP + "/dog");
		
		const attachment = new AttachmentBuilder(Buffer.from(await img.json(), "base64"), { name: "dog.png" });
		
		await interaction.reply({
			embeds: [
				getBaseEmbed(
					interaction,
					"Dog",
				)
					.setImage(`attachment://${ attachment.name }`)
			],
			files:  [
				attachment
			]
		});
	},
};


