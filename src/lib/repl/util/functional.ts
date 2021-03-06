export function debounce<F extends (...args: any[]) => void | Promise<void>>(
    func: F,
    duration: number = 0
): (...args: Parameters<F>) => void | Promise<void> {
    let destroy: (() => void) | null;

    return (...args: any[]) => {
        if (destroy) {
            destroy();
            destroy = null;
        }

        destroy = timeout(() => func(...args), duration);
    };
}

export function timeout(callback: () => void, duration: number = 0): () => void {
    const identifier = setTimeout(() => callback(), duration);

    return () => clearTimeout(identifier);
}
