import { commitSymbol, phaseSymbol, updateSymbol, effectsSymbol } from './symbols.js';
import { State } from './state.js';

const defer = Promise.resolve().then.bind(Promise.resolve());

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
      id = defer(runTasks);
    }
  };
}

function makeLifecycle(render) {
  const read = scheduler();
  const write = scheduler();

  class Lifecycle {
    constructor(renderer, frag, host) {
      this.state = new State(renderer, this.update.bind(this));
      this.frag = frag;
      this.host = host || frag;
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
  }

  return Lifecycle;
}

export { makeLifecycle };
