import type * as A from './ast.js';

class Env { constructor(public parent?:Env, private values=new Map<string,any>()){} define(k:string,v:any){this.values.set(k,v);} get(k:string):any{if(this.values.has(k))return this.values.get(k);if(this.parent)return this.parent.get(k);throw new Error(`ARR runtime: unknown name '${k}'`);} set(k:string,v:any){if(this.values.has(k)){this.values.set(k,v);return;}if(this.parent){this.parent.set(k,v);return;}throw new Error(`ARR runtime: unknown name '${k}'`);} }
class ReturnSignal { constructor(public value:any){} }
class RebootSignal extends Error { constructor(){super('ARR reboot');} }
class PanicSignal extends Error { constructor(){super('ARR kernel panic');} }

export class Runtime {
  readonly global=new Env();
  private boot:A.BlockStmt[]=[];
  constructor(){
    this.global.define('print',(...xs:any[])=>console.log(...xs));
    this.global.define('println',(...xs:any[])=>console.log(...xs));
    this.global.define('len',(x:any)=>x?.length ?? 0);
    this.global.define('typeOf',(x:any)=>Array.isArray(x)?'array':x===null?'null':typeof x);
    this.global.define('reboot',()=>{throw new RebootSignal();});
    this.global.define('stopAllProcess',()=>{throw new PanicSignal();});
    this.global.define('use',{kernelpanic:()=>{throw new PanicSignal();}});
  }
  run(program:A.Program){for(const s of program.body)this.exec(s,this.global);for(const b of this.boot)this.exec(b,this.global);}
  private exec(s:A.Stmt,env:Env):any{
    switch(s.kind){
      case 'VarDecl': { const value=s.value?this.eval(s.value,env):undefined; this.typeCheck(s.type,value);env.define(s.name,value);return; }
      case 'ExprStmt': return this.eval(s.expr,env);
      case 'Block': {const local=new Env(env);for(const x of s.body)this.exec(x,local);return;}
      case 'If': {if(this.eval(s.test,env))this.exec(s.consequent,env);else if(s.alternate)this.exec(s.alternate,env);return;}
      case 'While': {let guard=0;while(this.eval(s.test,env)){this.exec(s.body,env);if(++guard>100000)throw new Error('ARR runtime: loop guard exceeded');}return;}
      case 'Return': throw new ReturnSignal(s.value?this.eval(s.value,env):undefined);
      case 'FnDecl': env.define(s.name,(...args:any[])=>{const local=new Env(env);s.params.forEach((p,i)=>local.define(p,args[i]));try{for(const x of s.body.body)this.exec(x,local);}catch(e){if(e instanceof ReturnSignal)return e.value;throw e;}return undefined;});return;
      case 'Boot': this.boot.push(s.body);return;
      case 'Import': return;
      case 'Component': env.define(s.name,{__arrComponent:true,name:s.name,body:s.body});return;
      case 'KernelPanic': this.exec(s.body,env);return;
      case 'Reboot': throw new RebootSignal();
    }
  }
  private eval(e:A.Expr,env:Env):any{
    switch(e.kind){
      case 'Literal':return e.value;
      case 'Identifier':return env.get(e.name);
      case 'Array':return e.items.map(x=>this.eval(x,env));
      case 'Unary': {const v=this.eval(e.expr,env);return e.op==='!'?!v:e.op==='-'?-v:+v;}
      case 'Binary': {const a=this.eval(e.left,env),b=this.eval(e.right,env);switch(e.op){case '+':return a+b;case '-':return a-b;case '*':return a*b;case '/':return a/b;case '%':return a%b;case '==':return a===b;case '!=':return a!==b;case '<':return a<b;case '<=':return a<=b;case '>':return a>b;case '>=':return a>=b;case '&&':return a&&b;case '||':return a||b;default:throw new Error(`ARR runtime: unknown operator ${e.op}`);}}
      case 'Assignment': {if(e.target.kind!=='Identifier')throw new Error('ARR runtime: assignment target must be a name');const old=env.get(e.target.name),v=this.eval(e.value,env);const next=e.op==='='?v:e.op==='+='?old+v:e.op==='-='?old-v:e.op==='*='?old*v:old/v;env.set(e.target.name,next);return next;}
      case 'Call': {const fn=this.eval(e.callee,env);if(typeof fn!=='function')throw new Error('ARR runtime: value is not callable');return fn(...e.args.map(x=>this.eval(x,env)));}
      case 'Member': {const obj=this.eval(e.object,env);if(obj==null&&e.optional)return undefined;if(obj==null)throw new Error('ARR runtime: member access on null');return obj[e.property];}
    }
  }
  private typeCheck(type:string|undefined,v:any){if(!type||type==='any')return;const t=type.replace('?','');const ok=t==='string'?typeof v==='string':t==='bool'?typeof v==='boolean':t.startsWith('uint')||t.startsWith('int')?typeof v==='number'&&Number.isInteger(v):t==='float'||t==='double'?typeof v==='number':true;if(!ok)throw new Error(`ARR type error: expected ${type}`);}
}
export { RebootSignal, PanicSignal };
