import jimp from 'jimp'
import chalk from 'chalk'


// Simple argparser, maybe something fancier later?
const argsToOptions = args => {
	let ops = {}
	ops.path = args.slice(0, 1)[0]

	args.forEach((arg, index) => {
		switch(arg) {
			case '--color':
			case '-c': ops.color = true; break;

			case '--contrast': ops.contrast = parseFloat(args[index + 1]); break;

			case '--saturation': ops.saturation = parseFloat(args[index + 1]); break;

			case '-s': 
			case '--scale': ops.scale = parseFloat(args[index + 1]); break;

			default: break;
		}
	})
	return ops
}

const matchAscii = (pixelVal, asciiSet) => {
		const rangeMax = asciiSet.length - 1 // largest indexable entry
		// since both input (0-255) and output (0-rangeMax)
		// start from 0, we can get a normalized value by this
		const mapped = Math.round((rangeMax/255) * pixelVal)
		return asciiSet[mapped]
	}


const options = argsToOptions(process.argv.slice(2))
const defaultWidth = 50

jimp.read(options.path)
	.then(img => {
		const scale = options.scale ? options.scale : (defaultWidth/img.getWidth())
		// TODO stretch = 1.0 if we use double width console font
		const stretch = 2.0
		return img
			.resize(img.getWidth() * scale * stretch, img.getHeight() * scale)
	})
	.then(img => {
		const greyscale = img.clone().greyscale()
		if (options.contrast) greyscale.contrast(options.contrast)

		if (options.saturation) img.color([ { apply: 'saturate', params: [options.saturation] } ])

		let width = img.getWidth()
		let height = img.getHeight()
		let asciiString = ''

		// TODO Japanese/Other full-width console font set
		const charSet = standardRampChars

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const rgba = jimp.intToRGBA(img.getPixelColor(x, y))
				const intensity = jimp.intToRGBA(greyscale.getPixelColor(x, y)).r
				let char = matchAscii(intensity, charSet)
				if (options.color)
					char = chalk.rgb(rgba.r, rgba.g, rgba.b)(char)
				asciiString += char
			}
			asciiString += '\n'
		}
		console.log(asciiString)
	})
	.catch(err => { console.error(err) })

// Available ASCII sets

// "Standard ramp chars" from:
// http://paulbourke.net/dataformats/asciiart/
const standardRampChars = [
  ' ', '.', "'", '`', '^', '"', ',', ':', ';',
  'I', 'l', '!', 'i', '>', '<', '~', '+', '_',
  '-', '?', ']', '[', '}', '{', '1', ')', '(',
  '|', '/', 't', 'f', 'j', 'r', 'x', 'n', 'u',
  'v', 'c', 'z', 'X', 'Y', 'U', 'J', 'C', 'L',
  'Q', '0', 'O', 'Z', 'm', 'w', 'q', 'p', 'd',
  'b', 'k', 'h', 'a', 'o', '*', '#', 'M', 'W',
  '&', '8', '%', 'B', '@', '$'
]
