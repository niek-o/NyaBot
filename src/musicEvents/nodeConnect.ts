import { Node } from "erela.js";
import { logger } from "../utils/logger";

export = {
	name: "nodeConnect",
	async execute(node: Node) {
		logger.log(`Node ${node.options.identifier} connected`);
	}
};