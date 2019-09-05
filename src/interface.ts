import { State } from './state';

let current: State | null;
let currentId = 0;

function setCurrent(state: State) {
  current = state;
}

function clear() {
  current = null;
  currentId = 0;
}

function notify() {
  return currentId++;
}

export { clear, current, setCurrent, notify }
