let current;
let currentId = 0;
function setCurrent(state) {
    current = state;
}
function clear() {
    current = null;
    currentId = 0;
}
function notify() {
    return currentId++;
}
export { clear, current, setCurrent, notify };
