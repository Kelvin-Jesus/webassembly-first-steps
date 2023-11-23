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

export const go = new Go(); // defined in wasm_exec