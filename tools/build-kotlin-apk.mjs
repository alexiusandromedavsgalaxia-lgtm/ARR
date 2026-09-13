import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const args = process.argv.slice(2);
const value = (name, fallback = null) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};

const source = value('--source', 'examples/kotlin/MainActivity.kt');
const gradleTask = value('--task', ':app:assembleDebug');
const runtimeRoot = path.resolve('android-runtime');
const destination = path.join(runtimeRoot, 'app/src/main/java/dev/arr/runtime/MainActivity.kt');

const sourceText = await fs.readFile(path.resolve(source), 'utf8');

if (!/class\s+MainActivity\b/.test(sourceText)) {
  throw new Error('Kotlin source must declare MainActivity.');
}

let normalized = sourceText.replace(/^\s*package\s+[^\n]+\n/m, '');
normalized = 'package dev.arr.runtime\n\n' + normalized.trimStart();

await fs.mkdir(path.dirname(destination), { recursive: true });
await fs.writeFile(destination, normalized, 'utf8');

const gradle = process.platform === 'win32' ? 'gradle.bat' : 'gradle';
const child = spawn(gradle, [gradleTask, '--stacktrace'], {
  cwd: runtimeRoot,
  stdio: 'inherit'
});

child.on('exit', code => process.exit(code ?? 1));
