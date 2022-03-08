/**
 * The options for the bot
 * @property {discordOptions} discord - The options for the discord setup
 * @property {musicOptions} music - The options for the music module
 * @property {loggerOptions} logger - The options for the logger
 *
 * @author Niek
 */
export interface INyaOptions {
	discord: discordOptions;
	music: musicOptions;
	logger: loggerOptions;
}

/**
 * The options for the discord setup
 * @property {string} token - The discord bot token
 * @property {string} clientId - The discord bot client id
 * @property {string} guildId - The bot testing server
 *
 * @author Niek
 */
type discordOptions = {
	token: string;
	clientId: string;
	guildId: string;
};

/**
 * The options for the music module
 * @property {playerOptions} options - TThe options for the music player
 * @property {lavalinkOptions} lavalink - The options for lavalink
 *
 * @author Niek
 */
type musicOptions = {
	options: playerOptions;
	lavalink: lavalinkOptions;
};

/**
 * The options for the music player
 * @property {boolean} leaveOnQueueEnd - Leave the voice channel when the queue ends
 * @property {number} timeOut - The leave timeout in ms
 * @property {number} volume - The volume of the player
 * @property {boolean} deafenOnJoin - Deafen the bot on join
 * @property {progressBarOptions} progressBar - The options for the progress bar
 *
 * @author Niek
 */
type playerOptions = {
	leaveOnQueueEnd: boolean;
	timeOut: number;
	volume: number;
	deafenOnJoin: boolean;
	progressBar: progressBarOptions;
};

/**
 * The options for the progress bar
 * @property {string} fullBeginningEmote - The first emote (full)
 * @property {string} fullMidEmote - The middle emote (full)
 * @property {string} emptyMidEmote - The middle emote (empty)
 * @property {string} emptyEndingEmote - The last emote (empty)
 * @property {string} beginningPointerEmote - The first emote (ball)
 * @property {string} pointerEmote - The middle emote (ball)
 * @property {string} endingPointerEmote - The last emote (ball)
 * @property {number} width - The width of the progress bar
 *
 * @author Niek
 */
type progressBarOptions = {
	fullBeginningEmote: string;
	fullMidEmote: string;
	emptyMidEmote: string;
	emptyEndingEmote: string;
	beginningPointerEmote: string;
	pointerEmote: string;
	endingPointerEmote: string;
	width: number;
};

/**
 * The options for lavalink
 * @property {string} host - The lavalink ip address
 * @property {number} port - The lavalink port
 * @property {string} password - The lavalink password
 *
 * @author Niek
 */
type lavalinkOptions = {
	host: string;
	port: number;
	password: string;
};

/**
 * The options for the logger
 * @property {string} color - The default logging color in HEX format
 * @property {string} errorColor - The error logging color in HEX format
 *
 * @author Niek
 */
type loggerOptions = {
	color: string;
	errorColor: string;
	emoji: string;
	errorEmoji: string;
};
