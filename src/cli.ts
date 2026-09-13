import { readFileSync } from 'node:fs';
import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { Runtime, RebootSignal, PanicSignal } from './runtime.js';

const file=process.argv[2];
if(!file){console.error('usage: arr <file.arr>');process.exit(2);}
try{
  const source=readFileSync(file,'utf8');
  const program=new Parser(new Lexer(source).lex()).parse();
  new Runtime().run(program);
}catch(e){
  if(e instanceof RebootSignal){console.log('[ARR] reboot requested');process.exit(0);}
  if(e instanceof PanicSignal){console.error('[ARR] KERNEL PANIC: all processes stopped');process.exit(1);}
  console.error(e instanceof Error?e.message:String(e));process.exit(1);
}
