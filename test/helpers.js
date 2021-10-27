export function later(fn = Function.prototype) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(fn());
    }, 80);
  })
}
