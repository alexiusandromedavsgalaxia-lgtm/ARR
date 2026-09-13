export type TokenKind =
  | 'number' | 'string' | 'identifier' | 'path'
  | 'keyword' | 'operator' | 'punct' | 'eof';

export interface Token { kind: TokenKind; value: string; line: number; column: number; }

const keywords = new Set([
  'import','from','fn','if','else','while','for','return','boot','const','val','var','let',
  'int','int8','int16','int32','int64','uint8','uint16','uint32','uint64','float','double',
  'string','bool','any','component','state','render','true','false','null','kernelPanic','reboot'
]);

export class Lexer {
  private i = 0; private line = 1; private column = 1;
  constructor(private readonly source: string) {}
  lex(): Token[] {
    const out: Token[] = [];
    while (!this.atEnd()) {
      const c = this.peek();
      if (/\s/.test(c)) { this.advance(); continue; }
      if (c === '/' && this.peek(1) === '/') { while (!this.atEnd() && this.peek() !== '\n') this.advance(); continue; }
      const line = this.line, column = this.column;
      if (c === '"') { out.push(this.string(line, column)); continue; }
      if (/\d/.test(c)) { out.push(this.number(line, column)); continue; }
      if (/[A-Za-z_]/.test(c)) { out.push(this.word(line, column)); continue; }
      if (c === '.' && /[/.A-Za-z_]/.test(this.peek(1))) { out.push(this.path(line, column)); continue; }
      const two = c + this.peek(1);
      if (['==','!=','<=','>=','&&','||','+=','-=','*=','/=','++','--','=>','?.'].includes(two)) {
        this.advance(); this.advance(); out.push({kind:'operator', value:two, line,column}); continue;
      }
      if ('+-*/%=!<>?:'.includes(c)) { this.advance(); out.push({kind:'operator',value:c,line,column}); continue; }
      if ('{}()[],;.'.includes(c)) { this.advance(); out.push({kind:'punct',value:c,line,column}); continue; }
      throw new Error(`ARR lexer: unexpected '${c}' at ${line}:${column}`);
    }
    out.push({kind:'eof',value:'',line:this.line,column:this.column}); return out;
  }
  private atEnd(){ return this.i >= this.source.length; }
  private peek(n=0){ return this.source[this.i+n] ?? '\0'; }
  private advance(){ const c=this.source[this.i++] ?? '\0'; if(c==='\n'){this.line++;this.column=1;} else this.column++; return c; }
  private string(line:number,column:number):Token { this.advance(); let s=''; while(!this.atEnd()&&this.peek()!=='"'){ if(this.peek()==='\\'){this.advance();const e=this.advance();s += e==='n'?'\n':e==='t'?'\t':e; } else s+=this.advance(); } if(this.atEnd()) throw new Error(`ARR lexer: unterminated string at ${line}:${column}`); this.advance(); return {kind:'string',value:s,line,column}; }
  private number(line:number,column:number):Token { let s=''; while(/\d/.test(this.peek()))s+=this.advance(); if(this.peek()==='.'&&/\d/.test(this.peek(1))){s+=this.advance();while(/\d/.test(this.peek()))s+=this.advance();} return {kind:'number',value:s,line,column}; }
  private word(line:number,column:number):Token { let s=''; while(/[A-Za-z0-9_]/.test(this.peek()))s+=this.advance(); return {kind:keywords.has(s)?'keyword':'identifier',value:s,line,column}; }
  private path(line:number,column:number):Token { let s=''; while(!this.atEnd()&&!/[\s,;(){}\[\]]/.test(this.peek()))s+=this.advance(); return {kind:'path',value:s,line,column}; }
}
