import { html, render } from 'lit-html';
import haunted from './core.js';
import { makeVirtual } from './virtual.js';

const { Lifecycle, component, createContext } = haunted({
  render(what, where) {
    render(what, where);
  }
});

const virtual = makeVirtual(Lifecycle);

export {
  component,
  createContext,
  virtual,
  html,
  render
};