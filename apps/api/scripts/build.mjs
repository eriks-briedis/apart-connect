import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.js',
  sourcemap: true,
  external: [
    'aws-sdk',
    'mock-aws-s3',
    'nock',
    'mysql',
    'better-sqlite3',
    'oracledb',
    'mysql2',
    'tedious',
    'sqlite3',
    'pg-query-stream',
  ],
})
