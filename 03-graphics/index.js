import { go, wasmBrowserInstantiate } from "../main.js";

document.addEventListener('DOMContentLoaded', () => {
    const $xInput = document.querySelector('.x');
    const $result = document.querySelector('.result')
    const $resultIndexOne = document.querySelector('.result-index-one');
    const $btn = document.querySelector('button');

    ['mousedown', 'touchstart', 'keydown'].forEach(eventType => {
        $btn.addEventListener(eventType, firedEvent => {
            $result.innerText = `Value retrieved from Go: ${mutateAndReturnWasmMemory(parseInt($xInput.value), 0).toString()}`;
            $resultIndexOne.innerText = `Value stored in index 1: ${readIndexOneOfBuffer()}`
        });
    });
});

const importObject = go.importObject;

// Instantiate the wasm module
const wasmModule = await wasmBrowserInstantiate("./main.wasm", importObject);

// get wasm_exec to execute our wasm module
go.run(wasmModule.instance);

// all properties exported from WASM
const exports = wasmModule.instance.exports

// memory from WASM
const memory = exports.memory

// new byte array to get access of WASM memory
let wasmByteMemoryArray = new Uint8Array(memory.buffer);

// get buffer pointer(index) that is stored inside wasm
let graphicsBufferPointer = exports.getGraphicsBufferPointer();

const $canvas = document.querySelector('canvas');

// get context and imageData of canvas
const canvasContext = $canvas.getContext('2d');
const canvasImageData = canvasContext.createImageData(
    $canvas.width,
    $canvas.height
);

canvasContext.clearRect(0, 0, $canvas.width, $canvas.height);

const getDarkValue = () => {
    return Math.floor(Math.random() * 100);
}