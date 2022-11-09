import { ISlashCommand } from "@infinite-fansub/discord-client";
import { GuildMember, SlashCommandBuilder, TextChannel } from "discord.js";
import { getBaseEmbed, getBaseErrorEmbed } from "../../utils/logic";
import { GuildPlayer } from "../../utils/lib/player";

export default <ISlashCommand>{
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffle the queue."),
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

        if (!interaction.member.voice.channel) {
            return interaction.reply({ embeds: [getBaseErrorEmbed("You need to join a voice channel.")] });
        }

        if (interaction.member.voice.channel.id !== player.channelId) {
            return interaction.editReply({ embeds: [getBaseErrorEmbed("You're not in the same voice channel.")] });
        }

        if (!player.queue.current || !player.queue.current.length) {
            return interaction.editReply({ embeds: [getBaseErrorEmbed("There is no music playing.")] });
        }

        await player.queue.shuffle();
        return interaction.editReply({ embeds: [getBaseEmbed(interaction, "Shuffle", "The queue has been shuffled.")] });
    }
};
