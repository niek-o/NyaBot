import { Node }         from "erela.js";

export = {
	name: "nodeError",
	async execute(node: Node, error: Error) {
		logger.error(`Node ${ node.options.identifier } had an error: ${ error.message }`);
	},
};
