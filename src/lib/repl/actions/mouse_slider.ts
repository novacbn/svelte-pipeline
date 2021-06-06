import type {IActionHandle} from "./actions";

export type IMouseSliderAction = IActionHandle<IMouseSliderOptions>;

export interface IMouseSliderOptions {
    horizontal?: boolean;

    on_move: (percentage: number) => void;

    on_state?: (grabbing: boolean) => void;

    target?: HTMLElement;
}

export function mouse_slider(element: HTMLElement, options: IMouseSliderOptions) {
    // TODO: Touch support?

    let {horizontal = false, on_move, on_state, target = element} = options;
    let grabbing = false;

    function on_mousedown(event: MouseEvent) {
        const {button} = event;

        if (button === 0) {
            grabbing = true;
            if (on_state) on_state(true);
        }
    }

    function on_mouseup(event: MouseEvent) {
        if (grabbing) {
            grabbing = false;
            if (on_state) on_state(false);
        }
    }

    function on_mousemove(event: MouseEvent) {
        if (!grabbing) return;

        const rect = element.getBoundingClientRect();
        const cursor = horizontal ? event.clientX : event.clientY;

        const minimum = horizontal ? rect.left : rect.top;
        const maximum = horizontal ? rect.right : rect.bottom;

        const size = maximum - minimum;
        const position = cursor - minimum;

        on_move(position / size);
    }

    element.addEventListener("mouseup", on_mouseup);
    element.addEventListener("mousemove", on_mousemove);
    target.addEventListener("mousedown", on_mousedown);

    return {
        update(options: IMouseSliderOptions) {
            target.removeEventListener("mousedown", on_mousedown);

            ({horizontal = false, on_move, on_state, target = element} = options);

            target.addEventListener("mousedown", on_mousedown);
        },

        destroy() {
            element.removeEventListener("mouseup", on_mouseup);
            element.removeEventListener("mousemove", on_mousemove);
            target.removeEventListener("mousedown", on_mousedown);
        },
    };
}
