import { client } from "../../nya";
import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { Player } from "lavaclient";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { Addable } from "@lavaclient/queue";
import { getBaseEmbed, getBaseErrorEmbed, getThumbnail } from "../logic";
import nyaOptions from "../../config";

export class GuildPlayer {
    public player: Player;
    private playerEventFiles: string[] = readdirSync(join(__dirname, "../../events/lavaclient/player"))
        .filter((f) => f.endsWith(".ts") || f.endsWith(".js"));

    constructor(interaction: ChatInputCommandInteraction) {
        if (!interaction ||
            !interaction.channel ||
            !interaction.guild ||
            !(interaction.member instanceof GuildMember)
        ) {
            throw Error("No interaction found to create new player for");
        }

        this.player = client.manager.players.get(interaction.guild.id) as Player;

        if (!this.player?.connected) {
            this.player ??= client.manager.createPlayer(interaction.guild.id);
            this.player.queue.channel = interaction.channel.id;
            this.player.connect(interaction.member.voice.channel, { deafened: true });
        }

        this.player.setVolume(nyaOptions.music.options.volume)

        this.playerEventFiles.forEach(async (f) => {
            const event = (await import(`../../events/lavaclient/player/${ f }`)).default;
            this.player.on(event.name, (...args: any) => event.execute(...args));
        });

        this.player.on("channelMove", (from, to) => {
            logger.log("Player moved");
            this.player.channelId = to;
        });
    }

    async play(interaction: ChatInputCommandInteraction, query: string) {
        let tracks: Addable[] = [];

        const res = await client.manager.rest.loadTracks(/^https?:\/\//.test(query)
            ? query
            : `ytsearch:${ query }`);

        switch (res.loadType) {
            case "LOAD_FAILED":
            case "NO_MATCHES":
                if (!this.player.queue.current) {
                    await this.player.destroy();
                }
                return interaction.editReply({ embeds: [getBaseErrorEmbed("There were no results found")] });
            case "TRACK_LOADED":
            case "SEARCH_RESULT":
                const [track] = res.tracks;
                tracks = [track];
                this.player.queue.add(tracks, { requester: interaction.user.id });

                if (!this.player.playing && !this.player.paused) {
                    await this.player.queue.start();
                }
                return interaction.editReply({
                    embeds: [
                        getBaseEmbed(interaction, "Enqueuing", `${ track.info.author } - ${ track.info.title }`)
                            .setThumbnail(await getThumbnail(track.info))
                    ]
                });
            case "PLAYLIST_LOADED":
                tracks = res.tracks;

                this.player.queue.add(tracks, { requester: interaction.user.id });

                if (!this.player.playing && !this.player.paused) {
                    await this.player.queue.start();
                }
                return interaction.editReply({
                    embeds: [
                        getBaseEmbed(interaction, "Enqueuing", `Enqueuing ${ res.playlistInfo.name } with ${ tracks.length } tracks.`)
                            .setThumbnail(await getThumbnail(res.tracks[0].info))
                    ]
                });
        }
    }
}
