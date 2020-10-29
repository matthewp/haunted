import { State } from './state';
import { commitSymbol, phaseSymbol, updateSymbol, effectsSymbol, Phase, layoutEffectsSymbol, EffectsSymbols } from './symbols';
import { GenericRenderer } from './core';

const defer = Promise.resolve().then.bind(Promise.resolve());

function runner() {
  let tasks: VoidFunction[] = [];
  let id: Promise<void> | null;

  function runTasks() {
    id = null;
    let t = tasks;
    tasks = [];
    for(var i = 0, len = t.length; i < len; i++) {
      t[i]();
    }
  }

  return function(task: VoidFunction) {
    tasks.push(task);
    if(id == null) {
      id = defer(runTasks);
    }
  };
}

const read = runner();
const write = runner();

abstract class BaseScheduler<R extends GenericRenderer, H> {
  renderer: R;
  host: H;
  state: State<H>;
  [phaseSymbol]: Phase | null;
  _updateQueued: boolean;

  constructor(renderer: R, host: H) {
    this.renderer = renderer;
    this.host = host;
    this.state = new State(this.update.bind(this), host);
    this[phaseSymbol] = null;
    this._updateQueued = false;
  }

  update(): void {
    if(this._updateQueued) return;
    read(() => {
      console.log(this.host, 'handle update')
      let result = this.handlePhase(updateSymbol);
      write(() => {
        console.log(this.host, 'handle commit')
        this.handlePhase(commitSymbol, result);

        write(() => {
          console.log(this.host, 'handle effects')
          this.handlePhase(effectsSymbol);
          console.log(this.host, 'done')
        });
        console.log(this.host, 'effects queued')
      });
      console.log(this.host, 'commit queued')
      this._updateQueued = false;
    });
    console.log(this.host, 'update queued')
    this._updateQueued = true;
  }

  handlePhase(phase: typeof commitSymbol, arg: unknown): void;
  handlePhase(phase: typeof updateSymbol): unknown;
  handlePhase(phase: typeof effectsSymbol): void;
  handlePhase(phase: Phase, arg?: unknown) {
    this[phaseSymbol] = phase;
    switch(phase) {
      case commitSymbol:
        this.commit(arg);
        this.runEffects(layoutEffectsSymbol);
        return;
      case updateSymbol: return this.render();
      case effectsSymbol: return this.runEffects(effectsSymbol);
    }
    this[phaseSymbol] = null;
  }

  render(): unknown {
    return this.state.run(() => this.renderer.call(this.host, this.host))
  }

  runEffects(phase: EffectsSymbols): void {
    this.state._runEffects(phase);
  }

  abstract commit(result: unknown): void;

  teardown(): void {
    this.state.teardown();
  }
}

export { BaseScheduler };
