import { html, render, TemplateResult, RenderOptions, directive } from 'lit-html';

type RenderFunction = typeof render
type DirectiveFunction = typeof directive

export function component(
    renderer: (el: HTMLElement) => TemplateResult,
    BaseElement?: Function,
    options?: {
        useShadowDOM: boolean
    }
): Function;

export function configureComponent(options: {
    render: RenderFunction
});

export function useCallback(fn: Function, inputs: any[]): Function;

export function useEffect(fn: () => Function | void, inputs?: any[]): void;

export function useState(intialValue?: any): [any, Function];

export function useReducer(reducer: (state: any, action: any) => any, initialState: any): [any, Function];

export function useMemo(fn: Function, values: any[]): any;

export function virtual(renderer: Function): Function;
export const withHooks: typeof virtual;

export function configureVirtual(options: {
    directive: DirectiveFunction,
    render: RenderFunction
}): (renderer: Function) => Function;

interface Context {
    Provider: Function;
    Consumer: Function;
    defaultValue: any;
}
export function createContext(defaultValue: any): Context
export function useContext(Context: Context): any

export function hook(Hook: Function): Function;
export class Hook {
    id: number;
    el: HTMLElement;
}

type LighterHtmlRenderFunction = (node: Element | DocumentFragment, callback: () => DocumentFragment) => void;
export function adaptLighterHtml(render: LighterHtmlRenderFunction): RenderFunction;
