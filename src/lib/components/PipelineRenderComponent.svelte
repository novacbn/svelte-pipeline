<script lang="ts">
    import type {SvelteComponent} from "svelte";
    import {createEventDispatcher, getAllContexts} from "svelte";

    import {component} from "../actions/component";
    import {stylesheet} from "../actions/stylesheet";

    import type {IPipelineError, IPipelineValidated} from "../stores/pipeline";
    import {PIPELINE_RESULT_TYPES} from "../stores/pipeline";
    import type {IPipelineSvelteEvaluated, IPipelineSvelteStore} from "../stores/svelte";

    type $$Events = {
        destroy: CustomEvent<{component: SvelteComponent}>;

        error: CustomEvent<{error: Error}>;

        mount: CustomEvent<{component: SvelteComponent}>;
    };

    const dispatch = createEventDispatcher();

    export let element: HTMLDivElement | undefined = undefined;

    let _class: string = "";
    export let style: string | undefined = undefined;
    export {_class as class};

    export let context: Map<any, any> = getAllContexts();
    export let pipeline: IPipelineSvelteStore;

    let evaluation: IPipelineSvelteEvaluated | null = null;

    function on_component_destroy(component: SvelteComponent): void {
        dispatch("destroy", {component});
    }

    function on_component_error(error: Error): void {
        dispatch("error", {error});
    }

    function on_component_mount(component: SvelteComponent): void {
        dispatch("mount", {component});
    }

    function on_pipeline_update(
        _evaluation: IPipelineSvelteEvaluated | IPipelineError | IPipelineValidated | null
    ): void {
        if (!_evaluation) return;

        if (_evaluation.type === PIPELINE_RESULT_TYPES.error) {
            const err = new EvalError(_evaluation.message);

            dispatch("error", {error: err});
        } else if (_evaluation.type === PIPELINE_RESULT_TYPES.evaluated) evaluation = _evaluation;
    }

    $: on_pipeline_update($pipeline);
</script>

<div
    bind:this={element}
    class="pipeline-render-component {_class}"
    {style}
    use:stylesheet={{
        stylesheet: evaluation?.stylesheet ?? undefined,
    }}
    use:component={{
        on_destroy: on_component_destroy,
        on_error: on_component_error,
        on_mount: on_component_mount,
        context,
        Component: evaluation?.module.exports.default ?? undefined,
    }}
/>

<style>
    .pipeline-render-component {
        position: relative;

        contain: strict;
        contain: strict style;

        overflow: auto;
    }
</style>
