import test from 'node:test';
import assert from 'node:assert/strict';
import { Lexer } from '../src/lexer.js';
import { Parser } from '../src/parser.js';

test('ARR parser builds a function and boot block',()=>{
 const source='fn main() { print("ok") } boot { main() }';
 const program=new Parser(new Lexer(source).lex()).parse();
 assert.equal(program.body[0].kind,'FnDecl');
 assert.equal(program.body[1].kind,'Boot');
});

test('ARR parser understands typed declarations and arrays',()=>{
 const source='int answer = 42; var values = [1, 2, 3];';
 const program=new Parser(new Lexer(source).lex()).parse();
 assert.equal(program.body[0].kind,'VarDecl');
 assert.equal(program.body[1].kind,'VarDecl');
});
