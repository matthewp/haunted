import { State } from './state';
import { commitSymbol, phaseSymbol, updateSymbol, effectsSymbol, layoutEffectsSymbol } from './symbols';
const defer = Promise.resolve().then.bind(Promise.resolve());
function runner() {
    let tasks = [];
    let id;
    function runTasks() {
        id = null;
        let t = tasks;
        tasks = [];
        for (var i = 0, len = t.length; i < len; i++) {
            t[i]();
        }
    }
    return function (task) {
        tasks.push(task);
        if (id == null) {
            id = defer(runTasks);
        }
    };
}
const read = runner();
const write = runner();
class BaseScheduler {
    renderer;
    host;
    state;
    [phaseSymbol];
    _updateQueued;
    constructor(renderer, host) {
        this.renderer = renderer;
        this.host = host;
        this.state = new State(this.update.bind(this), host);
        this[phaseSymbol] = null;
        this._updateQueued = false;
    }
    update() {
        if (this._updateQueued)
            return;
        read(() => {
            let result = this.handlePhase(updateSymbol);
            write(() => {
                this.handlePhase(commitSymbol, result);
                write(() => {
                    this.handlePhase(effectsSymbol);
                });
            });
            this._updateQueued = false;
        });
        this._updateQueued = true;
    }
    handlePhase(phase, arg) {
        this[phaseSymbol] = phase;
        switch (phase) {
            case commitSymbol:
                this.commit(arg);
                this.runEffects(layoutEffectsSymbol);
                return;
            case updateSymbol: return this.render();
            case effectsSymbol: return this.runEffects(effectsSymbol);
        }
    }
    render() {
        return this.state.run(() => this.renderer.call(this.host, this.host));
    }
    runEffects(phase) {
        this.state._runEffects(phase);
    }
    teardown() {
        this.state.teardown();
    }
}
export { BaseScheduler };
