
import { directive, render } from "./lit.js"
import { configureVirtual } from "./configure-virtual.js"

const virtual = configureVirtual({directive, render})

export {
  virtual,
  virtual as withHooks
}
