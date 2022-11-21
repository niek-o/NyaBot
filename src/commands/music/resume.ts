import { ISlashCommand } from "@infinite-fansub/discord-client";
import { GuildMember, SlashCommandBuilder, TextChannel } from "discord.js";
import { getBaseEmbed, getBaseErrorEmbed } from "../../utils/logic";
import { GuildPlayer } from "../../utils/lib/player";

export default <ISlashCommand>{
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume the current track."),
    post: "GLOBAL",

    async execute(interaction) {
        if (
            !interaction.guild ||
            !(interaction.member instanceof GuildMember) ||
            !(interaction.channel instanceof TextChannel)
        ) {
            return;
        }

        const guildPlayer = new GuildPlayer(interaction);
        const player = guildPlayer.player;

        if (!player) {
            return interaction.reply({ embeds: [getBaseErrorEmbed("There is no player for this guild.")] });
        }

        if (!interaction.member.voice.channel) {
            return interaction.reply({ embeds: [getBaseErrorEmbed("You need to join a voice channel.")] });
        }

        if (interaction.member.voice.channel.id !== player.channelId) {
            return interaction.reply({ embeds: [getBaseErrorEmbed("You're not in the same voice channel.")] });
        }

        if (!player.queue.current || !player.queue.current.length) {
            return interaction.reply({ embeds: [getBaseErrorEmbed("There is no music playing.")] });
        }

        await player.pause(false);
        return interaction.reply({ embeds: [getBaseEmbed(interaction, "Resumed", `${ player.queue.current.title } has been resumed.`)] });
    }
};
