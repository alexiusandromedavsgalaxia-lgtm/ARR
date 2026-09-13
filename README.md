# ARR

ARR is a deliberately strange, expressive programming language with a native declarative UI model, Kotlin-like concise declarations, a small Swift influence, and a runtime architecture that belongs to ARR itself.

> **ARR is not JavaScript with funny punctuation.**

## Design DNA

- **React influence:** declarative component trees, state, reactive rendering and component composition.
- **Kotlin influence:** `val`, `var`, typed declarations, inference and concise function syntax.
- **Swift influence:** a deliberately small optional-value influence.
- **ARR-native:** `signal`, `boot`, `kernelPanic`, `reboot`, pipelines, modules, runtime handles and the language's own execution model.

## Official documentation

- `LANGUAGE.md` language contract
- `docs/REFERENCE.md` complete reference
- `docs/GRAMMAR.md` concrete grammar
- `docs/TYPE_SYSTEM.md` type system
- `docs/RUNTIME.md` execution model
- `docs/COMPONENTS.md` component/reactive UI model
- `docs/MODULES.md` modules and standard library
- `docs/DIAGNOSTICS.md` diagnostics and error codes
- `docs/TOOLCHAIN.md` CLI and tooling
- `docs/CONFORMANCE.md` compatibility contract

## Repository

```text
src/        lexer, parser, AST and interpreter runtime
examples/   canonical ARR programs
tests/      lexer, parser and runtime tests
docs/       official ARR language specification
```

## Canonical syntax

```arr
val name: Text = "ARR"
var count: Int = 0

fn greet(who: Text) -> Text {
    return "hello ${who}"
}

component App {
    state count: Int = 0

    render {
        Column {
            Text(greet(name))
            Button("+1") on click {
                count += 1
            }
        }
    }
}

boot {
    print(greet(name))
}
```

## Status

ARR is being built as a real language. The current main branch contains the language documentation plus the lexer, parser, AST, interpreter foundation, project configuration, examples and automated tests. The documentation deliberately defines the larger language contract so the implementation can grow feature-by-feature without turning into a pile of unrelated syntax.

Experimental and future features are explicitly identified in the documentation and are not treated as implemented merely because they are documented.
