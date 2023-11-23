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

const RunWasmAdd = async() => {
    const importObject = go.importObject;

    // Instantiate the wasm module
    const wasmModule = await wasmBrowserInstantiate("./main.wasm", importObject);

    // get wasm_exec to execute our wasm module
    go.run(wasmModule.instance);

    // call the function we defined in Golang and store the result
    const addResult = wasmModule.instance.exports.add(24, 24);

    document.body.textContent = `Hello World! and The result of 24 + 24 is ${addResult}`;
}

RunWasmAdd();