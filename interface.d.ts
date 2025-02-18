import { State } from './state';
declare let current: State | null;
declare function setCurrent(state: State): void;
declare function clear(): void;
declare function notify(): number;
export { clear, current, setCurrent, notify };
