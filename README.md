# NyaBot

Current features:

- Music

---

## Prerequisites

- Install the latest version of [Node.js](https://nodejs.org/en/)
- Download [LavaLink](https://github.com/freyacodes/Lavalink)

---

## How to set up

1. Clone the repository.
2. Install all the packages using `yarn`.
3. Create a file called `config.ts` inside the `src`.
4. Write the configuration with the `INyaOptions` interface and export it
5. Use `yarn start` to start the bot.

### `INyaOptions` interface:

```ts
{
    // Discord data
    discord: {
        token: string  // Discord bot token
        clientId: string // Discord bot's client id
        guildId: string // The bot's testing server
        },
    // Music data
    music: {
        // Lavalink data
        lavalink: {
            host: string // Lavalink host
            port: number // Lavalink port
            password: string // Lavalink password
        },
        // Spotify app data
        spotify: {
            id: string // Spotify app id
            secret: string // Spotify app secret
        }
    }
}
```
