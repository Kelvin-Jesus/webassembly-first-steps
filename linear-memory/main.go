package main

// uint8 byte buffer.
const BUFFER_SIZE = 2

// exist only in wasm memory, the pointer will then be passed to JS.
var buffer [BUFFER_SIZE]uint8

func main() {}

// pointer to the buffer in wasm memory.
//
//export getWasmMemoryBufferPointer
func getWasmMemoryBufferPointer() *[BUFFER_SIZE]uint8 {
	return &buffer
}

// receive a value from js then store in 0 index of buffer.
//
//go:export storeValueInWasmMemoryBufferIndexZero
func storeValueInWasmMemoryBufferIndexZero(value uint8) {
	buffer[0] = value
}

// Read value form wasm memory buffer and return it.
//
//go:export readWasmMemoryBufferAndReturnIndexOne
func readWasmMemoryBufferAndReturnIndexOne() uint8 {
	return buffer[1]
}
