import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction, GuildMember } from "discord.js"
import { NyaClient } from "../../nya";

export default {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffle the queue."),
    async execute(interaction: CommandInteraction) {
        if (!interaction.guild
            || !interaction.member
            || !(interaction.member instanceof GuildMember)
            || !interaction.guild
            || !interaction.guild.me
            || !interaction.member.voice.channelId
            || !interaction.channel)
            return;

        await interaction.deferReply()

        const client = interaction.client as NyaClient

        const player = client.manager.get(interaction.guild.id);
        if (!player) return interaction.editReply("there is no player for this guild.");

        if (!interaction.member.voice.channel) return interaction.editReply("you need to join a voice channel.");
        if (interaction.member.voice.channel.id !== player.voiceChannel) return interaction.editReply("you're not in the same voice channel.");

        if (!player.queue.current) return interaction.editReply("there is no music playing.")

        player.queue.shuffle();
        return interaction.editReply("The queue has been shuffled.")
    }
}