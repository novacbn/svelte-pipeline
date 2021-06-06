<script lang="ts">
    import type {SvelteComponent} from "svelte";
    import {createEventDispatcher, onMount} from "svelte";

    import type {IEditorHighlightElement} from "../../types/editor";

    const dispatch = createEventDispatcher();

    type CodeJar = SvelteComponent;

    let _class: string = "";
    export let style: string = "";
    export {_class as class};

    export let highlightElement: IEditorHighlightElement | undefined = undefined;
    export let value = "";

    let CodeJar: CodeJar;
    onMount(async () => {
        // @ts-expect-error - HACK: Package not yet typed
        ({CodeJar} = await import("svelte-codejar"));

        dispatch("editorImported");
    });

</script>

{#if CodeJar}
    <svelte:component
        this={CodeJar}
        class="repl-editor {_class}"
        syntax="html"
        style={style ? style : undefined}
        bind:value
        {highlightElement}
    />
{:else}
    <slot>Loading code editor...</slot>
{/if}

<style>
    :global(.repl-editor),
    :global(.repl-editor > *) {
        margin: 0 !important;

        width: max-content;
        height: max-content;

        min-width: 100%;
        min-height: 100%;

        overflow: visible !important;
    }

    :global(.repl-editor) {
        padding: var(--repl-editor-padding, 0.5em 1em);

        font-size: var(--repl-editor-font-size, 0.95rem);

        resize: none !important;
    }

    :global(.repl-editor > *) {
        font-family: var(--repl-editor-font-family, monospace);
    }

</style>
