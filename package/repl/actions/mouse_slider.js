export function mouse_slider(element, options) {
    // TODO: Touch support?
    let { horizontal = false, on_move, on_state, target = element } = options;
    let grabbing = false;
    function on_mousedown(event) {
        const { button } = event;
        if (button === 0) {
            grabbing = true;
            if (on_state)
                on_state(true);
        }
    }
    function on_mouseup(event) {
        if (grabbing) {
            grabbing = false;
            if (on_state)
                on_state(false);
        }
    }
    function on_mousemove(event) {
        if (!grabbing)
            return;
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
        update(options) {
            target.removeEventListener("mousedown", on_mousedown);
            ({ horizontal = false, on_move, on_state, target = element } = options);
            target.addEventListener("mousedown", on_mousedown);
        },
        destroy() {
            element.removeEventListener("mouseup", on_mouseup);
            element.removeEventListener("mousemove", on_mousemove);
            target.removeEventListener("mousedown", on_mousedown);
        },
    };
}
