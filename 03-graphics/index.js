import { go, wasmBrowserInstantiate } from "../main.js";

const importObject = go.importObject;

// Instantiate the wasm module
const wasmModule = await wasmBrowserInstantiate("./main.wasm", importObject);

// get wasm_exec to execute our wasm module
go.run(wasmModule.instance);

// all properties exported from WASM
const WASM = wasmModule.instance.exports

// memory from WASM
const memory = WASM.memory

// new byte array to get access of WASM memory
const wasmByteMemoryArray = new Uint8Array(memory.buffer);

// get buffer pointer(index) that is stored inside wasm
const graphicsBufferPointer = WASM.getGraphicsBufferPointer();

// get size of buffer located in wasm
const graphicsBufferSize = WASM.getGraphicsBufferSize();

const $canvas = document.querySelector('canvas');

// get context and imageData of canvas
const canvasContext = $canvas.getContext('2d');
const canvasImageData = canvasContext.createImageData(
    $canvas.width,
    $canvas.height
);

export const clearCanvas = () => canvasContext.clearRect(0, 0, $canvas.width, $canvas.height);

clearCanvas()

const getDarkValue = () => {
    return Math.floor(Math.random() * 100);
}

const getLightValue = () => {
    return (Math.floor(Math.random() * 127) + 127);
}

const drawCheckerBoard = () => {
    // const CHECHKERBOARD_SIZE = 20;

    // generates a new checkerboard inside wasm
    WASM.generateCheckerBoard(
        getDarkValue(),
        getDarkValue(),
        getDarkValue(),
        getLightValue(),
        getLightValue(),
        getLightValue(),
    );

    // Get RGBA from wasm memory, starts at the checkerboard pointer (memory array index)
    const imageDataArray = wasmByteMemoryArray.slice(
        graphicsBufferPointer,
        graphicsBufferPointer + graphicsBufferSize
    );

    // set values to canvas image data
    canvasImageData.data.set(imageDataArray);

    clearCanvas()

    // put the generated image onto canvas
    canvasContext.putImageData(canvasImageData, 0, 0);

    // 60fps - dont use if u have epilepsy
    // window.requestAnimationFrame(drawCheckerBoard);
}

drawCheckerBoard();
setInterval(() => {
    drawCheckerBoard();
}, 1000);
