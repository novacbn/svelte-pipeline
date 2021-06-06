<script lang="ts">
    import {createEventDispatcher, onDestroy, onMount} from "svelte";

    const dispatch = createEventDispatcher();

    export let value: string = "";

    let stylesheet: HTMLStyleElement | undefined = undefined;

    $: if (stylesheet) {
        stylesheet.innerText = value;
        dispatch("stylesheetUpdate");
    }

    onDestroy(() => {
        if (stylesheet) stylesheet.remove();
    });

    onMount(() => {
        stylesheet = document.createElement("style");
        stylesheet.setAttribute("data-repl-stylesheet", "true");

        document.head.appendChild(stylesheet);
        dispatch("stylesheetMount");
    });

</script>

<!--
    NOTE: `<svelte:head><style>...</style></svelte:head>` doesn't support variable
    templating. So we need to manually manage insertion of generated CSS
-->
