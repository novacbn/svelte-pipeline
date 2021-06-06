<script lang="ts">
    import {createEventDispatcher, onDestroy} from "svelte";

    import type {IPipelineContext, IPipelineImports} from "../../../stores/pipeline";

    import type {IMouseSliderAction} from "../../actions/mouse_slider";
    import {mouse_slider} from "../../actions/mouse_slider";

    import type {IEditorHighlightElement} from "../../types/editor";
    import {REPL_ROTATION, REPL_VIEWS} from "../../types/repl";

    import REPLDivider from "../interface/REPLDivider.svelte";
    import REPLEditor from "../interface/REPLEditor.svelte";
    import REPLFrame from "../interface/REPLFrame.svelte";
    import REPLRender from "../interface/REPLRender.svelte";
    import REPLStack from "../interface/REPLStack.svelte";

    const dispatch = createEventDispatcher();

    export let highlightElement: IEditorHighlightElement;

    export let context: IPipelineContext = {};
    export let imports: IPipelineImports = {};

    export let grabbing: boolean = false;
    export let rotation: REPL_ROTATION = REPL_ROTATION.vertical;
    export let view: REPL_VIEWS = REPL_VIEWS.split;

    export let split: number = 0.5;
    export let value: string = "";

    let divider: HTMLElement | undefined;
    let stack: HTMLElement | undefined;

    function on_move(percentage: number) {
        split = percentage;
    }

    function on_state(state: boolean) {
        grabbing = state;
        dispatch("grabState", {state});
    }

    let handle: IMouseSliderAction | undefined;
    $: {
        if (handle) handle.destroy();
        if (divider && stack) {
            handle = mouse_slider(stack, {
                horizontal,
                on_move,
                on_state,
                target: divider,
            });
        }
    }

    onDestroy(() => {
        if (handle) handle.destroy();
    });

    $: horizontal = rotation === REPL_ROTATION.horizontal ? true : undefined;
    $: grabbing_style = grabbing
        ? "cursor:var(--repl-split-cursor-grabbing, grabbing);"
        : undefined;

    $: split_style = horizontal
        ? `width:${view == REPL_VIEWS.editor ? 100 : split * 100}%;`
        : `height:${view == REPL_VIEWS.editor ? 100 : split * 100}%;`;

</script>

<REPLStack bind:element={stack} class="repl-split" style={grabbing_style} {horizontal}>
    <REPLFrame class="repl-frame-editor" hidden={view === REPL_VIEWS.render} style={split_style}>
        <REPLEditor {highlightElement} bind:value on:editorImported>
            <slot name="editor-loading" />
        </REPLEditor>
    </REPLFrame>

    {#if view === REPL_VIEWS.split}
        <REPLDivider bind:element={divider} horizontal={horizontal ? undefined : true} />
    {/if}

    <REPLFrame class="repl-frame-render" hidden={view === REPL_VIEWS.editor}>
        <REPLRender {context} {imports} {value} on:error on:evaluate on:renderUpdate>
            <slot name="render-loading" />
        </REPLRender>
    </REPLFrame>
</REPLStack>

<style>
    :global(.repl-split > .repl-frame-render) {
        flex-grow: 1;
    }

</style>
