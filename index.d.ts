import { html, render, TemplateResult } from 'lit-html';    
export { html, render, TemplateResult }    

export function component(renderer: (el: HTMLElement) => TemplateResult, BaseElement?: Function, options?: {
    useShadowDOM: boolean,
    shadowRootInit?: {
        mode?: string
        delegatesFocus?: boolean,
    }
}): Function;

export function useCallback(fn: Function, inputs: any[]): Function;

export function useEffect(fn: () => Function | void, inputs?: any[]): void;

export function useState(intialValue?: any): [any, Function];

export function useReducer(reducer: (state: any, action: any) => any, initialState: any): [any, Function];

export function useMemo(fn: Function, values: any[]): any;

export function withHooks(renderer: Function): Function;
export function virtual(renderer: Function): Function;

interface Context<T> {
    Provider: Function;
    Consumer: Function;
    defaultValue: T;
}
export function createContext<T = any>(defaultValue: T): Context<T>
export function useContext<T>(Context: Context<T>): T

export function hook(Hook: Function): Function;
export class Hook {
    id: number;
    el: HTMLElement;
}
