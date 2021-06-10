export function debounce(func, duration = 0) {
    let destroy;
    return (...args) => {
        if (destroy) {
            destroy();
            destroy = null;
        }
        destroy = timeout(() => func(...args), duration);
    };
}
export function timeout(callback, duration = 0) {
    const identifier = setTimeout(() => callback(), duration);
    return () => clearTimeout(identifier);
}
