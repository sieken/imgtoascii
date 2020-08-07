import jimp from 'jimp'
import chalk from 'chalk'


// Simple argparser, maybe something fancier later?
const argsToOptions = args => {
	let ops = {}
	ops.path = args.slice(0, 1)[0]

	args.forEach((arg, index) => {
		switch(arg) {
			case '-c': ops.color = true; break;

			case '-s': 
			case '--scale':
				try { ops.scale = parseFloat(args[index + 1]) }
				catch { console.error('what') }

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

jimp.read(options.path)
	.then(img => {
		// TODO figure out scale to match terminal width?
		const scale = options.scale ? options.scale : 1.0
		// TODO figure out stretch ratio based on regular console font size
		const stretch = 1.8
		return img
			.resize(img.getWidth() * scale * stretch, img.getHeight() * scale)
	})
	.then(img => {
		const greyscale = img.clone().greyscale()

		let width = img.getWidth()
		let height = img.getHeight()
		let asciiString = ''

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const rgba = jimp.intToRGBA(img.getPixelColor(x, y))
				const intensity = jimp.intToRGBA(greyscale.getPixelColor(x, y)).r
				let char = matchAscii(intensity, standardRampChars)
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
