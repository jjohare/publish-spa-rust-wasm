import { read_dir_recursive, write_file } from './snippets/publish-spa-wasm-a9fa68189cfcf73e/js/fs-helpers.js';

let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

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
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_export3(addHeapObject(e));
    }
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => state.dtor(state.a, state.b));

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            state.dtor(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}
/**
 * Get backlinks for a specific page
 * @param {string} input_dir
 * @param {string} page_path
 * @returns {Promise<any>}
 */
export function get_backlinks(input_dir, page_path) {
    const ptr0 = passStringToWasm0(input_dir, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(page_path, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.get_backlinks(ptr0, len0, ptr1, len1);
    return takeObject(ret);
}

/**
 * Parse a Logseq graph and return statistics
 * @param {string} input_dir
 * @returns {Promise<any>}
 */
export function parse_graph(input_dir) {
    const ptr0 = passStringToWasm0(input_dir, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.parse_graph(ptr0, len0);
    return takeObject(ret);
}

/**
 * Initialize panic hook for better error messages in WASM
 */
export function init() {
    wasm.init();
}

/**
 * Main publish function - Entry point from JavaScript
 *
 * # Arguments
 * * `config_obj` - JavaScript object containing configuration
 *
 * # Returns
 * Promise that resolves to PublishStats
 * @param {any} config_obj
 * @returns {Promise<any>}
 */
export function publish(config_obj) {
    const ret = wasm.publish(addHeapObject(config_obj));
    return takeObject(ret);
}

function __wasm_bindgen_func_elem_510(arg0, arg1, arg2) {
    wasm.__wasm_bindgen_func_elem_510(arg0, arg1, addHeapObject(arg2));
}

function __wasm_bindgen_func_elem_2869(arg0, arg1, arg2, arg3) {
    wasm.__wasm_bindgen_func_elem_2869(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

const PublishConfigFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_publishconfig_free(ptr >>> 0, 1));
/**
 * Configuration for publishing
 */
export class PublishConfig {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PublishConfigFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_publishconfig_free(ptr, 0);
    }
    /**
     * @returns {boolean}
     */
    get include_backlinks() {
        const ret = wasm.publishconfig_include_backlinks(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get include_graph_view() {
        const ret = wasm.publishconfig_include_graph_view(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} include
     */
    set include_backlinks(include) {
        wasm.publishconfig_set_include_backlinks(this.__wbg_ptr, include);
    }
    /**
     * @param {boolean} include
     */
    set include_graph_view(include) {
        wasm.publishconfig_set_include_graph_view(this.__wbg_ptr, include);
    }
    /**
     * @param {string} input_dir
     * @param {string} output_dir
     */
    constructor(input_dir, output_dir) {
        const ptr0 = passStringToWasm0(input_dir, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(output_dir, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.publishconfig_new(ptr0, len0, ptr1, len1);
        this.__wbg_ptr = ret >>> 0;
        PublishConfigFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    get theme() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publishconfig_theme(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export4(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} theme
     */
    set theme(theme) {
        const ptr0 = passStringToWasm0(theme, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.publishconfig_set_theme(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) PublishConfig.prototype[Symbol.dispose] = PublishConfig.prototype.free;

const PublishStatsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_publishstats_free(ptr >>> 0, 1));
/**
 * Publishing statistics
 */
export class PublishStats {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PublishStatsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_publishstats_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get page_count() {
        const ret = wasm.__wbg_get_publishstats_page_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set page_count(arg0) {
        wasm.__wbg_set_publishstats_page_count(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get total_blocks() {
        const ret = wasm.__wbg_get_publishstats_total_blocks(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set total_blocks(arg0) {
        wasm.__wbg_set_publishstats_total_blocks(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get total_links() {
        const ret = wasm.__wbg_get_publishstats_total_links(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set total_links(arg0) {
        wasm.__wbg_set_publishstats_total_links(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get orphan_pages() {
        const ret = wasm.__wbg_get_publishstats_orphan_pages(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set orphan_pages(arg0) {
        wasm.__wbg_set_publishstats_orphan_pages(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) PublishStats.prototype[Symbol.dispose] = PublishStats.prototype.free;

export function __wbg_Error_e83987f665cf5504(arg0, arg1) {
    const ret = Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbg_String_8f0eb39a4a4c2f66(arg0, arg1) {
    const ret = String(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg___wbindgen_boolean_get_6d5a1ee65bab5f68(arg0) {
    const v = getObject(arg0);
    const ret = typeof(v) === 'boolean' ? v : undefined;
    return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
};

export function __wbg___wbindgen_debug_string_df47ffb5e35e6763(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg___wbindgen_in_bb933bd9e1b3bc0f(arg0, arg1) {
    const ret = getObject(arg0) in getObject(arg1);
    return ret;
};

export function __wbg___wbindgen_is_function_ee8a6c5833c90377(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

export function __wbg___wbindgen_is_object_c818261d21f283a4(arg0) {
    const val = getObject(arg0);
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export function __wbg___wbindgen_is_undefined_2d472862bd29a478(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
};

export function __wbg___wbindgen_jsval_loose_eq_b664b38a2f582147(arg0, arg1) {
    const ret = getObject(arg0) == getObject(arg1);
    return ret;
};

export function __wbg___wbindgen_number_get_a20bf9b85341449d(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

export function __wbg___wbindgen_string_get_e4f06c90489ad01b(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg___wbindgen_throw_b855445ff6a94295(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbg__wbg_cb_unref_2454a539ea5790d9(arg0) {
    getObject(arg0)._wbg_cb_unref();
};

export function __wbg_call_525440f72fbfc0ea() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_call_e762c39fa8ea36bf() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_error_7534b8e9a36f1ab4(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_export4(deferred0_0, deferred0_1, 1);
    }
};

export function __wbg_get_7bed016f185add81(arg0, arg1) {
    const ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
};

export function __wbg_get_efcb449f58ec27c2() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_get_with_ref_key_1dc361bd10053bfe(arg0, arg1) {
    const ret = getObject(arg0)[getObject(arg1)];
    return addHeapObject(ret);
};

export function __wbg_instanceof_ArrayBuffer_70beb1189ca63b38(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Uint8Array_20c8e73002f7af98(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_length_69bca3cb64fc8748(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

export function __wbg_length_cdd215e10d9dd507(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

export function __wbg_log_9ecffb3800d9e51f(arg0, arg1) {
    console.log(getStringFromWasm0(arg0, arg1));
};

export function __wbg_new_1acc0b6eea89d040() {
    const ret = new Object();
    return addHeapObject(ret);
};

export function __wbg_new_3c3d849046688a66(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wasm_bindgen_func_elem_2869(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return addHeapObject(ret);
    } finally {
        state0.a = state0.b = 0;
    }
};

export function __wbg_new_5a79be3ab53b8aa5(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_new_8a6f238a6ece86ea() {
    const ret = new Error();
    return addHeapObject(ret);
};

export function __wbg_new_e17d9f43105b08be() {
    const ret = new Array();
    return addHeapObject(ret);
};

export function __wbg_new_no_args_ee98eee5275000a4(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbg_prototypesetcall_2a6620b6922694b2(arg0, arg1, arg2) {
    Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), getObject(arg2));
};

export function __wbg_queueMicrotask_34d692c25c47d05b(arg0) {
    const ret = getObject(arg0).queueMicrotask;
    return addHeapObject(ret);
};

export function __wbg_queueMicrotask_9d76cacb20c84d58(arg0) {
    queueMicrotask(getObject(arg0));
};

export function __wbg_read_dir_recursive_13bb354155a7d229() { return handleError(function (arg0, arg1) {
    const ret = read_dir_recursive(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_resolve_caf97c30b83f7053(arg0) {
    const ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_set_3f1d0b984ed272ed(arg0, arg1, arg2) {
    getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
};

export function __wbg_set_c213c871859d6500(arg0, arg1, arg2) {
    getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
};

export function __wbg_stack_0ed75d68575b0f3c(arg0, arg1) {
    const ret = getObject(arg1).stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_static_accessor_GLOBAL_89e1d9ac6a1b250e() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_static_accessor_GLOBAL_THIS_8b530f326a9e48ac() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_static_accessor_SELF_6fdf4b64710cc91b() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_static_accessor_WINDOW_b45bfc5a37f6cfa2() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_then_4f46f6544e6b4a28(arg0, arg1) {
    const ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_then_70d05cf780a18d77(arg0, arg1, arg2) {
    const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

export function __wbg_write_file_422f1a347a94b944() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = write_file(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_cast_2241b6af4c4b2941(arg0, arg1) {
    // Cast intrinsic for `Ref(String) -> Externref`.
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbindgen_cast_4625c577ab2ec9ee(arg0) {
    // Cast intrinsic for `U64 -> Externref`.
    const ret = BigInt.asUintN(64, arg0);
    return addHeapObject(ret);
};

export function __wbindgen_cast_c060e19e7a983f38(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 55, function: Function { arguments: [Externref], shim_idx: 56, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.__wasm_bindgen_func_elem_495, __wasm_bindgen_func_elem_510);
    return addHeapObject(ret);
};

export function __wbindgen_cast_d6cd19b81560fd6e(arg0) {
    // Cast intrinsic for `F64 -> Externref`.
    const ret = arg0;
    return addHeapObject(ret);
};

export function __wbindgen_object_clone_ref(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

