import { State } from './state';

let current: State | null;
let currentId = 0;

function setCurrent(state: State): void {
  current = state;
}

function clear(): void {
  current = null;
  currentId = 0;
}

function notify(): number {
  return currentId++;
}

export { clear, current, setCurrent, notify }
