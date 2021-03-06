import * as svelte from "svelte";
import { compile } from "svelte/compiler";
import * as svelte_internal from "svelte/internal";
import * as svelte_store from "svelte/store";
import { PIPELINE_MODES, PIPELINE_RESULT_TYPES, evaluate_code, make_require, validate_code, } from "./pipeline";
import { PIPELINE_JAVASCRIPT_CONTEXT, PIPELINE_JAVASCRIPT_IMPORTS } from "./javascript";
const { onDestroy, onMount, afterUpdate, beforeUpdate, createEventDispatcher, getContext, setContext, tick, } = svelte;
const { derived, readable, writable } = svelte_store;
const PIPELINE_SVELTE_CONTEXT = {
    ...PIPELINE_JAVASCRIPT_CONTEXT,
    onMount,
    onDestroy,
    createEventDispatcher,
    afterUpdate,
    beforeUpdate,
    derived,
    getContext,
    readable,
    setContext,
    tick,
    writable,
};
const PIPELINE_SVELTE_IMPORTS = {
    ...PIPELINE_JAVASCRIPT_IMPORTS,
    svelte: svelte,
    "svelte/internal": svelte_internal,
    "svelte/store": svelte_store,
};
// TODO: meh, repeated code
function PipelineSvelteOptions(options = {}) {
    const { compiler = {}, context = {}, imports = {}, mode = PIPELINE_MODES.evaluate } = options;
    const require = make_require({ ...PIPELINE_SVELTE_IMPORTS, ...imports });
    return {
        mode,
        imports: {},
        compiler: {
            ...compiler,
            css: false,
            format: "cjs",
        },
        context: {
            ...PIPELINE_SVELTE_CONTEXT,
            ...context,
            require,
        },
    };
}
export function validate_svelte(script) {
    try {
        compile(script, {
            css: false,
            format: "cjs",
            generate: false,
        });
    }
    catch (err) {
        return [false, err.message];
    }
    return [true];
}
export function pipeline_svelte(options) {
    const { compiler, context, mode } = PipelineSvelteOptions(options);
    const writable_store = writable("");
    const derived_store = derived(writable_store, (script) => {
        if (!script)
            return null;
        // TODO: Return warnings
        let [validated, message] = validate_svelte(script);
        if (!validated)
            return { message, type: PIPELINE_RESULT_TYPES.error };
        if (mode === PIPELINE_MODES.validate) {
            return { type: PIPELINE_RESULT_TYPES.validated };
        }
        const { css, js } = compile(script, compiler);
        [validated, message] = validate_code(js.code);
        if (!validated)
            return { message, type: PIPELINE_RESULT_TYPES.error };
        const [evaluated, module] = evaluate_code(js.code, context);
        if (!evaluated) {
            return { message: module, type: PIPELINE_RESULT_TYPES.error };
        }
        return {
            module,
            stylesheet: css.code,
            type: PIPELINE_RESULT_TYPES.evaluated,
        };
    });
    return {
        set: writable_store.set,
        subscribe: derived_store.subscribe,
        update: writable_store.update,
    };
}
