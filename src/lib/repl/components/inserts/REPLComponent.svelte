<script lang="ts">
    import type {SvelteComponent} from "svelte";
    import {createEventDispatcher, tick} from "svelte";

    export let element: HTMLElement | undefined = undefined;

    let _class: string = "";
    export let style: string = "";
    export {_class as class};

    const dispatch = createEventDispatcher();

    export let Component: typeof SvelteComponent;

    let component: SvelteComponent | null = null;

    async function component_update(Component: typeof SvelteComponent) {
        await tick();
        dispatch("componentUpdate");

        if (Component && element) {
            if (component) {
                component.$destroy();
                component = null;
            }

            try {
                component = new Component({target: element});
                dispatch("componentMount");
            } catch (err) {
                dispatch("componentError", {message: err.message});
            }
        } else dispatch("componentPass");
    }

    $: component_update(Component);
</script>

<!--
    NOTE: Doing this instead of `<svelte:component>` to support Exception capturing
-->

<div bind:this={element} class="repl-component {_class}" {style}>
    {#if !component}
        <slot />
    {/if}
</div>
