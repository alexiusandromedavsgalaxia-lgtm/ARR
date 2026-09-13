# ARR

ARR is a deliberately strange, expressive programming language with a native declarative UI model, Kotlin-like concise declarations, a small Swift influence, and a runtime architecture that belongs to ARR itself.

> **ARR is not JavaScript with funny punctuation.**

## Design DNA

- **React influence:** declarative component trees, state, reactive rendering and component composition.
- **Kotlin influence:** `val`, `var`, typed declarations, inference and concise function syntax.
- **Swift influence:** a deliberately small optional-value influence.
- **ARR-native:** `signal`, `boot`, `kernelPanic`, `reboot`, pipelines, modules, runtime handles and the language's own execution model.

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
            Text("count = ${count}")
        }
    }
}

boot {
    print(greet(name))
}
```

## Official documentation

- `LANGUAGE.md` is the initial language contract.
- `docs/REFERENCE.md` is the detailed language reference.
- `docs/GRAMMAR.md` defines the concrete grammar.
- `docs/TYPE_SYSTEM.md` defines types, inference, optionals and generics.
- `docs/RUNTIME.md` defines execution, environments, boot, runtime controls and determinism.
- `docs/COMPONENTS.md` defines the intended component and reactive UI model.

## Repository structure

```text
src/        lexer, parser, AST and runtime foundation
examples/   ARR programs
docs/       official language specification
```

## Status

ARR is being built as a real language rather than a syntax mock-up. The foundation contains a lexer, parser, AST, typed declarations, expressions, control flow, functions, boot blocks, component declarations and runtime primitives. The official documentation intentionally describes the larger language contract so implementation can grow against a stable specification.

The language is experimental. Features explicitly marked future or experimental are not compatibility promises yet.
