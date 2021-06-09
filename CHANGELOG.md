# CHANGELOG

## v0.1.1 - UNRELEASED

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

## v0.1.0 - 06/05/2021

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
