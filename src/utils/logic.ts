import { Player, Track }                                       from "erela.js";
import { promisify }                                           from "node:util";
import nyaOptions                                              from "../config";
import { Client }                                              from "youtubei";
import { client }                                              from "../nya";
import { EmbedBuilder, GuildMember, Interaction, TextChannel } from "discord.js";
import { fetch }                                               from "undici";

/**
 * A timeout generator (in ms)
 *
 * @author Niek
 */
export const timeout = promisify(setTimeout);

//region Music logic
/**
 * Generate the now playing data
 *
 * @param songDuration - The duration of the song in ms
 * @param currentTimestamp - The current progress of the song in ms
 *
 * @returns The progress bar and the formatted timestamp
 *
 * @author Niek
 */
export function generateNowPlayingData(songDuration: number, currentTimestamp: number) {
	const formattedDuration         = msToTime(songDuration);
	const formattedCurrentTimeStamp = msToTime(currentTimestamp);
	const timeStamp                 = `${ formattedCurrentTimeStamp }/${ formattedDuration }`.replace(
		/(^00:(?=.*\/00:))|((?<=^00:.*\/)00:)/g,
		""
	);
	
	return `${ generateProgressBar(songDuration, currentTimestamp) } [${ timeStamp }]`;
}

/**
 * Convert ms to time
 *
 * @param ms - The time in milliseconds
 *
 * @returns The time in the ``hh:mm:ss`` format
 *
 * @author Niek
 */
function msToTime(ms: number) {
	const seconds: string = ("0" + Math.floor(((ms % 360000) % 60000) / 1000)).slice(-2);
	const minutes: string = ("0" + Math.floor((ms % 3600000) / 60000)).slice(-2);
	const hours: string   = ("0" + Math.floor(ms / 3600000)).slice(-2);
	
	return `${ hours }:${ minutes }:${ seconds }`;
}

/**
 * Generate the progress bar
 *
 * @param songDuration - The duration of the song in ms
 * @param currentTimestamp - The current progress of the song in ms
 *
 * @returns The progress bar with the emotes from the configuration file
 *
 * @author Niek
 */
function generateProgressBar(songDuration: number, currentTimestamp: number) {
	const {
			  fullBeginningEmote,
			  fullMidEmote,
			  emptyMidEmote,
			  emptyEndingEmote,
			  beginningPointerEmote,
			  pointerEmote,
			  endingPointerEmote,
			  width,
		  } = nyaOptions.music.options.progressBar;
	
	const progress   = Math.round((width * currentTimestamp) / songDuration);
	const whitespace = width - progress;
	
	if (progress < 1) {
		return (
			beginningPointerEmote + fullMidEmote.repeat(progress) + emptyMidEmote.repeat(whitespace - 1) + emptyEndingEmote
		);
	}
	if (progress < width) {
		return (
			fullBeginningEmote +
			fullMidEmote.repeat(progress - 1) +
			pointerEmote +
			emptyMidEmote.repeat(whitespace - 1) +
			emptyEndingEmote
		);
	}
	else {
		return (
			fullBeginningEmote + fullMidEmote.repeat(progress - 1) + emptyMidEmote.repeat(whitespace) + endingPointerEmote
		);
	}
}

/**
 * Generate the queue
 *
 * @param player - The music player of the guild
 *
 * @returns The formatted queue
 *
 * @author Niek
 */
export function generateQueue(player: Player) {
	const queueArray: string[] = [];
	
	for (const track of player.queue) {
		queueArray.push(`${ player.queue.indexOf(track) + 1 }) ${ track.author } - ${ track.title } \n`);
		if (queueArray.length >= 10) {
			queueArray.push(`${ player.queue.length - 10 } other tracks.`);
			break;
		}
	}
	
	if (queueArray.length === 0) {
		queueArray.push("There are no tracks remaining.");
	}
	
	return queueArray.toString()
					 .replace(/,/g, "");
}

/**
 * Get thumbnail for a track
 *
 * @param track - The track that you want the thumbnail from
 *
 * @returns The thumbnail URL of the track
 *
 * @author Niek
 */
export async function getThumbnail(track: Track): Promise<string> {
	const res = await fetch(track.displayThumbnail("maxresdefault"))
		.catch();
	
	if (res && res.ok) return track.displayThumbnail("maxresdefault");
	
	logger.error("Could not find thumbnail for this track. Searching on YouTube...");
	
	const youtube      = new Client();
	const searchResult = await youtube.search(`${ track.author } - ${ track.title }`, { type: "video" });
	
	return searchResult.items[0].thumbnails.best as string;
}

//endregion

//#region Embeds
/**
 * Get the base embed
 *
 * @param interaction - The Interaction or TextChannel
 * @param title - Embed title
 * @param description - Embed description
 *
 * @returns The base embed
 *
 * @author Niek
 */
export function getBaseEmbed(interaction: Interaction | TextChannel, title?: string, description?: string) {
	return new EmbedBuilder()
		.setColor((interaction.guild?.members.cache.get(client.user.id) as GuildMember).displayHexColor)
		.setFooter({ text: "NyaBot", iconURL: client.user.avatarURL() ?? "Default image" })
		.setTimestamp()
		.setTitle(title
				  ? title
				  : null)
		.setDescription(description
						? description
						: null);
}

/**
 * Get the base embed for errors
 *
 * @param error - The error message you want to display
 *
 * @returns The base embed for errors
 *
 * @author Niek
 */
export function getBaseErrorEmbed(error?: string) {
	return new EmbedBuilder()
		.setColor("#FF0000")
		.setFooter({ text: "NyaBot", iconURL: client.user.avatarURL() ?? "Default image" })
		.setTimestamp()
		.setTitle("ERROR")
		.setDescription(error
						? error
						: null);
}

//#endregion
