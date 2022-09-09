import { ISlashCommand }                                       from "@infinite-fansub/discord-client";
import { AttachmentBuilder, GuildMember, SlashCommandBuilder } from "discord.js";
import { getBaseEmbed }                                        from "../../utils/logic";
import nyaOptions                                              from "../../config";

export default <ISlashCommand>{
	data: new SlashCommandBuilder()
			  .setName("cat")
			  .setDescription("Get an image of a cat."),
	post: "GLOBAL",
	
	async execute(interaction) {
		if (
			!interaction.guild ||
			!(interaction.member instanceof GuildMember)
		) {
			return;
		}
		
		await interaction.deferReply()
		
		const apiUrl = `http://${nyaOptions.imageAPI.host}:${nyaOptions.imageAPI.port}`;
		
		const img = await fetch(apiUrl + "/cat");
		
		const attachment = new AttachmentBuilder(Buffer.from(await img.json(), "base64"), { name: "cat.png" });
		
		await interaction.editReply({
			embeds: [
				getBaseEmbed(
					interaction,
					"Cat",
				)
					.setImage(`attachment://${ attachment.name }`)
			],
			files:  [
				attachment
			]
		});
	},
};


