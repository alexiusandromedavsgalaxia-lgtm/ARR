import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { Runtime } from './runtime.js';
import { compileX86Bios } from './native.js';

function parseFile(file: string) {
  const source = readFileSync(resolve(file), 'utf8');
  return new Parser(new Lexer(source).lex()).parse();
}

const args = process.argv.slice(2);
const command = args[0];
if (!command) {
  console.error('usage: arr <run|check|build> <file.arr> [--target=x86-bios] [--out path]');
  process.exit(2);
}

try {
  if (command === 'run') {
    const file = args[1];
    if (!file) throw new Error('ARR CLI: run requires a .arr file');
    new Runtime().run(parseFile(file));
  } else if (command === 'check') {
    const file = args[1];
    if (!file) throw new Error('ARR CLI: check requires a .arr file');
    parseFile(file);
    console.log(`ARR check: ${file}: ok`);
  } else if (command === 'build') {
    const file = args[1];
    if (!file) throw new Error('ARR CLI: build requires a .arr file');
    const targetArg = args.find(a => a.startsWith('--target='));
    const target = targetArg?.slice('--target='.length) ?? 'x86-bios';
    if (target !== 'x86-bios') throw new Error(`ARR CLI: unsupported native target '${target}'`);
    const outArg = args.find(a => a === '--out');
    const outIndex = outArg ? args.indexOf(outArg) + 1 : -1;
    const out = outIndex > 0 && args[outIndex] ? args[outIndex] : file.replace(/\.arr$/, '.img');
    const asm = resolve(`${out}.asm`);
    const image = resolve(out);
    mkdirSync(dirname(image), { recursive: true });
    writeFileSync(asm, compileX86Bios(parseFile(file)));
    execFileSync('nasm', ['-f', 'bin', asm, '-o', image], { stdio: 'inherit' });
    console.log(`ARR build: ${image}`);
  } else {
    throw new Error(`ARR CLI: unknown command '${command}'`);
  }
} catch (e) {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
}
