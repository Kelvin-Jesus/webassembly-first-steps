import { go, wasmBrowserInstantiate } from "../main";

document.addEventListener('DOMContentLoaded', () => {
    const $xInput = document.querySelector('.x');
    const $yInput = document.querySelector('.y');
    const $result = document.querySelector('.result')
    const $btn = document.querySelector('button');

    ['mousedown', 'touchstart', 'keydown'].forEach(eventType => {
        $btn.addEventListener(eventType, firedEvent => {
            console.debug('executed event:', firedEvent.type)
            $result.innerText = `RESULT: ${sum(parseInt($xInput.value), parseInt($yInput.value)).toString()}`;
        });
    });
});

const importObject = go.importObject;

// Instantiate the wasm module
const wasmModule = await wasmBrowserInstantiate("./main.wasm", importObject);

// get wasm_exec to execute our wasm module
go.run(wasmModule.instance);

function sum(x, y) {
    return wasmModule.instance.exports.add(x, y);
}