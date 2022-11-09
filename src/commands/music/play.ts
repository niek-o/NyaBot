import { ISlashCommand } from "@infinite-fansub/discord-client";
import { GuildMember, SlashCommandBuilder, TextChannel } from "discord.js";
import { getBaseErrorEmbed } from "../../utils/logic";
import { GuildPlayer } from "../../utils/lib/player";

export default <ISlashCommand>{
    data: new SlashCommandBuilder().setName("play")
        .setDescription("Play a song.")
        .addStringOption((option) => option.setName("query")
            .setDescription("search query")
            .setRequired(true)),
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

        if (!interaction.member.voice.channel) {
            return interaction.editReply({ embeds: [getBaseErrorEmbed("You need to join a voice channel.")] });
        }

        const guildPlayer = new GuildPlayer(interaction);

        const query = interaction.options.getString("query", true);

        await guildPlayer.play(interaction, query);
    }
};
