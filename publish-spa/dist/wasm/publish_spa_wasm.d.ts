/* tslint:disable */
/* eslint-disable */
/**
 * Get backlinks for a specific page
 */
export function get_backlinks(input_dir: string, page_path: string): Promise<any>;
/**
 * Parse a Logseq graph and return statistics
 */
export function parse_graph(input_dir: string): Promise<any>;
/**
 * Initialize panic hook for better error messages in WASM
 */
export function init(): void;
/**
 * Main publish function - Entry point from JavaScript
 *
 * # Arguments
 * * `config_obj` - JavaScript object containing configuration
 *
 * # Returns
 * Promise that resolves to PublishStats
 */
export function publish(config_obj: any): Promise<any>;
/**
 * Configuration for publishing
 */
export class PublishConfig {
  free(): void;
  [Symbol.dispose](): void;
  constructor(input_dir: string, output_dir: string);
  include_backlinks: boolean;
  include_graph_view: boolean;
  theme: string;
}
/**
 * Publishing statistics
 */
export class PublishStats {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  page_count: number;
  total_blocks: number;
  total_links: number;
  orphan_pages: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_get_publishstats_orphan_pages: (a: number) => number;
  readonly __wbg_get_publishstats_page_count: (a: number) => number;
  readonly __wbg_get_publishstats_total_blocks: (a: number) => number;
  readonly __wbg_get_publishstats_total_links: (a: number) => number;
  readonly __wbg_publishconfig_free: (a: number, b: number) => void;
  readonly __wbg_publishstats_free: (a: number, b: number) => void;
  readonly __wbg_set_publishstats_orphan_pages: (a: number, b: number) => void;
  readonly __wbg_set_publishstats_page_count: (a: number, b: number) => void;
  readonly __wbg_set_publishstats_total_blocks: (a: number, b: number) => void;
  readonly __wbg_set_publishstats_total_links: (a: number, b: number) => void;
  readonly get_backlinks: (a: number, b: number, c: number, d: number) => number;
  readonly init: () => void;
  readonly parse_graph: (a: number, b: number) => number;
  readonly publish: (a: number) => number;
  readonly publishconfig_include_backlinks: (a: number) => number;
  readonly publishconfig_include_graph_view: (a: number) => number;
  readonly publishconfig_new: (a: number, b: number, c: number, d: number) => number;
  readonly publishconfig_set_include_backlinks: (a: number, b: number) => void;
  readonly publishconfig_set_include_graph_view: (a: number, b: number) => void;
  readonly publishconfig_set_theme: (a: number, b: number, c: number) => void;
  readonly publishconfig_theme: (a: number, b: number) => void;
  readonly __wasm_bindgen_func_elem_510: (a: number, b: number, c: number) => void;
  readonly __wasm_bindgen_func_elem_495: (a: number, b: number) => void;
  readonly __wasm_bindgen_func_elem_2869: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_export: (a: number, b: number) => number;
  readonly __wbindgen_export2: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export3: (a: number) => void;
  readonly __wbindgen_export4: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
