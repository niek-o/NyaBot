import { Event } from "@infinite-fansub/discord-client";
import { ErelaEvents } from "@infinite-fansub/erela-module";

export default <Event<"nodeError", ErelaEvents>>{
	name: "nodeError",
	async run(node, error) {
		logger.error(`Node ${node.options.identifier} had an error: ${error.message}`);
	},
};
