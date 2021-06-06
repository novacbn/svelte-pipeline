<script lang="ts">
    import type {SvelteComponent} from "svelte";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    export let Component: typeof SvelteComponent;

    let component: SvelteComponent | null = null;
    let element: HTMLElement | undefined = undefined;

    $: {
        if (Component && element) {
            if (component) {
                component.$destroy();
                component = null;
                dispatch("componentUpdate");
            }

            try {
                component = new Component({target: element});
                dispatch("componentMount");
            } catch (err) {
                dispatch("error", {message: err.message});
            }
        }
    }

    $: if (component) component.$set($$props);

</script>

<!--
    NOTE: Doing this instead of `<svelte:component>` to support Exception capturing
-->

<div bind:this={element} class="repl-component">
    {#if !component}
        <slot />
    {/if}
</div>
