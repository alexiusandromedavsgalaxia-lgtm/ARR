import { readFileSync } from 'node:fs';
import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { Runtime } from './runtime.js';

const file=process.argv[2];
if(!file){console.error('usage: arr <file.arr>');process.exit(2);}
try{
 const source=readFileSync(file,'utf8');
 const program=new Parser(new Lexer(source).lex()).parse();
 new Runtime().run(program);
}catch(e){console.error(e instanceof Error?e.message:String(e));process.exit(1);}
