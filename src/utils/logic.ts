import { Player } from "erela.js";
import { promisify } from "node:util";
import nyaOptions from "../config";

export const timeout = promisify(setTimeout)

export function generateNowPlayingData(songDuration: number, currentTimestamp: number) {
    const formattedDuration = msToTime(songDuration);
    const formattedCurrentTimeStamp = msToTime(currentTimestamp);
    const timeStamp = (`${formattedCurrentTimeStamp}/${formattedDuration}`).replace(/(^00:(?=.*\/00:))|((?<=^00:.*\/)00:)/g, "");

    return `${generateProgressBar(songDuration, currentTimestamp)} [${timeStamp}]`;
}

function msToTime(ms: number) {
    const date = new Date(ms);
    return date.toLocaleTimeString('UTC', { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "UTC" });
}

function generateProgressBar(songDuration: number, currentTimestamp: number) {
    const fullBeginningEmote = nyaOptions.music.options.progressBar.fullBeginningEmote;
    const fullMidEmote = nyaOptions.music.options.progressBar.fullMidEmote;
    const emptyMidEmote = nyaOptions.music.options.progressBar.emptyMidEmote;
    const emptyEndingEmote = nyaOptions.music.options.progressBar.emptyEndingEmote;
    const beginningPointerEmote = nyaOptions.music.options.progressBar.beginningPointerEmote;
    const pointerEmote = nyaOptions.music.options.progressBar.pointerEmote;
    const endingPointerEmote = nyaOptions.music.options.progressBar.endingPointerEmote
    const size = nyaOptions.music.options.progressBar.width;

    const progress = Math.round(size * currentTimestamp / songDuration);
    const whitespace = size - progress;

    if (progress < 1) {
        return beginningPointerEmote + fullMidEmote.repeat(progress) + emptyMidEmote.repeat(whitespace - 1) + emptyEndingEmote;
    } else {
        if (progress < size)
            return fullBeginningEmote + fullMidEmote.repeat(progress - 1) + pointerEmote + emptyMidEmote.repeat(whitespace - 1) + emptyEndingEmote;
        else {
            return fullBeginningEmote + fullMidEmote.repeat(progress - 1) + emptyMidEmote.repeat(whitespace) + endingPointerEmote;
        }
    }
}

export function generateQueue(player: Player) {
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
