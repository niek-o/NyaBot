import { INyaOptions } from "./utils/Typings/ConfigTypes";

const nyaOptions: INyaOptions = {
	discord: {
		token: "",
		clientId: "",
		guildId: "",
	},
	music: {
		options: {
			leaveOnQueueEnd: true,
			timeOut: 10000,
			volume: 50,
			deafenOnJoin: true,
			progressBar: {
				fullBeginningEmote: "",
				fullMidEmote: "",
				emptyMidEmote: "",
				emptyEndingEmote: "",
				beginningPointerEmote: "",
				pointerEmote: "",
				endingPointerEmote: "",
				width: 10,
			},
		},
		lavalink: {
			host: "0.0.0.0",
			port: 2333,
			password: "youshallnotpass",
		},
		spotify: {
			id: "",
			secret: "",
		},
	},
	logColors: {
		color: "",
		errorColor: "",
	},
};

export default nyaOptions;
