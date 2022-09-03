import { Event } from "@infinite-fansub/discord-client";

export default <Event<"loadedSlash">>{
	event: "loadedSlash",
	type:  "on",
	run:   (cmds, type) => {
		if (type === "Global") {
			cmds.forEach(({ name }) => {
				logger.log(`Loaded Global command: ${ name }`);
			});
		}
		else {
			cmds.forEach(({ name }) => {
				logger.log(`Loaded ${ name } on: ${ type }`);
			});
		}
	}
};
