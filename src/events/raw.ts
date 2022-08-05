import { Event, IClientEvents } from "@infinite-fansub/discord-client/dist";
import { VoicePacket } from "erela.js";
import { client } from "../nya";

//@ts-expect-error `raw` exists but i cant be bothered to add it
export default <Event<"raw">>{
	event: "raw",
	type: "on",
	async run(d: VoicePacket) {
		client.manager.updateVoiceState(d);
	},
};
