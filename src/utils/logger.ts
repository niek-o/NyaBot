import { Color, colorConsole } from "colours.js/dst"
import { DefaultColors } from "./Typings"

class Logger {
    private emoji: string = "🐱"
    private errorEmoji: string = "❌"
    private defaultColors: DefaultColors = {
        color: Color.fromHex("#2587fb"),
        errorColor: Color.RED,
    };

    public date(): string {
        return colorConsole.uniform(colorConsole.uniform(`[${new Date().toLocaleString()}]`, Color.WHITE, true), Color.BLACK)
    }

    public log(log?: any) {
        if (!log) return console.log()

        console.log(`${this.date()} ${this.emoji} ${colorConsole.uniform(log, this.defaultColors.color)}`)
    }

    public error(error?: any) {
        if (!error) return console.log()

        console.error(`${this.date()} ${this.errorEmoji} ${colorConsole.uniform(error.toString(), this.defaultColors.errorColor)}`)
    }
}

export const logger = new Logger()
