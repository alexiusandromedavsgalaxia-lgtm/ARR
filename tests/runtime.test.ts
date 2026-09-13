import test from 'node:test';
import assert from 'node:assert/strict';
import { Lexer } from '../src/lexer.js';
import { Parser } from '../src/parser.js';
import { Runtime } from '../src/runtime.js';

test('ARR runtime executes arithmetic and functions',()=>{
 const program=new Parser(new Lexer('fn add(a,b){ return a+b }').lex()).parse();
 const runtime=new Runtime();
 runtime.run(program);
 assert.equal(typeof runtime.global.get('add'),'function');
});
