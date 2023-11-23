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

export const wasmBrowserInstantiate = async (wasmModuleURL, importObject) => {
    let response;

    // dont have support for streaming instantiation
    if ( !WebAssembly.instantiateStreaming ) {
        // download its entire module then instantiate it
        const fetchAndInstantiateTask = async () => {
            const wasmArrayBuffer = await fetch(wasmModuleURL)
                .then(response => response.arrayBuffer());
            
            return WebAssembly.instantiate(wasmArrayBuffer, importObject);
        }

        response = await fetchAndInstantiateTask();
        return response;
    }

    // fetch the wasm module via streaming and instantiate it as it is downloading
    response = await WebAssembly.instantiateStreaming(
        fetch(wasmModuleURL),
        importObject
    );

    return response;
}

const go = new Go(); // defined in wasm_exec
const importObject = go.importObject;

// Instantiate the wasm module
const wasmModule = await wasmBrowserInstantiate("./main.wasm", importObject);

// get wasm_exec to execute our wasm module
go.run(wasmModule.instance);

function sum(x, y) {
    return wasmModule.instance.exports.add(x, y);
}