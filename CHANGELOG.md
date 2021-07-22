# CHANGELOG

## v0.2.0 - 2021/07/??

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
