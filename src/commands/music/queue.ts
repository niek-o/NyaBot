import { ISlashCommand } from "@infinite-fansub/discord-client";
import { GuildMember, SlashCommandBuilder, TextChannel } from "discord.js";
import { generateQueue, getBaseEmbed, getBaseErrorEmbed, getThumbnail } from "../../utils/logic";
import { GuildPlayer } from "../../utils/lib/player";

export default <ISlashCommand>{
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Display the queue."),
    post: "GLOBAL",

    async execute(interaction) {
        if (
            !interaction.guild ||
            !(interaction.member instanceof GuildMember) ||
            !(interaction.channel instanceof TextChannel)
        ) {
            return;
        }

        await interaction.deferReply();

        const guildPlayer = new GuildPlayer(interaction);
        const player = guildPlayer.player;

        if (!player) {
            return interaction.reply({ embeds: [getBaseErrorEmbed("There is no player for this guild.")] });
        }

        if (!player.queue.current || !player.queue.current.length) {
            return interaction.editReply({ embeds: [getBaseErrorEmbed("There is no music playing.")] });
        }

        return interaction.editReply({
            embeds: [
                getBaseEmbed(interaction, "Queue")
                    .addFields(
                        {
                            name: "Now playing",
                            value: `${ player.queue.current.author } - ${ player.queue.current.title }`
                        },
                        { name: "Queue", value: generateQueue(player) }
                    )
                    .setImage(await getThumbnail(player.queue.current))
            ]
        });
    }
};
