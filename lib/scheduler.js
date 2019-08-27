import { commitSymbol, phaseSymbol, updateSymbol, effectsSymbol } from './symbols.js';
import { State } from './state.js';

const defer = Promise.resolve().then.bind(Promise.resolve());

function runner() {
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

function makeScheduler(render) {
  const read = runner();
  const write = runner();

  class Scheduler {
    constructor(renderer, frag, host) {
      this.renderer = renderer;
      this.frag = frag;
      this.host = host || frag;
      this[phaseSymbol] = null;
      this._updateQueued = false;
      this.state = new State(this.update.bind(this), host);
    }

    update() {
      if(this._updateQueued) return;
      read(() => {
        let result = this.handlePhase(updateSymbol);
        write(() => {
          this.handlePhase(commitSymbol, result);

          if(this.state[effectsSymbol]) {
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

    render() {
      return this.state.run(() => this.renderer.apply(this.host, this.args ? this.args : [this.host]));
    }

    runEffects() {
      this.state.runEffects();
    }

    commit(result) {
      render(result, this.frag);
    }

    teardown() {
      this.state.teardown();
    }
  }

  return Scheduler;
}

export { makeScheduler };
