# ARR Diagnostics

ARR diagnostics are designed for humans, editors and automated tooling at the same time.

## Shape

A diagnostic contains:

- severity: `error`, `warning`, `info`, or `hint`;
- stable code;
- phase: lexer, parser, type, module, runtime, capability, or renderer;
- source file;
- line and column;
- concise message;
- optional source excerpt;
- optional related locations.

Canonical text:

```text
ARR E1002 parser: expected ')' at src/main.arr:12:19
```

## Code families

| Range | Phase |
|---|---|
| E1xxx | lexer/parser |
| E2xxx | type system |
| E3xxx | module/loading |
| E4xxx | runtime |
| E5xxx | capability/privilege |
| E6xxx | component/reactive system |
| W1xxx | warnings |

Codes should remain stable once published.

## Common diagnostics

`E1001` unexpected token.

`E1002` expected token missing.

`E1003` unterminated literal.

`E2001` incompatible type.

`E2002` assignment to immutable binding.

`E3001` module not found.

`E3002` cyclic initialization failure.

`E4001` unknown runtime name.

`E4002` attempted call of a non-callable value.

`E5001` capability denied.

`E6001` invalid component tree operation.

## Error quality rule

Diagnostics must identify what ARR expected and where. Avoid messages such as `syntax error` when a more precise explanation is available.

For example:

```text
bad:  syntax error
better: ARR E1002 parser: expected '}' to close component at App.arr:18:1
```

## Recovery

The parser should recover after an error where possible so editors can display multiple diagnostics from one file. The CLI may stop after the first fatal error for a simpler experience.
