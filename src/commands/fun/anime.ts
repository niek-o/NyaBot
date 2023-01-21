import { ISlashCommand } from "@infinite-fansub/discord-client";
import { GuildMember, SlashCommandBuilder } from "discord.js";
import {
    capitalize,
    formatDescription,
    getBaseEmbed,
    getBaseErrorEmbed,
    getName,
    getRelationObject,
    getRelationQueries
} from "../../utils/logic";
import { Anilist } from "anilist";

const mediaQuery = Anilist.query.media({ type: "ANIME" })
    .withTitles("english", "romaji", "native")
    .withId();

const pageQuery = Anilist.query.page({ perPage: 10 })
    .withMedia(mediaQuery);

const animeQuery = Anilist.query.media({ type: "ANIME" })
    .withTitles("english", "romaji")
    .withDescription()
    .withCoverImage("extraLarge", "large", "medium")
    .withRelations({ nodes: ["id", "type"] })
    .withId()
    .withEpisodes()
    .withStatus()
    .withSiteUrl();

export default <ISlashCommand>{
    data: new SlashCommandBuilder()
        .setName("anime")
        .setDescription("Search an anime!")
        .addStringOption((option) => option.setName("query")
            .setDescription("search query")
            .setRequired(true)
            .setAutocomplete(true)),
    post: "GLOBAL",

    async autocomplete(interaction) {
        const searchQuery = interaction.options.getFocused();

        mediaQuery.arguments({ search: searchQuery });

        pageQuery.withMedia(mediaQuery);

        const data = await pageQuery.fetch();

        interaction.respond(data.media.map((anime) => ({
            name: getName(anime),
            value: getName(anime)
        })));
    },

    async execute(interaction) {
        if (
            !interaction.guild ||
            !(interaction.member instanceof GuildMember)
        ) {
            return;
        }

        await interaction.deferReply();

        const query = interaction.options.getString("query", true);

        animeQuery.arguments({ search: query });

        const anime = await animeQuery.fetch();

        if (!anime
        ) {
            return getBaseErrorEmbed("Anime not found");
        }

        const description = formatDescription(anime.description ?? "");

        const episodes = anime.episodes ? anime.episodes.toString() : "Unknown";

        const status = capitalize(anime.status ?? "")
            .replaceAll("_", " ");

        const embedFields = [
            {
                name: "Status",
                value: status
            },
            {
                name: "Episodes",
                value: episodes
            }
        ];

        if (anime.relations && anime.relations.nodes) {
            const relationsArray = await getRelationQueries(anime.relations.nodes);


            const relationsObject = getRelationObject(relationsArray);

            relationsObject.forEach(relation => {
                embedFields.push(relation);
            });
        }

        return interaction.editReply({
            embeds: [
                getBaseEmbed(interaction, anime.title?.english ?? anime.title?.romaji ?? "", description)
                    .setURL(anime.siteUrl)
                    .setImage(
                        anime.coverImage?.extraLarge ??
                        anime.coverImage?.large ??
                        anime.coverImage?.medium ??
                        "")
                    .addFields(embedFields)
            ]
        });
    }
};
