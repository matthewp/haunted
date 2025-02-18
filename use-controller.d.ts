/**
 * @license
 * Portions Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { ReactiveController, ReactiveControllerHost } from '@lit/reactive-element';
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
export declare function useController<C extends ReactiveController>(createController: (host: ReactiveControllerHost) => C): C;
