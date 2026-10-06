import { execFileSync } from 'node:child_process';
import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
await build({ entryPoints: ['src/site.js'], outfile: 'dist/site-motion.js', bundle: true, minify: true, format: 'iife', target: ['es2020'], legalComments: 'eof' });
const licenses = await Promise.all(['framer-motion', 'motion-dom', 'motion-utils'].map(async name => `${name}\n\n${await readFile(`node_modules/${name}/LICENSE.md`, 'utf8')}`));
await writeFile('dist/MOTION-LICENSE.txt', licenses.join('\n\n'));

execFileSync('python', ['scripts/localize.py'], { stdio: 'inherit' });

execFileSync('python', ['scripts/metadata.py'], { stdio: 'inherit' });

execFileSync('python', ['scripts/structured_data.py'], { stdio: 'inherit' });
