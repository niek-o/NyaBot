"use strict";

import { Color, colorConsole } from "colours.js";
import Jimp                    from "jimp";

// Set of basic characters ordered by increasing "darkness"
// Used as pixels in the ASCII image
const chars = " .,:;i1tfLCG08@";
const num_c = chars.length - 1;

/**
 * Returns the color for the picture
 * @param image
 * @param x
 * @param y
 */
function intensity(image: Jimp, x: number, y: number) {
	const color = Jimp.intToRGBA(image.getPixelColor(x, y));
	return color.r + color.g + color.b + color.a;
}

/**
 * @param path - File path
 * @param color - Show color
 */
export const asciify = (path: string, color?: boolean) => {
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
			   .catch((error: string) => logger.print(error));
};

/**
 * Returns a row of the ascii art
 * @param ascii
 * @param image
 * @param coords
 * @param norm
 * @param colorToggle
 */
function convertPixelsToString(ascii: string, image: Jimp, coords: number[], norm: number, colorToggle?: boolean): string {
	const [i, j] = coords;
	if (i === undefined || j === undefined) throw new Error();
	
	const color = intensity(image, i, j);
	let next    = chars.charAt(Math.round(color / norm));
	
	// Color character using
	if (colorToggle) {
		const clr = Jimp.intToRGBA(image.getPixelColor(i, j));
		next      = colorConsole.uniform(next, Color.fromHex(rgb2hex(clr.r, clr.g, clr.b)));
	}
	
	ascii += next;
	return ascii;
}

/**
 * Returns the HEX color of the RGB input
 * @param red
 * @param green
 * @param blue
 */
function rgb2hex(red: number, green: number, blue: number) {
	return (
		"#" +
		("0" + red.toString(16)).slice(-2) +
		("0" + green.toString(16)).slice(-2) +
		("0" + blue.toString(16)).slice(-2)
	);
}
