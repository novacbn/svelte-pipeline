import type {Readable} from "svelte/store";

export enum PIPELINE_MODES {
    evaluate = "MODE_EVALUATE",

    validate = "MODE_VALIDATE",
}

export enum PIPELINE_RESULT_TYPES {
    error = "RESULT_ERROR",

    evaluated = "RESULT_EVALUATED",

    validated = "RESULT_VALIDATED",
}

export type IPipelineRequire = (name: string) => any;

export type IPipelineUpdater = (value: string) => string;

export interface IPipelineContext {
    [key: string]: any;
}

export interface IPipelineImports {
    [key: string]: any;
}

export interface IPipelineModule<T = any> {
    exports: T;
}

export interface IPipelineOptions {
    context: IPipelineContext;

    imports: IPipelineImports;

    mode: PIPELINE_MODES;
}

export interface IPipelineResult {
    type: PIPELINE_RESULT_TYPES;
}

export interface IPipelineEvaluated<T> extends IPipelineResult {
    module: IPipelineModule<T>;

    type: PIPELINE_RESULT_TYPES.evaluated;
}

export interface IPipelineError extends IPipelineResult {
    message: string;

    type: PIPELINE_RESULT_TYPES.error;
}

export interface IPipelineValidated extends IPipelineResult {
    type: PIPELINE_RESULT_TYPES.validated;
}

// HACK: Since the `Writable` uses the `T` generic for I/O on `set` / `update`, we
// need to just redefine it here ourselves
export interface IPipelineStore<T, Evaluated = IPipelineEvaluated<T>>
    extends Readable<IPipelineError | Evaluated | IPipelineValidated | null> {
    set(value: string): void;

    update(updater: IPipelineUpdater): void;
}

export function evaluate_code<T = any>(
    script: string,
    context: IPipelineContext
): [boolean, IPipelineModule<T> | string] {
    const keys = Object.keys(context);
    const values = Object.values(context);

    // @ts-ignore
    const module: IPipelineModule<T> = {exports: {}};

    Object.seal(module);

    try {
        const func = new Function(
            ...keys,
            "module",
            "exports",
            `return (function () {
                "use strict";
                ${script}
            })`
        )(...values, module, module.exports);

        func();
    } catch (err) {
        return [false, err.message];
    }

    return [true, module];
}

export function make_require(imports: IPipelineImports = {}): IPipelineRequire {
    return (name) => {
        if (name in imports) return imports[name];
        throw new ReferenceError(`bad argument #0 to 'require' (module '${name}' not found)`);
    };
}

export function validate_code(script: string): [boolean, string?] {
    try {
        new Function(script);
    } catch (err) {
        return [false, err.message];
    }

    return [true];
}
