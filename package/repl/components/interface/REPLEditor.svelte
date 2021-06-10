<script lang="ts">
    import type {SvelteComponent} from "svelte";
    import {createEventDispatcher, onDestroy, onMount} from "svelte";

    import {InnerText} from "../../actions/inner_text";

    import type {IEditorHighlightElement} from "../../types/editor";

    const dispatch = createEventDispatcher();

    type CodeJar = SvelteComponent;

    export let element: HTMLElement;

    let _class: string = "";
    export let style: string = "";
    export {_class as class};

    export let highlightElement: IEditorHighlightElement | undefined = undefined;
    export let value = "";

    function on_innertext(text: string) {
        value = text;
    }

    onDestroy(() => {
        if (handle) handle.destroy();
    });

    let CodeJar: CodeJar;
    onMount(async () => {
        // @ts-expect-error - HACK: Package not yet typed
        ({CodeJar} = await import("svelte-codejar"));

        dispatch("editorImported");
    });

    // HACK: On mobile, for whatever reason, CodeJar (the library not the Svelte Binding), doesn't
    // update the output value until some form of punctuation is inputted. So we're using a workaround
    // with a `MutationObserver` instead.
    //
    // I would rather integrate this here, rather than `svelte-codejar` proper. Incase the CodeJar library
    // is fixed and I wouldn't have to message with `svelte-codejar`
    $: handle = element ? InnerText(element, {on_innertext}) : null;

</script>

{#if CodeJar}
    <svelte:component
        this={CodeJar}
        bind:element
        class="repl-editor {_class}"
        syntax="html"
        style={style ? style : undefined}
        {highlightElement}
        {value}
        withLineNumbers
    />
{:else}
    <slot>Loading code editor...</slot>
{/if}

<style>
    :global(.repl-editor) {
        margin: 0 !important;

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
