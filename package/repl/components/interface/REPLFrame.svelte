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
        display: block;
        contain: strict;

        min-width: var(--repl-frame-min-width, 15%);
        min-height: var(--repl-frame-min-height, 15%);

        overflow: auto;
    }

    :global(.repl-frame[hidden]) {
        display: none;
    }

</style>
