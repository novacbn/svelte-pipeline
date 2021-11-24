<script lang="ts">
    import {createEventDispatcher} from "svelte";

    import {iframe as iframe_action} from "../actions/iframe";

    import type {IPipelineError, IPipelineValidated} from "../stores/pipeline";
    import {PIPELINE_RESULT_TYPES} from "../stores/pipeline";
    import type {IPipelineSvelteEvaluated, IPipelineSvelteStore} from "../stores/svelte";

    type $$Events = {
        destroy: CustomEvent<void>;

        error: CustomEvent<{error: Error}>;

        mount: CustomEvent<void>;
    };

    const dispatch = createEventDispatcher();

    export let element: HTMLDivElement | undefined = undefined;

    let _class: string = "";
    export let style: string | undefined = undefined;
    export {_class as class};

    export let pipeline: IPipelineSvelteStore;

    let evaluation: IPipelineSvelteEvaluated | null = null;

    function on_component_destroy(): void {
        dispatch("destroy");
    }

    function on_component_error(error: Error): void {
        dispatch("error", {error});
    }

    function on_component_mount(): void {
        dispatch("mount");
    }

    function on_pipeline_update(
        _evaluation: IPipelineSvelteEvaluated | IPipelineError | IPipelineValidated | null
    ): void {
        if (!_evaluation) return;
        if (_evaluation.type !== PIPELINE_RESULT_TYPES.evaluated) return;

        // TODO: add "processed" pipeline mode for getting Svelte-generated JS code
    }

    $: on_pipeline_update($pipeline);
</script>

<iframe
    bind:this={element}
    class="pipeline-render-iframe {_class}"
    {style}
    title="Svelte Pipeline Render"
    sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals allow-same-origin"
    use:iframe_action={{
        on_destroy: on_component_destroy,
        on_error: on_component_error,
        on_mount: on_component_mount,
        script: "",
        stylesheet: "",
    }}
/>

<style>
    .pipeline-render-iframe {
        border: none;
    }
</style>
