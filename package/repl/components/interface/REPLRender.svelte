<script lang="ts">
    import type {SvelteComponent} from "svelte";
    import {createEventDispatcher} from "svelte";

    import type {IPipelineContext, IPipelineImports} from "../../../stores/pipeline";
    import {PIPELINE_RESULT_TYPES} from "../../../stores/pipeline";
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
    $: {
        dispatch("renderUpdate");

        const result = $store;
        if (result) {
            if (result.type === PIPELINE_RESULT_TYPES.error) {
                const {message} = result;

                dispatch("error", {message});
            } else if (result.type === PIPELINE_RESULT_TYPES.evaluated) {
                Component = result.module.exports.default;
                stylesheet = result.stylesheet;

                dispatch("evaluate", {Component, stylesheet, warnings: []});
            }
        } else {
            (Component = null), (stylesheet = "");
        }
    }

</script>

<div bind:this={element} class="repl-render {_class}" style={style ? style : undefined}>
    {#if stylesheet}
        <REPLStylesheet value={stylesheet} on:stylesheetMount on:stylesheetUpdate />
    {/if}

    {#if value && Component}
        <REPLComponent {Component} on:componentMount on:componentUpdate on:error>
            <slot />
        </REPLComponent>
    {/if}
</div>

<style>
    :global(.repl-render) {
        padding: var(--repl-render-padding, 0.5em 1em);
    }

</style>
