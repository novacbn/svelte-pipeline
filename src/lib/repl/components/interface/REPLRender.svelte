<script lang="ts">
    import type {SvelteComponent} from "svelte";
    import {createEventDispatcher, tick} from "svelte";

    import type {
        IPipelineContext,
        IPipelineError,
        IPipelineImports,
        IPipelineValidated,
    } from "../../../stores/pipeline";
    import {PIPELINE_RESULT_TYPES} from "../../../stores/pipeline";
    import type {IPipelineSvelteEvaluated} from "../../../stores/svelte";
    import {pipeline_svelte} from "../../../stores/svelte";

    import REPLComponent from "../inserts/REPLComponent.svelte";
    import REPLStylesheet from "../inserts/REPLStylesheet.svelte";

    const dispatch = createEventDispatcher();

    let _class = "";
    export let style = "";
    export {_class as class};

    export let element: HTMLElement | undefined = undefined;

    export let dev: boolean = false;
    export let context: IPipelineContext = {};
    export let imports: IPipelineImports = {};
    export let value: string = "";

    $: store = pipeline_svelte({
        compiler: {
            dev,
            generate: "dom",
            name: "App",
            filename: "App.svelte",
        },
        context,
        imports,
    });
    $: if (value) $store = value;

    let Component: typeof SvelteComponent | null, stylesheet: string;
    async function evaluation_update(
        result: IPipelineSvelteEvaluated | IPipelineError | IPipelineValidated | null
    ) {
        // NOTE: Compiling could finish before mount, preventing events being
        // bubbled up the tree properly. So we need to defer
        await tick();
        dispatch("evaluationUpdate");

        if (result) {
            if (result.type === PIPELINE_RESULT_TYPES.error) {
                const {message} = result;

                dispatch("evaluationError", {message});
            } else if (result.type === PIPELINE_RESULT_TYPES.evaluated) {
                Component = result.module.exports.default;
                stylesheet = result.stylesheet;

                dispatch("evaluationCompile", {Component, stylesheet, warnings: []});
            }
        } else {
            (Component = null), (stylesheet = "");
            dispatch("evaluationPass");
        }
    }

    $: evaluation_update($store);

</script>

<div bind:this={element} class="repl-render {_class}" style={style ? style : undefined}>
    {#if stylesheet}
        <REPLStylesheet value={stylesheet} on:stylesheetMount on:stylesheetUpdate />
    {/if}

    {#if value && Component}
        <REPLComponent
            {Component}
            on:componentError
            on:componentMount
            on:componentPass
            on:componentUpdate
        >
            <slot />
        </REPLComponent>
    {/if}
</div>

<style>
    :global(.repl-render) {
        padding: var(--repl-render-padding, 0.5em 1em);
    }

</style>
