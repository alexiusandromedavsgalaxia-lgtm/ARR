# ARR Grammar Reference

This document defines the intended concrete grammar of ARR v0.x. It is written in EBNF-like notation. Whitespace and comments are omitted from the grammar unless a production explicitly consumes text.

## Lexical grammar

```text
letter        = "A".."Z" | "a".."z" | "_" ;
digit         = "0".."9" ;
identifier    = letter , { letter | digit } ;
integer       = digit , { digit } ;
float         = integer , "." , integer ;
string        = '"' , { string-char | escape } , '"' ;
path          = "." , { path-char } ;
```

Escape sequences are `\\`, `\"`, `\n`, and `\t`.

## Program

```text
program       = { declaration | statement } ;
declaration   = variable | function | component | import ;
```

## Variables

```text
variable      = immutable | mutable | typed-variable ;
immutable     = ("val" | "let" | "const") , identifier , [ ":" , type ] , [ "=" , expression ] , [ ";" ] ;
mutable       = "var" , identifier , [ ":" , type ] , [ "=" , expression ] , [ ";" ] ;
typed-variable= type-name , identifier , [ "=" , expression ] , [ ";" ] ;
```

## Types

```text
type          = type-name , [ "?" ] ;
type-name     = primitive | generic | identifier ;
primitive     = "Int8" | "Int16" | "Int32" | "Int64"
              | "UInt8" | "UInt16" | "UInt32" | "UInt64"
              | "Float32" | "Float64" | "Bool" | "Text" | "Byte"
              | "Unit" | "Any" ;
generic       = "Array" , "<" , type , ">"
              | "Map" , "<" , type , "," , type , ">" ;
```

## Functions

```text
function      = "fn" , identifier , "(" , [ parameter-list ] , ")"
                , [ "->" , type ] , function-body ;
parameter-list= parameter , { "," , parameter } ;
parameter     = identifier , [ ":" , type ] ;
function-body = block | "=" , expression ;
```

## Components

```text
component     = "component" , identifier , [ "(" , [ parameter-list ] , ")" ]
                , "{" , { component-member } , "}" ;
component-member = state-member | render-member | declaration | statement ;
state-member  = "state" , identifier , [ ":" , type ] , [ "=" , expression ] , [ ";" ] ;
render-member = "render" , block ;
```

## Statements

```text
statement     = expression-statement
              | variable
              | if-statement
              | while-statement
              | for-statement
              | return-statement
              | boot-statement
              | panic-statement
              | reboot-statement
              | block ;
expression-statement = expression , [ ";" ] ;
block         = "{" , { statement } , "}" ;
if-statement  = "if" , expression , block , [ "else" , block ] ;
while-statement = "while" , expression , block ;
for-statement = "for" , for-head , block ;
for-head      = "(" , expression , ")" | identifier , "in" , expression ;
return-statement = "return" , [ expression ] , [ ";" ] ;
boot-statement = "boot" , ( block | expression ) ;
panic-statement = "kernelPanic" , "{{" , { statement } , "}}" ;
reboot-statement = "reboot" , [ "(" , ")" ] , [ ";" ] ;
```

## Imports

```text
import        = "import" , import-name , "from" , import-path , [ ";" ] ;
import-name   = identifier | "{" , identifier-list , "}" ;
identifier-list = identifier , { "," , identifier } ;
import-path   = path | identifier , { "." , identifier } ;
```

## Expressions

```text
expression    = assignment ;
assignment    = logical-or , [ assignment-op , assignment ] ;
logical-or    = logical-and , { "||" , logical-and } ;
logical-and   = equality , { "&&" , equality } ;
equality      = comparison , { ( "==" | "!=" ) , comparison } ;
comparison    = additive , { ( "<" | "<=" | ">" | ">=" ) , additive } ;
additive      = multiplicative , { ( "+" | "-" ) , multiplicative } ;
multiplicative= unary , { ( "*" | "/" | "%" ) , unary } ;
unary         = ( "!" | "+" | "-" ) , unary | postfix ;
postfix       = primary , { call | member } ;
call          = "(" , [ argument-list ] , ")" ;
member        = ( "." | "?." ) , identifier ;
primary       = literal | identifier | array | "(" , expression , ")" ;
argument-list = expression , { "," , expression } ;
array         = "[" , [ argument-list ] , "]" ;
assignment-op = "=" | "+=" | "-=" | "*=" | "/=" ;
```

## Pipeline

The final grammar adds:

```text
pipeline      = logical-or , { "|>" , pipeline-stage } ;
pipeline-stage= expression ;
```

Semantics are defined in `REFERENCE.md`, not by textual macro expansion.

## Reactive syntax

```text
signal        = "signal" , identifier , [ ":" , type ] , "=" , expression , [ ";" ] ;
```

A signal is a runtime object with dependency tracking. A component `state` member is a scoped signal with component lifecycle semantics.

## Events

```text
event-binding = expression , "on" , identifier , block ;
```

The event binding form is intentionally ARR-specific. It is not JSX and does not compile through a JSX grammar.

## Lexical priority

The lexer must recognize multi-character operators before their one-character prefixes. For example `?.` must be recognized as one operator and not `?` followed by `.`. Paths are recognized only where path context is valid, especially after `from`.

## Grammar design rule

No new surface construct becomes normative merely because the parser can accept it. Every public syntax feature requires:

1. a lexical definition;
2. a grammar production;
3. AST representation;
4. runtime or compile-time semantics;
5. diagnostics;
6. at least one positive test;
7. at least one invalid-form test;
8. formatter behavior;
9. documentation.
