import { globalLogger } from "@infinite-fansub/logger/dist";
import { Node } from "erela.js";

export = {
	name: "nodeError",
	async execute(node: Node, error: Error) {
		globalLogger.error(`Node ${node.options.identifier} had an error: ${error.message}`);
	},
};
