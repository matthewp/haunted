
export function attach(element) {
  let el = document.createElement(element);
  host.appendChild(el);
  return () => host.removeChild(el);
}

export function mount(str) {
  let template = document.createElement('template');
  template.innerHTML = str;
  host.appendChild(template.content.cloneNode(true));
  return () => host.innerHTML = '';
}

export { mount as insert };

export function afterMutations() {
  return new Promise(resolve => {
    const mo = new MutationObserver(() => {
      mo.disconnect();
      resolve();
    });
    mo.observe(host, { childList: true, subtree: true });
  });
}

export function later(fn = Function.prototype) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(fn());
    }, 80);
  })
}

export function cycle() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    });
  });
}