import { Player, Track } from "erela.js";
import { promisify } from "node:util";
import nyaOptions from "../config";
import { Client as YouTube } from "youtubei";

/**
 * A timeout generator
 */
export const timeout = promisify(setTimeout);

/**
 * Returns the progress bar and the formatted timestamp
 * @param songDuration - The duration of the song in ms
 * @param currentTimestamp - The current progress of the song in ms
 */
export function generateNowPlayingData(songDuration: number, currentTimestamp: number) {
	const formattedDuration = msToTime(songDuration);
	const formattedCurrentTimeStamp = msToTime(currentTimestamp);
	const timeStamp = `${formattedCurrentTimeStamp}/${formattedDuration}`.replace(
		/(^00:(?=.*\/00:))|((?<=^00:.*\/)00:)/g,
		""
	);

	return `${generateProgressBar(songDuration, currentTimestamp)} [${timeStamp}]`;
}

/**
 * Returns the time in the ``hh:mm:ss`` format
 * @param ms - The time in milliseconds
 */
function msToTime(ms: number) {
	const seconds: string = ("0" + Math.floor(((ms % 360000) % 60000) / 1000)).slice(-2);
	const minutes: string = ("0" + Math.floor((ms % 3600000) / 60000)).slice(-2);
	const hours: string = ("0" + Math.floor(ms / 3600000)).slice(-2);

	return `${hours}:${minutes}:${seconds}`;
}

/**
 * Returns the progress bar with the emotes from the configuration file
 * @param songDuration - The duration of the song in ms
 * @param currentTimestamp - The current progress of the song in ms
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

	const progress = Math.round((width * currentTimestamp) / songDuration);
	const whitespace = width - progress;

	if (progress < 1) {
		return (
			beginningPointerEmote + fullMidEmote.repeat(progress) + emptyMidEmote.repeat(whitespace - 1) + emptyEndingEmote
		);
	}
	if (progress < width)
		return (
			fullBeginningEmote +
			fullMidEmote.repeat(progress - 1) +
			pointerEmote +
			emptyMidEmote.repeat(whitespace - 1) +
			emptyEndingEmote
		);
	else {
		return (
			fullBeginningEmote + fullMidEmote.repeat(progress - 1) + emptyMidEmote.repeat(whitespace) + endingPointerEmote
		);
	}
}

/**
 * Returns the formatted queue
 * @param player - The music player of the guild
 */
export function generateQueue(player: Player) {
	if (!player.queue.current || player.queue.length === 0) return "There are no songs in the queue.";

	const queueArray: string[] = [];

	queueArray.push(`NOW PLAYING: ${player.queue.current.title} \n ----------------------------- \n`);

	for (const track of player.queue) {
		queueArray.push(`${player.queue.indexOf(track) + 1}: ${track.author} - ${track.title} \n`);
		if (queueArray.length >= 10) {
			queueArray.push(`${player.queue.length - 10} other tracks.`);
			break;
		}
	}

	return `\`\`\`yml\n${queueArray.toString().replace(/,/g, "")}\n\`\`\``;
}

/**
 * Returns a thumbnail URL of the first result of the track's artist and title from YouTube
 * @param track - The track that you want the thumbnail from
 *
 * @author Niek
 */
export async function getThumbnail(track: Track) {
	const youtube = new YouTube();
	const vid = await youtube.search(`${track.author} - ${track.title}`, { type: "video" });
	//@ts-expect-error Type `SearchResult` is not iterable so typescript throws an error, the code shown is js abuse and not how it should be done.
	return vid[0].thumbnails.best as string;
}
