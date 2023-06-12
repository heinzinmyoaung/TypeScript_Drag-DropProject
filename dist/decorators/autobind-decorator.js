export function autobind(_, _2, descriptors) {
    const originalMethod = descriptors.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const bondfn = originalMethod.bind(this);
            return bondfn;
        }
    };
    return adjDescriptor;
}
//# sourceMappingURL=autobind-decorator.js.map