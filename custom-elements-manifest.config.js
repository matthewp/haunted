import { jsdocFunctionPlugin } from 'cem-plugin-jsdoc-function';

/** @type {{ plugins: import('@custom-elements-manifest/analyzer').Plugin[] }} */
export default ({
  globs: [
    'haunted.js',
    'core.js',
    'lib/*.js',
  ],
  plugins: [
    jsdocFunctionPlugin()
  ]
})
