# CHANGELOG

## v0.3.1 - 2022/03/07

-   `component`

    -   **(BREAKING)** `component(..., {context: Map<string, any>})` — Updated to use `Map` instead of `Record` due to data loss of non-string keys.

-   `PipelineRenderComponent`

    -   `<PipelineRenderComponent context={Map<any, any>}>` — Added support for configuring the rendered Component's available [Svelte Contexts](https://svelte.dev/docs#run-time-svelte-getcontext).

## v0.3.0 - 2021/11/26

-   **(BREAKING)** Changed Component namespace from `import {...} from "@novacbn/svelte-pipeline/repl";` -> `import {...} from "@novacbn/svelte-pipeline/components";`.
-   **(BREAKING)** Removed existing UI Components refocusing library to only rendering resulting compiled Svelte code, no longer providing primitive REPL Components.

-   Added the following Actions / Action Features

    -   `component` — Mounts a Svelte Component inside of the target containing element, providing lifecycle + error events.

        -   `component(..., {on_destroy: (component: SvelteComponent) => void})` — Fires the event right before the previously mounted Component is destroyed.
        -   `component(..., {on_error: (error: Error) => void})` — Fires the event whenever there's an error during mounting.
        -   `component(..., {on_mount: (component: SvelteComponent) => void})` — Fires event event right after a new Component is compiled and mounted.

        -   `component(..., {Component: typeof SvelteComponent})` — Sets the Svelte Component to be mounted.
        -   `component(..., {context: Record<any, any>})` — Sets the Svelte Contexts passed along whenever the Component is mounted.
        -   `component(..., {props: Record<string, any>})` — Sets the properties passed along whenever the Component is mounted.

    -   `stylesheet` — Mounts a new `<style>` element inside of the target containing element, allowing for dynamic styles.

        -   `stylesheet(..., {stylesheet: string})` — Sets the current text value of the `<style>` element.

-   Added the following Components / Component Features

    -   `<PipelineRenderComponent>` — Renders the result of a given `pipeline_svelte` Svelte Store, with [CSS containment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Containment) enabled.

        -   `<PipelineRenderComponent on:destroy={CustomEvent<{component: SvelteComponent}>}>` — Fires the event right before the previously mounted Component is destroyed.
        -   `<PipelineRenderComponent on:error={CustomEvent<{error: Error}>}>` — Fires the event whenever there's a compilation error or an error during mounting.
        -   `<PipelineRenderComponent on:mount={CustomEvent<{component: SvelteComponent}>}>` — Fires event event right after a new Component is compiled and mounted.

        -   `<PipelineRenderComponent class={string}>` — Sets the CSS class names applied to the Component.
        -   `<PipelineRenderComponent style={string}>` — Sets the inline CSS rules applied to the Component.
        -   `<PipelineRenderComponent pipeline={IPipelineSvelteStore} />` — Sets the Svelte Store being listened to for results.

## v0.2.0 - 2021/07/22

-   **(BREAKING)** Published to NPM, reinstall via `npm install @novacbn/svelte-pipeline`.
-   **(BREAKING)** Changed package namespace from `import {...} from "svelte-pipeline";` -> `import {...} from "@novacbn/svelte-pipeline";`.

## v0.1.2 - 2021/06/09

-   Added workaround to `<REPLEditor>` for mobile input
-   Added element bindings `<XXX bind:element={YYY}>` and styling bindings `<XXX class="YYY" style="ZZZ">` to every REPL Component
-   Added a `250ms` debounce to compiling incoming Svelte Component code to `<REPLRender>`

## v0.1.1 - 2021/06/08

-   Updated the following Components

    -   `<REPLComponent>`

        -   Updated `componentUpdate` event to be called pre any changes
        -   Updated to defer to when the Browser is idle to perform mounting and eventing
        -   Change event names `error` -> `componentError`
        -   Added `<REPLComponent on:componentPass>` — Called whenever `componentUpdate` is called but no changed are made

    -   `<REPLEditor>` — Added line numbers
    -   `<REPLRender>`

        -   Added `<REPLRender dev={boolean} />` / `<REPLSplit dev={boolean} />` — Turns the Svelte compiler dev builds on
        -   Added `<REPLRender on:evaluationPass>` — Called whenever `evaluationUpdate` is called but no changed are made
        -   Changed event names `renderUpdate` -> `evaluationUpdate`, `error` -> `evaluationError`, `evaluate` -> `evaluationCompile`
        -   Updated to defer to when the Browser is idle to perform compiling and eventing

    -   `<REPLSplit>`

        -   Added support for touch input moving the split divider
        -   Added support for manual styling via `<REPLSplit class="XXX">` / `<REPLSplit style="XXX">`
        -   Updated to reflect new events

## v0.1.0 - 2021/06/05

-   Added new Components

    -   `import {Split} from "svelte-pipeline/repl";`

        -   Renders a split-pane REPL for Svelte, both horizontal and vertical.
        -   Has the following exports:

            -   `<Split context={Record<string, any>} />` — for setting up globals
            -   `<Split imports={Record<string, any>} />` — for setting up imports
            -   `<Split rotation={REPL_ROTATION} />` — for setting to horizontal / vertical
            -   `<Split view={REPL_VIEWS} />` — for setting to display Editor, Preview, or both panes
            -   `<Split split={number}>` — for setting the `0...1` percentage of how much the Editor takes up the parent container
            -   `<Split value={string}>` — for setting the initial code for the Editor

-   Removed CommonJS / UMD builds, now ESM only due to including Components and using SvelteKit for packaging
-   Typings for Components coming soon, need SvelteKit to support generating those during packaging
