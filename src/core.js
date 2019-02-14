import { commitSymbol, phaseSymbol, updateSymbol, hookSymbol, effectsSymbol, contextSymbol } from './symbols.js';
import { setCurrent, clear } from './interface.js';
import { render, html } from './lit.js';

function scheduler() {
  let tasks = [];
  let id;

  function runTasks() {
    id = null;
    let t = tasks;
    tasks = [];
    for(var i = 0, len = t.length; i < len; i++) {
      t[i]();
    }
  }

  return function(task) {
    tasks.push(task);
    if(id == null) {
      id = requestAnimationFrame(runTasks);
    }
  };
}

const read = scheduler();
const write = scheduler();

class Container {
  constructor(renderer, frag, host) {
    this.renderer = renderer;
    this.frag = frag;
    this.host = host || frag;
    this[hookSymbol] = new Map();
    this[phaseSymbol] = null;
    this._updateQueued = false;
  }

  update() {
    if(this._updateQueued) return;
    read(() => {
      let result = this.handlePhase(updateSymbol);
      write(() => {
        this.handlePhase(commitSymbol, result);

        if(this[effectsSymbol]) {
          write(() => {
            this.handlePhase(effectsSymbol);
          });
        }
      });
      this._updateQueued = false;
    });
    this._updateQueued = true;
  }

  handlePhase(phase, arg) {
    this[phaseSymbol] = phase;
    switch(phase) {
      case commitSymbol: return this.commit(arg);
      case updateSymbol: return this.render();
      case effectsSymbol: return this.runEffects(effectsSymbol);
    }
    this[phaseSymbol] = null;
  }

  commit(result) {
    render(result, this.frag);
    this.runEffects(commitSymbol);
  }

  render() {
    setCurrent(this);
    let result = this.args ?
      this.renderer.apply(this.host, this.args) :
      this.renderer.call(this.host, this.host);
    clear();
    return result;
  }

  runEffects(symbol) {
    let effects = this[symbol];
    if(effects) {
      setCurrent(this);
      for(let effect of effects) {
        effect.call(this);
      }
      clear();
    }
  }

  teardown() {
    let hooks = this[hookSymbol];
    hooks.forEach((hook) => {
      if (typeof hook.teardown === 'function') {
        hook.teardown();
      }
    })
  }
}

export { Container, html, render };
