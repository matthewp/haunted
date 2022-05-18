/**
 * @license
 * Portions Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { useLayoutEffect } from './use-layout-effect';
import { useState } from './use-state';
const microtask = Promise.resolve();
/**
 * An implementation of ReactiveControllerHost that is driven by Haunted hooks
 * and `useController()`.
 */
class HauntedControllerHost {
    count;
    kick;
    _controllers = [];
    _updatePending = true;
    _updateCompletePromise;
    _resolveUpdate;
    constructor(count, kick) {
        this.count = count;
        this.kick = kick;
        this._updateCompletePromise = new Promise(res => {
            this._resolveUpdate = res;
        });
    }
    addController(controller) {
        this._controllers.push(controller);
    }
    removeController(controller) {
        // Note, if the indexOf is -1, the >>> will flip the sign which makes the
        // splice do nothing.
        this._controllers && this._controllers.splice(this._controllers.indexOf(controller) >>> 0, 1);
    }
    requestUpdate() {
        if (!this._updatePending) {
            this._updatePending = true;
            microtask.then(() => this.kick(this.count + 1));
        }
    }
    get updateComplete() {
        return this._updateCompletePromise;
    }
    connected() {
        this._controllers.forEach(c => c.hostConnected && c.hostConnected());
    }
    disconnected() {
        this._controllers.forEach(c => c.hostDisconnected && c.hostDisconnected());
    }
    update() {
        this._controllers.forEach(c => c.hostUpdate && c.hostUpdate());
    }
    updated() {
        this._updatePending = false;
        const resolve = this._resolveUpdate;
        // Create a new updateComplete Promise for the next update,
        // before resolving the current one.
        this._updateCompletePromise = new Promise(res => {
            this._resolveUpdate = res;
        });
        this._controllers.forEach(c => c.hostUpdated && c.hostUpdated());
        resolve(this._updatePending);
    }
}
/**
 * Creates and stores a stateful ReactiveController instance and provides it
 * with a ReactiveControllerHost that drives the controller lifecycle.
 *
 * Use this hook to convert a ReactiveController into a Haunted hook.
 *
 * @param {<C extends ReactiveController>(host: ReactiveControllerHost) => C} createController A function that creates a controller instance.
 * This function is given a HauntedControllerHost to pass to the controller. The
 * create function is only called once per component.
 * @return {ReactiveController} the controller instance
 */
export function useController(createController) {
    const [count, kick] = useState(0);
    const [host] = useState(() => {
        const host = new HauntedControllerHost(count, kick);
        const controller = createController(host);
        host.primaryController = controller;
        host.connected();
        return host;
    });
    // We use useLayoutEffect because we need updated() called synchronously
    // after rendering.
    useLayoutEffect(() => host.updated());
    // Returning a cleanup function simulates hostDisconnected timing. An empty
    // deps array tells Haunted to only call this once: on mount with the cleanup
    // called on unmount.
    useLayoutEffect(() => () => host.disconnected(), []);
    host.update();
    return host.primaryController;
}
