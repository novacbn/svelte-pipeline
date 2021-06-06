<script lang="ts">
    export let element: HTMLElement | undefined = undefined;

    let _class: string = "";
    export let style: string = "";
    export {_class as class};

    export let horizontal: boolean = false;

</script>

<div
    bind:this={element}
    class="repl-stack {_class}"
    data-horizontal={horizontal ? true : undefined}
    style={style ? style : undefined}
    on:mousedown
    on:mousemove
    on:mouseup
>
    <slot />
</div>

<style>
    :global(.repl-stack) {
        display: flex;

        align-items: stretch;
        justify-content: stretch;

        align-self: stretch;
        justify-self: stretch;

        width: var(--repl-stack-width, 100%);
        height: var(--repl-stack-height, 100%);
    }

    :global(.repl-stack:not([data-horizontal])) {
        flex-direction: column;
    }

    :global(.repl-stack[data-horizontal]) {
        flex-direction: row;
    }

</style>
