import { Event } from "@infinite-fansub/discord-client";
import { ErelaEvents } from "@infinite-fansub/erela-module";

export default <Event<"nodeConnect", ErelaEvents>>{
	name: "nodeConnect",
	async run(node) {
		logger.log(`Node ${node.options.identifier} connected`);
	},
};
