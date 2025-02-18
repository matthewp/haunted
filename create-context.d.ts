import { ComponentConstructor, ComponentCreator } from './component';
interface ConsumerProps<T> {
    render: (value: T) => unknown;
}
interface Creator {
    <T>(defaultValue: T): Context<T>;
}
interface Context<T> {
    Provider: ComponentConstructor<{}>;
    Consumer: ComponentConstructor<ConsumerProps<T>>;
    defaultValue: T;
}
interface ContextDetail<T> {
    Context: Context<T>;
    callback: (value: T) => void;
    value: T;
    unsubscribe?: (this: Context<T>) => void;
}
declare function makeContext(component: ComponentCreator): Creator;
export { makeContext, Creator as ContextCreator, Context, ContextDetail };
