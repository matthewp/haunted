
export function attach(element) {
  let el = document.createElement(element);
  host.appendChild(el);
  return () => host.removeChild(el);
}

export function afterMutations() {
  return new Promise(resolve => {
    const mo = new MutationObserver(() => {
      mo.disconnect();
      resolve();
    });
    mo.observe(host, { childList: true, subtree: true });
  });
}