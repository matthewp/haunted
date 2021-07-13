import helmet from 'eleventy-plugin-helmet';

import { rocketLaunch } from '@rocket/launch';
import { rocketSearch } from '@rocket/search';
import { codeTabs } from 'rocket-preset-code-tabs';
import { customElementsManifest } from 'rocket-preset-custom-elements-manifest';
import { playgroundElements } from 'rocket-preset-playground-elements';

import { absoluteBaseUrlNetlify } from '@rocket/core/helpers';

/** @type {import('@rocket/cli').RocketCliConfig} */
export default ({
  absoluteBaseUrl: absoluteBaseUrlNetlify('http://localhost:8080'),
  presets: [
    rocketLaunch(),
    rocketSearch(),
    codeTabs({
      collections: {
        packageManagers: {
          npm: { label: 'NPM', iconHref: '/_merged_assets/brand-logos/npm.svg' },
          yarn: { label: 'Yarn', iconHref: '/_merged_assets/brand-logos/yarn.svg' },
          pnpm: { label: 'PNPM', iconHref: '/_merged_assets/brand-logos/pnpm.svg' },
        },
      },
    }),

    playgroundElements(),
    customElementsManifest({
      package: 'package.json'
    }),
  ],

  eleventy(eleventyConfig) {
    eleventyConfig.addPlugin(helmet);
    eleventyConfig.addWatchTarget('_assets/**/*.css');
    eleventyConfig.addTransform('fix-noscript', content =>
      content
        .replace(/&#x26;#x3C;(link|style)/g, '<$1')
        .replace(/&#x26;(link|style)/g, '<$1')
        .replace(/&#x3C;(link|style)/g, '<$1')
    );
  },

});
