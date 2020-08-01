//import assert from 'assert'
import jimp from 'jimp'

describe('Read image from path', () => {
    it('should read an image from file path', () => {
        // Arrange
        const path = 'testimg.png'
        let img = null

        // Act
        jimp.read(path)
            .then(imgFromPath => { img = imgFromPath })
            .catch(err => console.error(err))

        // Assert
        console.log(img)
    })
})