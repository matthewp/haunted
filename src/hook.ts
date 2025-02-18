import { current, notify } from './interface';
import { State } from './state';
import { hookSymbol } from './symbols';

abstract class Hook<P extends unknown[] = unknown[], R = unknown, H = unknown> {
  id: number;
  state: State<H>;

  constructor(id: number, state: State<H>) {
    this.id = id;
    this.state = state;
  }

  abstract update(...args: P): R;
  teardown?(): void;
}

interface CustomHook<P extends unknown[] = unknown[], R = unknown, H = unknown> {
  new (id: number, state: State<H>, ...args: P): Hook<P, R, H>;
}

function use<P extends unknown[], R, H = unknown>(Hook: CustomHook<P, R, H>, ...args: P): R {
  let id = notify();
  let hooks = current![hookSymbol];

  let hook = hooks.get(id) as Hook<P, R, H> | undefined;
  if(!hook) {
    hook = new Hook(id, current as State<H>, ...args);
    hooks.set(id, hook);
  }

  return hook.update(...args);
}

function hook<P extends unknown[], R, H = unknown>(Hook: CustomHook<P, R, H>): (...args: P) => R {
  return use.bind<null, [CustomHook<P, R, H>], P, R>(null, Hook);
}

export { hook, Hook };
