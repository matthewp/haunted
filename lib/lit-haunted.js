import { html, render } from 'lit-html';
import haunted from './core.js';
import { makeVirtual } from './virtual.js';

const { Scheduler, component, createContext } = haunted({ render });

const virtual = makeVirtual(Scheduler);

export {
  component,
  createContext,
  virtual,
  html,
  render
};
