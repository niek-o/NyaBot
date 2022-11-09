import { IClientOptions, InfiniteClient } from "@infinite-fansub/discord-client";
import { ClientUser, GatewayDispatchEvents, GatewayIntentBits } from "discord.js";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import nyaOptions from "./config";
import { Color } from "colours.js/dst";
import { Node } from "lavaclient";
import "module-alias/register";
import "./utils/lib";

require("@infinite-fansub/logger");

//#region Setup logger
logger.showMemory = false;
logger.showDay = true;

logger.emojis = {
    emoji: nyaOptions.logger.emoji,
    errorEmoji: nyaOptions.logger.errorEmoji
};

logger.colors = {
    color: Color.fromHex(nyaOptions.logger.color),
    errorColor: Color.fromHex(nyaOptions.logger.errorColor)
};

//#endregion

//#region Define client
export class NyaClient extends InfiniteClient {
    declare public user: ClientUser;
    public manager: Node;
    private musicEventFiles: string[] = readdirSync(join(__dirname, "./events/lavaclient/node"))
        .filter((f) => f.endsWith(".ts") || f.endsWith(".js"));

    constructor(options: IClientOptions, manager: Node) {
        super(options);
        this.manager = manager;

        // MusicEvents handling
        this.musicEventFiles.forEach(async (f) => {
            const event = (await import(`./events/lavaclient/node/${ f }`)).default;
            this.manager.on(event.name, (...args: any) => event.execute(...args));
        });

        this.ws.on(GatewayDispatchEvents.VoiceServerUpdate, data => this.manager.handleVoiceUpdate(data));
        this.ws.on(GatewayDispatchEvents.VoiceStateUpdate, data => this.manager.handleVoiceUpdate(data));
    }
}

//#endregion

//#region Setup client
export const client = new NyaClient({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildVoiceStates
        ],
        disable: {
            warnings: true
        },
        dirs: {
            events: join(__dirname, "./events/discord"),
            slashCommands: join(__dirname, "./commands")
        },
        token: nyaOptions.token
    }, new Node({
        connection: nyaOptions.music.lavalink,
        sendGatewayPayload: (id, payload) => {
            const guild = client.guilds.cache.get(id);
            if (guild) {
                guild.shard.send(payload);
            }
        }
    })
);

//#endregion
