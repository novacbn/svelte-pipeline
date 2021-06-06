import { derived, writable } from "svelte/store";
import { PIPELINE_MODES, PIPELINE_RESULT_TYPES, evaluate_code, make_require, validate_code, } from "./pipeline";
export const PIPELINE_JAVASCRIPT_CONTEXT = {};
export const PIPELINE_JAVASCRIPT_IMPORTS = {};
function PipelineOptions(options = {}) {
    const { context = {}, imports = {}, mode = PIPELINE_MODES.evaluate } = options;
    const require = make_require({ ...PIPELINE_JAVASCRIPT_IMPORTS, ...imports });
    return {
        mode,
        imports: {},
        context: {
            ...PIPELINE_JAVASCRIPT_CONTEXT,
            ...context,
            require,
        },
    };
}
export function pipeline_javascript(options) {
    const { context, mode } = PipelineOptions(options);
    const writable_store = writable("");
    const derived_store = derived(writable_store, (script) => {
        if (!script)
            return null;
        const [validated, message] = validate_code(script);
        if (!validated)
            return { message, type: PIPELINE_RESULT_TYPES.error };
        if (mode === PIPELINE_MODES.validate) {
            return { type: PIPELINE_RESULT_TYPES.validated };
        }
        const [evaluated, module] = evaluate_code(script, context);
        if (!evaluated) {
            return { message: module, type: PIPELINE_RESULT_TYPES.error };
        }
        return {
            module: module,
            type: PIPELINE_RESULT_TYPES.evaluated,
        };
    });
    return {
        set: writable_store.set,
        subscribe: derived_store.subscribe,
        update: writable_store.update,
    };
}
