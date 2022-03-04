import { VoicePacket } from "erela.js"
import { client } from "../nya"

export = {
    name: "raw",
    async execute(d: VoicePacket) {
        client.manager.updateVoiceState(d)
    }
}