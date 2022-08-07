import { Node }         from "erela.js";

export = {
	name: "nodeConnect",
	async execute(node: Node) {
		logger.log(`Node ${ node.options.identifier } connected`);
	},
};
