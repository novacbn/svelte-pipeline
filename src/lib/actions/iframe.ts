import type {IActionHandle} from "./actions";

const TEMPLATE_SRCDOC = () => `<!DOCTYPE html>
<html>
    <head>
        <style data-pipeline-stylesheet="true"></style>

        <script>
            (function (window, document) {
                let component;
                let component_element;
                let stylesheet_element;

                function on_error(error) {
                    const {message, name, stack} = error;

                    window.postMessage(
                        {
                            type: "error",
                            error: {
                                name,
                                message,
                                stack,
                            },
                        },
                        "*"
                    );
                }

                function on_load(event) {
                    component_element = document.querySelector("[data-pipeline-component]");
                    stylesheet_element = document.querySelector("[data-pipeline-stylesheet]");
                }

                function on_message(event) {
                    const {data, origin} = event;
                    const {detail, type} = data;

                    switch (type) {
                        case "component":
                            on_component(origin, detail);
                            break;

                        case "props":
                            on_props(origin, detail);

                        case "stylesheet":
                            on_stylesheet(origin, detail);
                            break;
                    }
                }

                function on_component(origin, detail) {
                    on_destroy(origin, detail);
                    on_stylesheet(origin, detail);
                    on_mount(origin, detail);
                }

                function on_destroy(origin, detail) {
                    if (component) {
                        component.$destroy();
                        component = null;

                        window.postMessage(
                            {
                                type: "destroy",
                            },
                            origin
                        );
                    }
                }

                function on_mount(origin, detail) {
                    const {script} = detail;
                    if (script) {
                        try {
                            Component = eval(script);
                            component = new Component({
                                target: component_element,
                                props: detail.props ?? {},
                            });
                        } catch (err) {
                            on_error(err);
                            return;
                        }

                        window.postMessage(
                            {
                                type: "mount",
                            },
                            origin
                        );
                    }
                }

                function on_props(origin, detail) {
                    if (component) component.$set(detail.props ?? {});
                }

                function on_stylesheet(origin, detail) {
                    if (stylesheet_element) stylesheet_element.innerText = detail.stylesheet ?? "";
                }

                window.addEventListener("error", on_error);
                window.addEventListener("load", on_load);
                window.addEventListener("message", on_message);
            })(window, document);
        </script>
    </head>

    <body data-pipeline-component></body>
</html>
`;

/**
 * Represents the message data sent by the iframe whenever a previous Component is destroyed
 */
interface IDestroyMessage {
    type: "destroy";
}

/**
 * Represents the message data sent by the iframe whenever an error occurs during mounting / runtime
 */
interface IErrorMessage {
    type: "error";

    error: {
        message: string;

        name: string;

        stack: string;
    };
}

/**
 * Represents the message data sent by the iframe whenever a new Component is mounted
 */
interface IMountMessage {
    type: "mount";
}

/**
 * Represents the Svelte Action handle returned by [[iframe]]
 */
export type IIFrameHandle = Required<IActionHandle<IIFrameOptions>>;

/**
 * Represents the typing for the [[IIFrameOptions.on_error]] callback
 */
export type IIFrameErrorCallback = (error: Error) => void;

/**
 * Represents the typings for the [[IIFrameOptions.on_destroy]] / [[IIFrameOptions.on_mount]] callback
 */
export type IIFrameLifecycleCallback = () => void;

/**
 * Represents the options passable to the [[component]] Svelte Action
 */
export interface IIFrameOptions {
    /**
     * Represents the callback that's dispatched right before the previously supplied
     * Svelte Component instance is destroyed
     */
    on_destroy: IIFrameLifecycleCallback;

    /**
     * Represents the callback that's dispatched when the mounting of a new
     * Svelte Component instance has thrown an exception
     */
    on_error: IIFrameErrorCallback;

    /**
     * Represents the callback that's dispatched right after the current Svelte Component
     * instance has been successfully mounted
     */
    on_mount: IIFrameLifecycleCallback;

    /**
     * Represents the optional properties that will be passed into the Component
     */
    props: Record<string, any>;

    /**
     * Represents the compiled script of the Component
     */
    script: string;

    /**
     * Represents the optional stylesheet was extracted from the Component
     */
    stylesheet: string;
}

/**
 *
 *
 * **NOTE**: This is an alternative to `<svelte:component this={Component}>...</svelte:component>` that
 * also supports lifecycle + error handling callbacks, and isolation via `<iframe>`
 *
 * @param element
 * @param options
 * @returns
 */
export function iframe(
    element: HTMLIFrameElement,
    options: Partial<IIFrameOptions> = {}
): IIFrameHandle {
    // TODO: debounce updates
    // TODO: handle Svelte imports
    // TODO: handle third-party imports, (is it possible to do without external scripts?)
    // TODO: handle developer-provided preload script / stylesheet
    let {on_destroy, on_error, on_mount, props = {}, script = "", stylesheet = ""} = options;

    function post_component(): void {
        const content_window = element.contentWindow as Window;

        content_window.postMessage(
            {
                type: "component",

                props,
                script,
                stylesheet,
            },
            location.origin
        );
    }

    function post_props(): void {
        const content_window = element.contentWindow as Window;

        content_window.postMessage(
            {
                type: "props",

                props,
            },
            location.origin
        );
    }

    function post_stylesheet(): void {
        const content_window = element.contentWindow as Window;

        content_window.postMessage(
            {
                type: "stylesheet",

                stylesheet,
            },
            location.origin
        );
    }

    function on_message(event: Event): void {
        const {data} = event as MessageEvent<IDestroyMessage | IErrorMessage | IMountMessage>;
        const {type} = data;

        switch (type) {
            case "destroy":
                if (on_destroy) on_destroy();
                break;

            case "mount":
                if (on_mount) on_mount();
                break;

            case "error":
                if (on_error) {
                    // TODO: construct platform-provided error types
                    const {error} = data as IErrorMessage;
                    const err = new Error(error.message);

                    err.name = error.name;
                    err.stack = error.stack;

                    on_error(err);
                }

                break;
        }
    }

    element.srcdoc = TEMPLATE_SRCDOC();

    (element.contentWindow as Window).addEventListener("load", post_component);
    element.addEventListener("message", on_message);

    return {
        update(options: IIFrameOptions) {
            ({on_destroy, on_error, on_mount} = options);

            if (options.script !== script) {
                ({props = {}, script = "", stylesheet = ""} = options);

                post_component();
            } else {
                if (options.props !== props) {
                    ({props = {}} = options);

                    post_props();
                }

                if (options.stylesheet !== stylesheet) {
                    ({stylesheet = ""} = options);

                    post_stylesheet();
                }
            }
        },

        destroy() {},
    };
}
