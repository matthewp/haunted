import { html, render } from "lit-html";
import haunted from "./core";
import { makeVirtual } from "./virtual";

const { component, createContext } = haunted({ render });

const virtual = makeVirtual();

export { component, createContext, virtual, html, render };
