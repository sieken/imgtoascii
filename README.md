# imgtoascii
Turn images into ascii art ~representations~

## TODO

Read and parse
* [x] Read image from path
    * Used `jimp`
* [x] Return some kind of list of avg grayscale
    * `jimp`s bitmap

Convert to blocks
* [ ] Read grayscaled list
* [ ] Return blocks of averages (e.g. 9x9 pixel blocks averaged out to one color)

Output
* [ ] Take list of grayscaled blocks
* [ ] Map block color/grayscale value to matching density ascii character
* [ ] Replace blocks with mapped ascii characters
