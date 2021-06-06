export var PIPELINE_MODES;
(function (PIPELINE_MODES) {
    PIPELINE_MODES["evaluate"] = "MODE_EVALUATE";
    PIPELINE_MODES["validate"] = "MODE_VALIDATE";
})(PIPELINE_MODES || (PIPELINE_MODES = {}));
export var PIPELINE_RESULT_TYPES;
(function (PIPELINE_RESULT_TYPES) {
    PIPELINE_RESULT_TYPES["error"] = "RESULT_ERROR";
    PIPELINE_RESULT_TYPES["evaluated"] = "RESULT_EVALUATED";
    PIPELINE_RESULT_TYPES["validated"] = "RESULT_VALIDATED";
})(PIPELINE_RESULT_TYPES || (PIPELINE_RESULT_TYPES = {}));
export function evaluate_code(script, context) {
    const keys = Object.keys(context);
    const values = Object.values(context);
    // @ts-ignore
    const module = { exports: {} };
    Object.seal(module);
    try {
        const func = new Function(...keys, "module", "exports", `return (function () {
                "use strict";
                ${script}
            })`)(...values, module, module.exports);
        func();
    }
    catch (err) {
        return [false, err.message];
    }
    return [true, module];
}
export function make_require(imports = {}) {
    return (name) => {
        if (name in imports)
            return imports[name];
        throw new ReferenceError(`bad argument #0 to 'require' (module '${name}' not found)`);
    };
}
export function validate_code(script) {
    try {
        new Function(script);
    }
    catch (err) {
        return [false, err.message];
    }
    return [true];
}
