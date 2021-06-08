export function mouse_slider(element, options) {
    let { horizontal = false, on_move, on_state, target = element } = options;
    let grabbing = false;
    function get_touch_position(event) {
        if ("touches" in event) {
            const [touch] = event.touches;
            return [touch.clientX, touch.clientY];
        }
        return [event.clientX, event.clientY];
    }
    function is_touching(event) {
        if ("button" in event) {
            return event.button === 0;
        }
        else if ("touches" in event) {
            // TODO: What would be the proper check for this? And to
            // detect long presses or something?
            return event.touches.length > 0;
        }
        return false;
    }
    function on_inputdown(event) {
        if (is_touching(event)) {
            grabbing = true;
            if (on_state)
                on_state(true);
        }
    }
    function on_inputup(event) {
        if (grabbing) {
            grabbing = false;
            if (on_state)
                on_state(false);
        }
    }
    function on_inputmove(event) {
        if (!grabbing)
            return;
        event.preventDefault();
        const rect = element.getBoundingClientRect();
        const [client_x, client_y] = get_touch_position(event);
        const cursor = horizontal ? client_x : client_y;
        const minimum = horizontal ? rect.left : rect.top;
        const maximum = horizontal ? rect.right : rect.bottom;
        const size = maximum - minimum;
        const position = cursor - minimum;
        on_move(position / size);
    }
    element.addEventListener("mouseup", on_inputup);
    element.addEventListener("touchend", on_inputup);
    element.addEventListener("mousemove", on_inputmove);
    element.addEventListener("touchmove", on_inputmove);
    target.addEventListener("mousedown", on_inputdown);
    target.addEventListener("touchstart", on_inputdown);
    return {
        update(options) {
            target.removeEventListener("mousedown", on_inputdown);
            ({ horizontal = false, on_move, on_state, target = element } = options);
            target.addEventListener("mousedown", on_inputdown);
        },
        destroy() {
            element.removeEventListener("mouseup", on_inputup);
            element.removeEventListener("mousemove", on_inputmove);
            target.removeEventListener("mousedown", on_inputdown);
        },
    };
}
