import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction, GuildMember } from "discord.js"
import { Player, Queue, Track } from "erela.js";
import { NyaClient } from "../../nya";

export default {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Display the queue."),
    async execute(interaction: CommandInteraction) {
        if (!interaction.guild
            || !interaction.member
            || !(interaction.member instanceof GuildMember)
            || !interaction.guild
            || !interaction.guild.me
            || !interaction.member.voice.channelId
            || !interaction.channel)
            return;

        const client = interaction.client as NyaClient;

        const player = client.manager.get(interaction.guild.id);
        if (!player) return interaction.reply("there is no player for this guild.");

        if (!player.queue.current) return interaction.reply("there is no music playing.");

        function generateQueue(player: Player) {
            if (!player.queue.current || player.queue.length === 0) return "There are no songs in the queue."

            const queueArray: string[] = [];

            queueArray.push(`NOW PLAYING: ${player.queue.current.title} \n ----------------------------- \n`)

            for (const track of player.queue) {
                queueArray.push(`${player.queue.indexOf(track) + 1}: ${track.author} - ${track.title} \n`)
                if (queueArray.length >= 10) {
                    queueArray.push(`${player.queue.length - 10} other tracks.`)
                    break
                }
            };

            return `\`\`\`yml\n${(queueArray.toString()).replace(/,/g, "")}\n\`\`\``
        }

        return interaction.reply(generateQueue(player));
    }
}