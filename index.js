const jimp = require('jimp')
const testfileInPath = 'test/test.png'

jimp.read(testfileInPath)
	.then(img => {
		const scale = 0.5
		const stretch = 1.8
		return img
			.resize(img.getWidth() * scale * stretch, img.getHeight() * scale)
			.greyscale()
	})
	.then(img => {
		let width = img.getWidth()
		let height = img.getHeight()
		let asciiString = ''
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const greyscaleVal = jimp.intToRGBA(img.getPixelColor(x, y)).r
				asciiString += matchAscii(greyscaleVal, standardRampChars)
			}
			asciiString += '\n'
		}
		console.log(asciiString)
	})
	.catch(err => { console.error(err) })

// Helpers

matchAscii = (pixelVal, asciiSet) => {
	const rangeMax = asciiSet.length - 1 // largest indexable entry
	// since both input (0-255) and output (0-rangeMax)
	// start from 0, we can get a normalized value by this
	const mapped = Math.round((rangeMax/255) * pixelVal)
	return asciiSet[mapped]
}

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
