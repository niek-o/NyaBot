import { GuildMember, SlashCommandBuilder, TextChannel } from "discord.js";
import { generateNowPlayingData, getBaseEmbed, getBaseErrorEmbed, getThumbnail } from "../../utils/logic";
import { ISlashCommand } from "@infinite-fansub/discord-client";
import { GuildPlayer } from "../../utils/lib/player";

export default <ISlashCommand>{
    data: new SlashCommandBuilder().setName("nowplaying")
        .setDescription("Get the song that is currently playing."),
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
            return interaction.editReply({ embeds: [getBaseErrorEmbed("There is no player for this guild.")] });
        }

        if (!interaction.member.voice.channel) {
            return interaction.editReply({ embeds: [getBaseErrorEmbed("You need to join a voice channel.")] });
        }

        if (interaction.member.voice.channel.id !== player.channelId) {
            return interaction.editReply({ embeds: [getBaseErrorEmbed("You're not in the same voice channel.")] });
        }

        if (!player.queue.current || !player.queue.current.length) {
            return interaction.editReply({ embeds: [getBaseErrorEmbed("There is no music playing.")] });
        }

        return interaction.editReply({
            embeds: [
                getBaseEmbed(interaction, "Now playing")
                    .addFields(
                        {
                            name: "Author",
                            value: player.queue.current.author
                                ? player.queue.current.author
                                : "",
                            inline: true
                        },
                        { name: "Track", value: player.queue.current.title, inline: true },
                        {
                            name: "Progress", value: generateNowPlayingData(
                                player.queue.current.length,
                                player.accuratePosition ?? 0
                            )
                        }
                    )
                    .setImage(await getThumbnail(player.queue.current))
            ]
        });
    }
};
