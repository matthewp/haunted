import { ComponentCreator } from './component';
import { ContextCreator } from './create-context';
import { ChildPart } from 'lit/html';
declare type Component<P> = HTMLElement & P;
declare type ComponentOrVirtualComponent<T extends HTMLElement | ChildPart, P extends object> = T extends HTMLElement ? Component<P> : ChildPart;
declare type GenericRenderer<T extends HTMLElement | ChildPart, P extends object = {}> = (this: ComponentOrVirtualComponent<T, P>, ...args: any[]) => unknown | void;
declare type RenderFunction = (result: unknown, container: DocumentFragment | HTMLElement) => void;
interface Options {
    render: RenderFunction;
}
declare function haunted({ render }: Options): {
    component: ComponentCreator;
    createContext: ContextCreator;
};
export { haunted as default, Options, GenericRenderer, RenderFunction, ComponentOrVirtualComponent };
export { useCallback } from './use-callback';
export { useController } from './use-controller';
export { useEffect } from './use-effect';
export { useLayoutEffect } from './use-layout-effect';
export { useState } from './use-state';
export { useReducer } from './use-reducer';
export { useMemo } from './use-memo';
export { useContext } from './use-context';
export { useRef } from './use-ref';
export { hook, Hook } from './hook';
export { BaseScheduler } from './scheduler';
export { State } from './state';
