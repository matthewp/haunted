# haunted

## 6.1.0

### Minor Changes

- 3bdc4b0: Export type `Options` from component as `ComponentOptions`.
- 7303994: Allow omitting initialValue from useRef.
- 4705ede: Infer `virtual` type definition from renderer arguments.
- 17190b1: export Ref type
- 8ff7db9: Improve the defintion of useState, better handling initial value.

## 6.0.0

### Major Changes

- f861a4b: Deprecates haunted.js and web.js bundles
- d6e413f: Upgrade to lit & lit-html ^3.0.0

### Minor Changes

- 18127bb: Add support for lit 3

### Patch Changes

- 9c9bd24: Prevent a setState that doesn't change the state from resulting in a rerender
- f359e21: Don't use Shadow Root for contexts.
- 7e17c42: Prevent infinite loops if effect schedules an update and then throws.

## 6.0.0-next.2

### Minor Changes

- 18127bb: Add support for lit 3

### Patch Changes

- f359e21: Don't use Shadow Root for contexts.
- 7e17c42: Prevent infinite loops if effect schedules an update and then throws.

## 6.0.0-next.1

### Patch Changes

- 9c9bd24: Prevent a setState that doesn't change the state from resulting in a rerender

## 6.0.0-next.0

### Major Changes

- f861a4b: Deprecates haunted.js and web.js bundles
