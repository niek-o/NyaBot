import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction, GuildMember } from "discord.js"
import { SearchResult, } from "erela.js";
import { logger } from "../../utils/logger";
import { NyaClient } from "../../nya";
import nyaOptions from "../../config";

export default {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song.")
        .addStringOption((option) =>
            option.setName('query').setDescription("search query")
                .setRequired(true)),
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

        // Create a new player. This will return the player if it already exists.
        const player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channelId,
            textChannel: interaction.channel.id,
            volume: nyaOptions.music.options.volume,
            selfDeafen: nyaOptions.music.options.deafenOnJoin
        });

        if (!player) return interaction.reply("there is no player for this guild.");

        if (!interaction.member.voice.channel) return interaction.reply("you need to join a voice channel.");
        if (interaction.member.voice.channel.id !== player.voiceChannel) return interaction.reply("you're not in the same voice channel.");

        if (player.state !== "CONNECTED") player.connect();

        let query: string = interaction.options.getString('query', true);

        const req = async (i: string) => await (client.manager.search(i, interaction.user)
            .catch(error => {
                logger.error(error);
            }));

        const res = await req(query) as SearchResult;

        if (res.loadType === "LOAD_FAILED") {
            if (!player.queue.current) player.destroy();
            throw res.exception;
        }

        switch (res.loadType) {
            case "NO_MATCHES":
                if (!player.queue.current) player.destroy();
                return interaction.reply("There were no results found");
            case "TRACK_LOADED":
            case "SEARCH_RESULT":
                player.queue.add(res.tracks[0]);

                if (!player.playing && !player.queue.size) player.play();
                return interaction.reply(`Enqueing ${res.tracks[0].title}`);
            case "PLAYLIST_LOADED":
                player.queue.add(res.tracks);

                if (!player.playing && player.queue.totalSize === res.tracks.length) player.play()
                return interaction.reply(`Enqueing ${res.playlist?.name} with ${res.tracks.length} tracks.`);
        }
    }
}