import { html, render } from 'lit-html';
import haunted from './core.js';
import { makeVirtual } from './virtual.js';

const { Container, component, createContext } = haunted({
  render(what, where) {
    render(what, where);
  }
});

const virtual = makeVirtual(Container);

export {
  component,
  createContext,
  virtual,
  html,
  render
};