# ARR Conformance

An ARR implementation declares its language version and its supported conformance level.

## Levels

- Lexer: tokenization contract.
- Parser: grammar and AST contract.
- Core: declarations, expressions, control flow and functions.
- Runtime: execution semantics.
- Reactive: signals, state and component invalidation.
- Toolchain: CLI, formatter, tests and project configuration.
- Full: all normative features for the declared language version.

## Required test families

A conforming implementation should test token boundaries, source positions, operator precedence, declarations, scope, type errors, optional behavior, functions, modules, boot order, component identity, signals, runtime controls, diagnostics and formatter stability.

## Formatter invariant

Formatting twice produces the same result:

```text
fmt(fmt(source)) == fmt(source)
```

## Runtime invariant

A compliant interpreter and a compliant compiled implementation must produce equivalent observable results for deterministic programs.

## Versioning

Breaking syntax or semantic changes require a language-version transition and migration notes. Bug fixes must not silently redefine normative syntax.
