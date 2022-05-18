import { State } from './state';
declare abstract class Hook<P extends unknown[] = unknown[], R = unknown, H = unknown> {
    id: number;
    state: State<H>;
    constructor(id: number, state: State<H>);
    abstract update(...args: P): R;
    teardown?(): void;
}
interface CustomHook<P extends unknown[] = unknown[], R = unknown, H = unknown> {
    new (id: number, state: State<H>, ...args: P): Hook<P, R, H>;
}
declare function hook<P extends unknown[], R, H = unknown>(Hook: CustomHook<P, R, H>): (...args: P) => R;
export { hook, Hook };
