import { Color, colorConsole } from "colours.js";
import Jimp from "jimp";

// Set of basic characters ordered by increasing "darkness"
// Used as pixels in the ASCII image
const chars = " .,:;i1tfLCG08@";
const num_c = chars.length - 1;

/**
 * The intensity of the pixel
 *
 * @param image - The image
 * @param x - The X coordinate
 * @param y - The Y coordinate
 *
 * @returns The intensity of the pixel
 */
function intensity(image: Jimp, x: number, y: number) {
	const color = Jimp.intToRGBA(image.getPixelColor(x, y));
	return color.r + color.g + color.b + color.a;
}

/**
 * Turn an image into ascii art
 *
 * @param path - File path
 * @param color - Show color
 *
 * @returns The ascii art
 */
export function asciify(path: string, color?: boolean): Promise<string> {
	// First open image to get initial properties

	return Jimp.read(path)
		.then((image: Jimp) => {
			let asciiChar: string = "";

			// Resize the image
			image.resize(55, 55);

			// Normalization for the returned intensity so that it maps to a char
			const norm = (255 * 4) / num_c;

			// Get and convert pixels
			let i,
				j,
				c;

			for (j = 0; j < image.bitmap.height; j++) {
				// height
				for (
					i = 0;
					i < image.bitmap.width;
					i++ // width
				)
					for (
						c = 0;
						c < 2;
						c++ // character ratio
					)
						asciiChar = convertPixelsToString(asciiChar, image, [
							i,
							j
						], norm, color);

				// Add new line at the end of the row
				asciiChar += "\n";
			}

			return asciiChar;
		})
		.catch((error: string) => {
			logger.print(error)
			return ""
		});
}

/**
 * Generate a row of the ascii art
 *
 * @param ascii - The character of the pixel
 * @param image - The image
 * @param coords - The coordinate of the pixel
 * @param norm - The normalization for the returned intensity so that it maps to a char
 * @param colorToggle - Enable grayscale mode
 *
 * @returns A row of the ascii art
 */
function convertPixelsToString(ascii: string, image: Jimp, coords: number[], norm: number, colorToggle?: boolean): string {
	const [i, j] = coords;
	if (i === undefined || j === undefined) throw new Error();

	const characterIntensity = intensity(image, i, j);
	let next = chars.charAt(Math.round(characterIntensity / norm));

	// Color character
	if (colorToggle) {
		const clr = Jimp.intToRGBA(image.getPixelColor(i, j));
		next = colorConsole.uniform(next, Color.fromHex(rgb2hex(clr.r, clr.g, clr.b)));
	}

	ascii += next;
	return ascii;
}

/**
 * Convert RGB color to HEX color
 *
 * @param red - Red (0-255)
 * @param green - Green (0-255)
 * @param blue - Blue (0-255)
 *
 * @returns The HEX color of the RGB input
 */
function rgb2hex(red: number, green: number, blue: number) {
	return (
		"#" +
		("0" + red.toString(16)).slice(-2) +
		("0" + green.toString(16)).slice(-2) +
		("0" + blue.toString(16)).slice(-2)
	);
}
