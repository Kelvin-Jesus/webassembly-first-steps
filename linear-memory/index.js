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

// write in WASM, Read in JS
console.log("Write in WASM, Read in JS, index 0:");

// Write to the wasm buffer
wasmModule.instance.exports.storeValueInWasmMemoryBufferIndexZero(24);

// uint8array of wasm memory
let wasmMemory = new Uint8Array(wasmModule.instance.exports.memory.buffer);

// get buffer pointer that is stored inside wasm
let wasmBufferPointer = wasmModule.instance.exports.getWasmMemoryBufferPointer();

// Read the memory using the pointer that Go wasm provided
console.log(wasmMemory[wasmBufferPointer])

// First, let's write to index one of our buffer
wasmMemory[wasmBufferPointer + 1] = 15;

// Then, let's have wasm read index one of the buffer,
// and return the result
console.log(
    wasmModule.instance.exports.readWasmMemoryBufferAndReturnIndexOne()
); // Should log "15"

function mutateAndReturnWasmMemory(value, index = 0) {
    wasmModule.instance.exports.storeValueInWasmMemoryBufferIndexZero(value);
    return wasmMemory[wasmBufferPointer + index]
}

function readIndexOneOfBuffer() {
    return wasmModule.instance.exports.readWasmMemoryBufferAndReturnIndexOne();
}
