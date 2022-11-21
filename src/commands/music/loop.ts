import { ISlashCommand } from "@infinite-fansub/discord-client";
import { GuildMember, SlashCommandBuilder, TextChannel } from "discord.js";
import { getBaseEmbed, getBaseErrorEmbed } from "../../utils/logic";
import { GuildPlayer } from "../../utils/lib/player";
import { LoopType } from "@lavaclient/queue";

export default <ISlashCommand>{
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Loop music!")
        .addSubcommand(subcommand =>
            subcommand
                .setName("queue")
                .setDescription("Loop the current queue."))
        .addSubcommand(subcommand =>
            subcommand
                .setName("song")
                .setDescription("Loop the current song."))
        .addSubcommand(subcommand =>
            subcommand
                .setName("stop")
                .setDescription("Stop the loop.")),
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

        if (interaction.options.getSubcommand() === "queue") {
            await player.queue.setLoop(LoopType.Queue);
            return interaction.reply({ embeds: [getBaseEmbed(interaction, "Loop", "The current queue is being looped.")] });
        }

        if (interaction.options.getSubcommand() === "song") {
            await player.queue.setLoop(LoopType.Song);
            return interaction.reply({ embeds: [getBaseEmbed(interaction, "Loop", `${ player.queue.current.title } is being looped.`)] });
        }

        if (interaction.options.getSubcommand() === "stop") {
            await player.queue.setLoop(LoopType.None);
            return interaction.reply({ embeds: [getBaseEmbed(interaction, "Loop", "Loop has been ended")] });
        }
    }
};
