const esbuild = require('esbuild');
const path = require('path');

async function build() {
  try {
    await esbuild.build({
      entryPoints: ['dist/lambda/bootstrap.js'],
      bundle: true,
      outfile: 'dist/lambda/bundle.js',
      platform: 'node',
      target: 'node20',
      format: 'cjs',
      external: ['aws-sdk'],
      sourcemap: true,
      minify: true,
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      banner: {
        js: "require('source-map-support').install();"
      }
    });

    console.log('✅ Bundle creado exitosamente');
  } catch (error) {
    console.error('❌ Error al crear el bundle:', error);
    process.exit(1);
  }
}

build();
