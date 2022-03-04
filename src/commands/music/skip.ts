import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction, GuildMember } from "discord.js"
import { NyaClient } from "../../nya";

export default {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip the current song."),
    async execute(interaction: CommandInteraction) {
        if (!interaction.guild
            || !interaction.member
            || !(interaction.member instanceof GuildMember)
            || !interaction.guild
            || !interaction.guild.me
            || !interaction.member.voice.channelId
            || !interaction.channel)
            return;

        const client = interaction.client as NyaClient

        const player = client.manager.get(interaction.guild.id);
        if (!player) return interaction.reply("there is no player for this guild.");

        if (!interaction.member.voice.channel) return interaction.reply("you need to join a voice channel.");
        if (interaction.member.voice.channel.id !== player.voiceChannel) return interaction.reply("you're not in the same voice channel.");

        if (!player.queue.current) return interaction.reply("there is no music playing.")

        player.stop()
        return interaction.reply(`${player.queue.current.title} has been skipped.`)
    }
}