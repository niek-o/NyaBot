import { INyaOptions } from "./utils/types/types";

const nyaOptions: INyaOptions = {
    token: "",
    guildId: "",
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
    },
    logger: {
        color: "",
        errorColor: "",
        emoji: "",
        errorEmoji: "",
    },
    imageAPI: {
        host: "",
        port: "",
    }
};

export default nyaOptions;
