/**
 * The global configuration for the bot.
 *
 * See [src/config.ts](https://github.com/niek-o/NyaBot/blob/main/src/config.ts) for a template.
 */

export interface INyaOptions {
	token: string;
	music: musicOptions;
	logger: loggerOptions;
}

type musicOptions = {
	options: playerOptions;
	lavalink: lavalinkOptions;
};

type playerOptions = {
	/** Leave the voice channel when the queue ends */
	leaveOnQueueEnd: boolean;
	/** The leave timeout in ms */
	timeOut: number;
	/** The volume of the player */
	volume: number;
	/** Deafen the bot on join */
	deafenOnJoin: boolean;
	/** The options for the progress bar */
	progressBar: progressBarOptions;
};

type progressBarOptions = {
	/** The first emote (full) */
	fullBeginningEmote: string;
	/** The middle emote (full) */
	fullMidEmote: string;
	/** The middle emote (empty) */
	emptyMidEmote: string;
	/** The last emote (empty) */
	emptyEndingEmote: string;
	/** The first emote (ball) */
	beginningPointerEmote: string;
	/** The middle emote (ball) */
	pointerEmote: string;
	/** The last emote (ball) */
	endingPointerEmote: string;
	/** The width of the progress bar */
	width: number;
};

type lavalinkOptions = {
	/** The lavalink address */
	host: string;
	/** The lavalink port */
	port: number;
	/** The lavalink password */
	password: string;
};

type loggerOptions = {
	/** The default logging color in HEX format */
	color: string;
	/** The error logging color in HEX format */
	errorColor: string;
	/** The emoji that is used for normal logs */
	emoji: string;
	/** The emoji that is used for error logs */
	errorEmoji: string;
};
