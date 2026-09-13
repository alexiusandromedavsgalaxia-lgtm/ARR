export type TypeName = string;
export interface Program { kind:'Program'; body: Stmt[]; }
export type Stmt = VarDecl|ExprStmt|BlockStmt|IfStmt|WhileStmt|ReturnStmt|FnDecl|BootStmt|ImportStmt|ComponentStmt|KernelPanicStmt|RebootStmt;
export interface VarDecl { kind:'VarDecl'; name:string; type?:TypeName; mutable:boolean; value?:Expr; }
export interface ExprStmt { kind:'ExprStmt'; expr:Expr; }
export interface BlockStmt { kind:'Block'; body:Stmt[]; }
export interface IfStmt { kind:'If'; test:Expr; consequent:BlockStmt; alternate?:BlockStmt; }
export interface WhileStmt { kind:'While'; test:Expr; body:BlockStmt; }
export interface ReturnStmt { kind:'Return'; value?:Expr; }
export interface FnDecl { kind:'FnDecl'; name:string; params:string[]; body:BlockStmt; }
export interface BootStmt { kind:'Boot'; body:BlockStmt; }
export interface ImportStmt { kind:'Import'; name:string; path:string; }
export interface ComponentStmt { kind:'Component'; name:string; body:Stmt[]; }
export interface KernelPanicStmt { kind:'KernelPanic'; body:BlockStmt; }
export interface RebootStmt { kind:'Reboot'; }
export type Expr = Literal|Identifier|Binary|Unary|Call|Member|ArrayExpr|Assignment;
export interface Literal { kind:'Literal'; value:any; }
export interface Identifier { kind:'Identifier'; name:string; }
export interface Binary { kind:'Binary'; op:string; left:Expr; right:Expr; }
export interface Unary { kind:'Unary'; op:string; expr:Expr; }
export interface Call { kind:'Call'; callee:Expr; args:Expr[]; }
export interface Member { kind:'Member'; object:Expr; property:string; optional:boolean; }
export interface ArrayExpr { kind:'Array'; items:Expr[]; }
export interface Assignment { kind:'Assignment'; target:Expr; op:string; value:Expr; }
