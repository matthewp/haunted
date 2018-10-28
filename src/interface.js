let current;
let currentId = 0;

function setCurrent(element) {
  current = element;
}

function clear() {
  current = null;
  currentId = 0;
}

function notify() {
  let id = currentId;
  currentId++;
  return id;
}

export { clear, current, setCurrent, notify }