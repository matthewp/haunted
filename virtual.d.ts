import { ChildPart } from 'lit/directive.js';
import { GenericRenderer } from './core';
interface Renderer extends GenericRenderer<ChildPart> {
    (this: ChildPart, ...args: unknown[]): unknown | void;
}
declare function makeVirtual(): any;
export { makeVirtual, Renderer as VirtualRenderer };
