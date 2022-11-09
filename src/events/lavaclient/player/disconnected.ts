export default {
    name: "disconnected",
    async execute(code: number, reason: string) {
        logger.error(`Disconnected player with code ${ code } - ${ reason }`);
    }
};
