import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  plugins: [esbuildPlugin({ ts: true })],
};
