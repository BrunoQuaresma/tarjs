const {
  defaultOptions,
  getRollupExternal,
  getRollupPlugins,
  loadConfigSync,
} = require('@gera2ld/plaid');
const pkg = require('./package.json');

const DIST = defaultOptions.distDir;
const FILENAME = 'index';
const BANNER = `/*! ${pkg.name} v${pkg.version} | ${pkg.license} License */`;

const external = getRollupExternal();
const bundleOptions = {
  extend: true,
  esModule: false,
};
const postcssConfig =
  loadConfigSync('postcss') || require('@gera2ld/plaid/config/postcssrc');
const postcssOptions = {
  ...postcssConfig,
  inject: false,
};
const rollupConfig = [
  {
    input: {
      input: 'src/index.ts',
      plugins: getRollupPlugins({
        minimize: false,
        esm: true,
        extensions: defaultOptions.extensions,
        postcss: postcssOptions,
      }),
      external,
    },
    output: {
      format: 'esm',
      file: `${DIST}/${FILENAME}.mjs`,
    },
  },
  ...[false].map((minimize) => ({
    input: {
      input: 'src/index.ts',
      plugins: getRollupPlugins({
        minimize,
        esm: true,
        extensions: defaultOptions.extensions,
        postcss: {
          ...postcssOptions,
          extract: 'style.css',
        },
      }),
    },
    output: {
      format: 'iife',
      file: `${DIST}/${FILENAME}${minimize ? '.min' : ''}.js`,
      name: 'tarball',
      ...bundleOptions,
    },
  })),
];

rollupConfig.forEach((item) => {
  item.output = {
    indent: false,
    // If set to false, circular dependencies and live bindings for external imports won't work
    externalLiveBindings: false,
    ...item.output,
    ...(BANNER && {
      banner: BANNER,
    }),
  };
});

module.exports = rollupConfig.map(({ input, output }) => ({
  ...input,
  output,
}));
