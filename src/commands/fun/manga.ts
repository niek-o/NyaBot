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

const mediaQuery = Anilist.query.media({ type: "MANGA" })
    .withTitles("english", "romaji", "native")
    .withId();

const pageQuery = Anilist.query.page({ perPage: 10 })
    .withMedia(mediaQuery);

const mangaQuery = Anilist.query.media({ type: "MANGA" })
    .withTitles("english", "romaji")
    .withDescription()
    .withCoverImage("extraLarge", "large", "medium")
    .withRelations({ nodes: ["id", "type"] })
    .withId()
    .withChapters()
    .withStatus();

export default <ISlashCommand>{
    data: new SlashCommandBuilder()
        .setName("manga")
        .setDescription("Search a manga!")
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

        mangaQuery.arguments({ search: query });

        const manga = await mangaQuery.fetch();

        if (!manga
        ) {
            return getBaseErrorEmbed("Anime not found");
        }

        const description = formatDescription(manga.description ?? "");

        const chapters = manga.chapters ? manga.chapters.toString() : "Unknown";

        const status = capitalize(manga.status ?? "")
            .replaceAll("_", " ");

        const embedFields = [
            {
                name: "Status",
                value: status
            },
            {
                name: "Chapters",
                value: chapters
            }
        ];

        if (manga.relations && manga.relations.nodes) {
            const relationsArray = await getRelationQueries(manga.relations.nodes);


            const relationsObject = getRelationObject(relationsArray);

            relationsObject.forEach(relation => {
                embedFields.push(relation);
            });
        }

        return interaction.editReply({
            embeds: [
                getBaseEmbed(interaction, manga.title?.english ?? manga.title?.romaji ?? "", description)
                    .setImage(
                        manga.coverImage?.extraLarge ??
                        manga.coverImage?.large ??
                        manga.coverImage?.medium ??
                        "")
                    .addFields(embedFields)
            ]
        });
    }
};

