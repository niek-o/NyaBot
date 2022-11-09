export class MineSweeperGame {
    private readonly _grid: CellType[][] = [];
    private readonly _bombs: number = 0;
    private readonly _width: number = 0;
    private readonly _height: number = 0;

    constructor(width: number, height: number, bombs: number) {
        if (bombs >= width * height || width === 0 || height === 0 || bombs === 0) {
            return;
        }

        this._width = width;
        this._height = height;
        this._bombs = bombs;

        this.generateGrid();
        this.generateBombs();
        this.generateNumbers();
    }

    generateMessage() {
        let string: string = ``;

        this._grid.forEach(rows => {
            rows.forEach(cell => {
                string += `||${ emojis[cell.val] }||`;
            });
            string += `\n`;
        });

        return string;
    }

    private generateGrid() {
        for (let i = 0; i < this._height; i++) {
            const row: CellType[] = [];

            for (let j = 0; j < this._width; j++) {
                row.push({
                    val: 0,
                    row: i,
                    col: j
                });
            }
            this._grid.push(row);
        }
    }

    private generateBombs() {
        if (!this._grid) {
            return;
        }

        for (let i = 0; i < this._bombs; i++) {
            let c: number;
            let r: number;
            do {
                r = Math.floor(Math.random() * (this._height));
                c = Math.floor(Math.random() * (this._width));
            }
            while (this._grid[r][c].val === 9);

            this._grid[r][c].val = 9;
        }
    }

    private generateNumbers() {
        for (let i = 0; i < this._height; i++) {
            for (let j = 0; j < this._width; j++) {
                if (this._grid[i][j].val === 9) {
                    const { r, l, br, b, bl, tr, t, tl } = this.getAdjacentTiles(this._grid[i][j]);

                    if (r && !(r.val === 9)) {
                        r.val++;
                    }
                    if (l && !(l.val === 9)) {
                        l.val++;
                    }

                    if (this._grid[i + 1]) { // check bottom row
                        if (br && !(br.val === 9)) {
                            br.val++;
                        }
                        if (b && !(b.val === 9)) {
                            b.val++;
                        }
                        if (bl && !(bl.val === 9)) {
                            bl.val++;
                        }
                    }

                    if (this._grid[i - 1]) { // check top row
                        if (tr && !(tr.val === 9)) {
                            tr.val++;
                        }
                        if (t && !(t.val === 9)) {
                            t.val++;
                        }
                        if (tl && !(tl.val === 9)) {
                            tl.val++;
                        }
                    }
                }
            }
        }
    }

    private getAdjacentTiles(cell: CellType) {
        const r = this._grid[cell.row][cell.col + 1];
        const l = this._grid[cell.row][cell.col - 1];

        let br,
            b,
            bl;

        if (this._grid[cell.row + 1]) {
            br = this._grid[cell.row + 1][cell.col + 1];
            b = this._grid[cell.row + 1][cell.col];
            bl = this._grid[cell.row + 1][cell.col - 1];
        }

        let tr,
            t,
            tl;

        if (this._grid[cell.row - 1]) {
            tr = this._grid[cell.row - 1][cell.col + 1];
            t = this._grid[cell.row - 1][cell.col];
            tl = this._grid[cell.row - 1][cell.col - 1];
        }

        return { r, l, br, b, bl, tr, t, tl };
    }
}

const emojis = [
    "0️⃣",
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "💥"
];


interface CellType {
    val: number,
    row: number,
    col: number,
}
