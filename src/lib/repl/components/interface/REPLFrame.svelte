<script lang="ts">
    export let element: HTMLElement | undefined = undefined;

    let _class: string = "";
    export let style: string = "";
    export {_class as class};

    export let hidden: boolean = false;

</script>

<div
    bind:this={element}
    class="repl-frame {_class}"
    hidden={hidden ? true : undefined}
    on:mousedown
    on:mousemove
    on:mouseup
    {style}
>
    <slot />
</div>

<style>
    :global(.repl-frame) {
        display: flex;
        contain: strict;

        align-items: stretch;
        justify-content: stretch;

        min-width: var(--repl-frame-min-width, 15%);
        min-height: var(--repl-frame-min-height, 15%);

        overflow: auto;
    }

    :global(.repl-frame[hidden]) {
        display: none;
    }

    :global(.repl-frame > *) {
        flex-grow: 1;
    }

</style>
