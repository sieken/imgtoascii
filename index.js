

// TODO
// 	[x] Read image from path
// 	[x] Return some kind of list of avg greyscale
//
// 	[ ] Read grayscaled lisst
// 	[ ] Return blocks of averages
//
// 	[ ] Take list of grayscaled blocks
// 	[ ] Map block color value to matching density ascii
// 	[ ] Replace blocks with mapped ascii character and output
//

const jimp = require('jimp')

jimp.read('test/test.png')
	.then(img => {
		// This is list of grayscale pixels to blockify
		return blockify(img.bitmap.data)
	})
	.catch(err => { console.error(err) })

blockify = pixelList => {
	console.log('Got me a juicy list of pixels\n', pixelList)
}