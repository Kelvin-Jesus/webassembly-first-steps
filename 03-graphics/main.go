package main

// size of "checkerboard"
const CHECHKERBOARD_SIZE int = 20

// a byte buffer with the size of 20 * 20 * 4 to store the graphics that JS will render
// CHECHKERBOARD_SIZE * CHECHKERBOARD_SIZE multiplyed by 4 colors per pixel (rgba)
const BUFFER_SIZE int = CHECHKERBOARD_SIZE * CHECHKERBOARD_SIZE * 4

// Initialize the buffer
var graphicsBuffer [BUFFER_SIZE]uint8

func main() {}

// returns the ponter (index) to buffer in wasm memory
//
//export getGraphicsBufferPointer
func getGraphicsBufferPointer() *[BUFFER_SIZE]uint8 {
	return &graphicsBuffer
}

// returns the buffer size
//
//export getGraphicsBufferSize
func getGraphicsBufferSize() int {
	return BUFFER_SIZE
}

// Gerenerates pixel by pixel of checkerboard
//
//export generateCheckerBoard
func generateCheckerBoard(
	darkValueRed uint8,
	darkValueGreen uint8,
	darkValueBlue uint8,
	lightValueRed uint8,
	lightValueGreen uint8,
	lightValueBlue uint8,
) {
	// loop through it, but the buffer its only 1d, so will be mapping to 2d
	// https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid
	for y := 0; y < CHECHKERBOARD_SIZE; y++ {
		for x := 0; x < CHECHKERBOARD_SIZE; x++ {
			// default to a dark square
			isDarkSquare := true

			// if y is odd, toggle the square
			if (y % 2) == 0 {
				isDarkSquare = false
			}

			// toggle x value
			if (x % 2) == 0 {
				isDarkSquare = !isDarkSquare
			}

			// set square value
			squareValueRed := darkValueRed
			squareValueGreen := darkValueGreen
			squareValueBlue := darkValueBlue

			if !isDarkSquare {
				squareValueRed = lightValueRed
				squareValueGreen = lightValueGreen
				squareValueBlue = lightValueBlue
			}

			// calculate the index using 2d -> 1d mapping
			// multiply by 4 because we have 4 colors per pixel (rgba)
			squareNumber := (y * CHECHKERBOARD_SIZE) + x
			squareRgbaIndex := squareNumber * 4

			// set the color values
			graphicsBuffer[squareRgbaIndex+0] = squareValueRed
			graphicsBuffer[squareRgbaIndex+1] = squareValueGreen
			graphicsBuffer[squareRgbaIndex+2] = squareValueBlue
			graphicsBuffer[squareRgbaIndex+3] = 255 // alpha always opaque

		}
	}
}
