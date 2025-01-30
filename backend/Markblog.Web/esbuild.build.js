const postCssPlugin = require('esbuild-style-plugin'); 
const esbuild = require('esbuild');

const buildOptions = {
  entryPoints: ['./src/app.js'],
  outdir: 'wwwroot',
  bundle: true,
  minify: true,
  plugins: [
    postCssPlugin({
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
    }),
  ],
};

const build = async ({ watch = false }) => {
  try {
    if (watch) {
      const context = await esbuild.context(buildOptions); await context.watch();
      console.log('Watching for changes...');
    } else {
      await esbuild.build(buildOptions);
      console.log('Build complete');
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
};
module.exports = build;