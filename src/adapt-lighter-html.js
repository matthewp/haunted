
export const adaptLighterHtml = render =>
  (result, node) => render(node, () => result);
