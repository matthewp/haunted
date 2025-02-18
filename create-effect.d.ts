import { State, Callable } from './state';
type Effect = (this: State) => void | VoidFunction | Promise<void>;
declare function createEffect(setEffects: (state: State, cb: Callable) => void): (callback: Effect, values?: unknown[] | undefined) => void;
export { createEffect };
