import { GenericRenderer, RenderFunction } from './core';
interface Renderer<P extends object> extends GenericRenderer<HTMLElement, P> {
    (this: Component<P>, host: Component<P>): unknown | void;
    observedAttributes?: (keyof P)[];
}
declare type Component<P extends object> = HTMLElement & P;
declare type Constructor<P extends object> = new (...args: unknown[]) => Component<P>;
interface Creator {
    <P extends object>(renderer: Renderer<P>): Constructor<P>;
    <P extends object>(renderer: Renderer<P>, options: Options<P>): Constructor<P>;
    <P extends object>(renderer: Renderer<P>, baseElement: Constructor<{}>, options: Omit<Options<P>, 'baseElement'>): Constructor<P>;
}
interface Options<P> {
    baseElement?: Constructor<{}>;
    observedAttributes?: (keyof P)[];
    useShadowDOM?: boolean;
    shadowRootInit?: ShadowRootInit;
}
declare function makeComponent(render: RenderFunction): Creator;
export { makeComponent, Component, Constructor as ComponentConstructor, Creator as ComponentCreator };
