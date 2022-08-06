import { Event }        from "@infinite-fansub/discord-client";
import { globalLogger } from "@infinite-fansub/logger";

export default <Event<"loadedSlash">>{
	event: "loadedSlash",
	type:  "on",
	run:   (cmds, type) => {
		if (type === "Global") {
			cmds.forEach(({ name }) => {
				globalLogger.defaultPrint(`Loaded Global command: ${ name }`);
			});
		}
        else {
			cmds.forEach(({ name }) => {
				globalLogger.defaultPrint(`Loaded ${ name } on: ${ type }`)
			})
		}
	}
}
