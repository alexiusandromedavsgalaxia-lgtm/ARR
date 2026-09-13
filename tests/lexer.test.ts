import test from 'node:test';
import assert from 'node:assert/strict';
import { Lexer } from '../src/lexer.js';

test('ARR lexer records identifiers, numbers and operators',()=>{
 const tokens=new Lexer('val x: int = 42 + 1').lex();
 assert.equal(tokens[0].value,'val');
 assert.equal(tokens[1].value,'x');
 assert.equal(tokens[4].value,'42');
 assert.equal(tokens[5].value,'+');
 assert.equal(tokens.at(-1)?.kind,'eof');
});

test('ARR lexer tracks source positions',()=>{
 const tokens=new Lexer('val x\n= 1').lex();
 const equal=tokens.find(t=>t.value==='=');
 assert.equal(equal?.line,2);
});
