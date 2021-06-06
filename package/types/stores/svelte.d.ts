import type { SvelteComponent } from "svelte";
import type { CompileOptions } from "svelte/types/compiler/interfaces";
import type { IPipelineModule, IPipelineEvaluated, IPipelineStore, IPipelineOptions } from "./pipeline";
declare type ISvelteExport = {
    [key: string]: any;
    default: typeof SvelteComponent;
};
export interface IPipelineSvelteModule extends IPipelineModule<ISvelteExport> {
}
export interface IPipelineSvelteOptions extends IPipelineOptions {
    compiler: CompileOptions;
}
export interface IPipelineSvelteEvaluated extends IPipelineEvaluated<ISvelteExport> {
    stylesheet: string;
}
export interface IPipelineSvelteStore extends IPipelineStore<ISvelteExport, IPipelineSvelteEvaluated> {
}
export declare function validate_svelte(script: string): [boolean, string?];
export declare function pipeline_svelte(options?: Partial<IPipelineSvelteOptions>): IPipelineSvelteStore;
export {};
