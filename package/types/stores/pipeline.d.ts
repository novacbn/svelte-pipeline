import type { Readable } from "svelte/store";
export declare enum PIPELINE_MODES {
    evaluate = "MODE_EVALUATE",
    validate = "MODE_VALIDATE"
}
export declare enum PIPELINE_RESULT_TYPES {
    error = "RESULT_ERROR",
    evaluated = "RESULT_EVALUATED",
    validated = "RESULT_VALIDATED"
}
export declare type IPipelineRequire = (name: string) => any;
export declare type IPipelineUpdater = (value: string) => string;
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
export interface IPipelineStore<T, Evaluated = IPipelineEvaluated<T>> extends Readable<IPipelineError | Evaluated | IPipelineValidated | null> {
    set(value: string): void;
    update(updater: IPipelineUpdater): void;
}
export declare function evaluate_code<T = any>(script: string, context: IPipelineContext): [boolean, IPipelineModule<T> | string];
export declare function make_require(imports?: IPipelineImports): IPipelineRequire;
export declare function validate_code(script: string): [boolean, string?];
