import { Event, IClientEvents } from "@infinite-fansub/discord-client";
import { VoicePacket } from "erela.js";
import { client } from "../../nya";

interface NyaEvents extends IClientEvents {
	raw: [d: VoicePacket];
}

interface IEvent<E extends keyof NyaEvents> extends Omit<Event<any>, "event"> {
	event: E;
}

export default <IEvent<"raw">>{
	event: "raw",
	type: "on",
	async run(d) {
		client.erela.manager.updateVoiceState(d);
	},
};
