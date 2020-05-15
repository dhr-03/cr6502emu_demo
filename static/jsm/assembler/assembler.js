import { Logger } from './logger.js';
import { reNormalAddressing, reIndexedAddressing } from './snippets/assembler-e79716fcbaa7f3b4/js_snippets/regex.js';

let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory0;
}

function getArrayU32FromWasm0(ptr, len) {
    return getUint32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}
/**
* @returns {string}
*/
export function build_date() {
    try {
        wasm.build_date(8);
        var r0 = getInt32Memory0()[8 / 4 + 0];
        var r1 = getInt32Memory0()[8 / 4 + 1];
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_free(r0, r1);
    }
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
*/
export function set_panic_hook() {
    wasm.set_panic_hook();
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}
/**
*/
export class Assembler {

    static __wrap(ptr) {
        const obj = Object.create(Assembler.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_assembler_free(ptr);
    }
    /**
    */
    constructor() {
        var ret = wasm.assembler_new();
        return Assembler.__wrap(ret);
    }
    /**
    * @param {string} lines
    * @returns {number}
    */
    assemble(lines) {
        var ptr0 = passStringToWasm0(lines, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.assembler_assemble(this.ptr, ptr0, len0);
        return ret;
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {

        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = import.meta.url.replace(/\.js$/, '_bg.wasm');
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_reNormalAddressing_25df4a7c4b533b98 = function(arg0, arg1, arg2, arg3) {
        reNormalAddressing(getStringFromWasm0(arg0, arg1), getArrayU32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_reIndexedAddressing_d447c4e896ace7dc = function(arg0, arg1, arg2, arg3) {
        reIndexedAddressing(getStringFromWasm0(arg0, arg1), getArrayU32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_genericMessage_3905ac931a025bc3 = function(arg0, arg1, arg2, arg3) {
        Logger.genericMessage(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_genericExplainedCode_9e90aff4c43288af = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        Logger.genericExplainedCode(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3), getStringFromWasm0(arg4, arg5), getStringFromWasm0(arg6, arg7));
    };
    imports.wbg.__wbg_beginErr_4e1993eda23fe85f = function() {
        Logger.beginErr();
    };
    imports.wbg.__wbg_write_b7bea71cc6467b3a = function(arg0, arg1) {
        Logger.write(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_writeCode_9ff2712977862a0b = function(arg0, arg1) {
        Logger.writeCode(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_endMessage_d1a864c2be12c3a5 = function() {
        Logger.endMessage();
    };
    imports.wbg.__wbg_setCurrentLine_42f7eeb0c004c423 = function(arg0) {
        Logger.setCurrentLine(arg0 >>> 0);
    };
    imports.wbg.__wbg_msgHandled_80ba449bb419716f = function() {
        var ret = Logger.msgHandled();
        return ret;
    };
    imports.wbg.__wbg_reset_a6e5dbb2f8134389 = function() {
        Logger.reset();
    };
    imports.wbg.__wbg_setCurrentLine_84539ecdadd07769 = function(arg0, arg1) {
        Logger.setCurrentLine(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_genericExplainedCode_bd04d54eae1cd9c6 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        Logger.genericExplainedCode(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3), arg4, getStringFromWasm0(arg5, arg6));
    };
    imports.wbg.__wbg_new_59cb74e423758ede = function() {
        var ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_558ba5917b466edd = function(arg0, arg1) {
        var ret = getObject(arg1).stack;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

export default init;

