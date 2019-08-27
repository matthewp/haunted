import { html, render, TemplateResult } from 'lit-html';
import { DirectiveFactory } from 'lit-html/lib/directive';
export { html, render, TemplateResult, DirectiveFactory }

export type ComponentLike = HTMLElement | ShadowRoot;
export type ComponentType<P, T extends ComponentLike = HTMLElement> = new(...args: any[]) => T & P;

type Options = {
  useShadowDOM: boolean,
  shadowRootInit?: {
    mode?: string
    delegatesFocus?: boolean,
  }
}

export function component<P, T extends ComponentLike = HTMLElement>(
  renderer: (this: T, el: P & T) => TemplateResult | void,
  BaseElement?: new(...args: any[]) => T,
  options?: Options): ComponentType<P, T>;
export function component<P, T extends ComponentLike = HTMLElement>(
  renderer: (this: T, el: P & T) => TemplateResult | void,
  options?: Options & { baseElement: new(...args: any[]) => T} ): ComponentType<P, T>;

export function useCallback<T extends Function>(fn: T, inputs: any[]): T;

export function useEffect(fn: () => void | VoidFunction, inputs?: any[]): void;

export type StateUpdater<T> = (value: T | ((state?: T) => T)) => void;
export function useState<T>(intialValue?: T): [T, StateUpdater<T>];

export function useReducer<S = any, A = any>(reducer: (state: S, action: A) => S, initialState: S): [S, (action: A) => void];

export function useMemo<T>(fn: () => T, values: any[]): T;

export function useRef<T>(initialValue: T): { current: T};

export function virtual<P, T extends ComponentLike = HTMLElement>(renderer: (this: T, el: P) => TemplateResult | void): () => DirectiveFactory;

export interface Context<T> {
    Provider: ComponentType<T>;
    Consumer: ComponentType<T>;
    defaultValue: T;
}
export function createContext<T = any>(defaultValue: T): Context<T>
export function useContext<T>(Context: Context<T>): T

export class Hook<T extends ComponentLike = HTMLElement> {
    id: number;
    el: T;
    constructor(id: number,  el: T);
}

interface HookWithLifecycle<T extends ComponentLike = HTMLElement, P extends any[] = null, R = void> extends Hook<T> {
    update?(...args: P): R;
    teardown?(): void;
}

export function hook<T extends ComponentLike = HTMLElement>(Hook: new(id: number, el: T) => Hook<T>): () => void;
export function hook<T extends ComponentLike = HTMLElement, P extends any[] = void[], R = void>(Hook: new (id: number, el: T, ...args: P) => HookWithLifecycle<T, P, R>): (...args: P) => R;

