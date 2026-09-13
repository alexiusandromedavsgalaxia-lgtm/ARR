# ARR Toolchain

## Commands

The intended command-line tool is `arr`.

```text
arr run main.arr
arr check main.arr
arr fmt main.arr
arr test
arr build
arr repl
arr doc
arr version
```

The current foundation uses the TypeScript implementation to lex and parse `.arr` source. Native compilation and the full command dispatcher are later stages.

## `arr run`

Loads a source file, resolves its imports, validates it, then executes its boot target.

## `arr check`

Runs lexical, syntax, type and module checks without executing application code.

## `arr fmt`

Formats ARR using the canonical spacing, indentation and brace rules. Formatting must not change semantics.

## `arr test`

Runs ARR test modules and reports stable diagnostics and assertion failures.

## `arr build`

Produces a distributable program or runtime artifact. A future native compiler may target a portable intermediate representation before machine code.

## `arr repl`

Interactive development shell. Expressions and declarations can be entered incrementally. UI nodes can render through a selected renderer in a future implementation.

## `arr doc`

Generates API documentation from declarations and doc comments.

## Configuration

The project file is `arrconfig.json`.

```json
{
  "name": "arr-demo",
  "version": "0.1.0",
  "entry": "src/main.arr",
  "language": "0.1"
}
```

## Formatter rules

The canonical formatter uses four spaces for indentation, braces on the declaration line, one blank line between top-level declarations, and no mandatory semicolon.

## Editor support

The language server should expose:

- diagnostics;
- completion;
- hover type information;
- go-to-definition;
- find references;
- rename;
- formatting;
- document symbols;
- component tree inspection.

## Testing contract

Every language feature should have lexer tests, parser tests, semantic tests and runtime tests where applicable. UI features additionally require renderer-independent tree tests.

## Compatibility

The toolchain reports both language version and runtime version. A project can pin its language version so a newer CLI does not silently reinterpret old source.
