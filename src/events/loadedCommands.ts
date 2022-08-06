import { Event } from "@infinite-fansub/discord-client/dist";
import { globalLogger } from "@infinite-fansub/logger/dist";

export default <Event<"loadedSlash">>{
    event: "loadedSlash",
    type: "on",
    run: (cmds, type) => {
        if (type === "Global")
            cmds.forEach(({ name }) => {
                globalLogger.defaultPrint(`Loaded Global command: ${name}`)
            })
        else
            cmds.forEach(({ name }) => {
                globalLogger.defaultPrint(`Lodaded ${name} on: ${type}`)
            })
    }
}