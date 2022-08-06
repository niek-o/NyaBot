import { globalLogger } from "@infinite-fansub/logger";
import { Node } from "erela.js";

export = {
	name: "nodeConnect",
	async execute(node: Node) {
		globalLogger.defaultPrint(`Node ${node.options.identifier} connected`);
	},
};
