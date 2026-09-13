# ARR

ARR is a deliberately strange programming language with a native declarative UI model and an ARR-original runtime.

## Design DNA

React is the only external influence intentionally retained: declarative component trees, stateful UI, reactive composition and component nesting.

Everything else belongs to ARR itself. Kotlin and Swift are not language influences or compatibility targets. Their syntax is not part of canonical ARR.

ARR-native concepts include `signal`, `watch`, `emit`, `derive`, `view`, `boot`, `kernelPanic`, `reboot`, pipelines, modules and runtime handles.

## Official documentation

- `LANGUAGE.md` language contract
- `docs/REFERENCE.md` complete reference
- `docs/GRAMMAR.md` concrete grammar
- `docs/TYPE_SYSTEM.md` type system
- `docs/RUNTIME.md` execution model
- `docs/COMPONENTS.md` component and reactive UI model
- `docs/MODULES.md` modules and standard library
- `docs/DIAGNOSTICS.md` diagnostics
- `docs/TOOLCHAIN.md` CLI and tooling
- `docs/CONFORMANCE.md` compatibility contract
- `docs/ARR_NATIVE.md` ARR-only grammar and reactive primitives

## Canonical ARR

```arr
signal clicks: int = 0

derive label = "clicks=" + clicks

component App {
    state title: string = "ARR"

    render {
        Column {
            Text(title)
            Text(label)
            Button("increment") {
                emit clicks(clicks + 1)
            }
        }
    }
}

watch clicks {
    print("signal changed")
}

boot {
    print("ARR online")
}
```

## Repository

```text
src/        lexer, parser, AST and interpreter runtime
examples/   canonical ARR programs
tests/      lexer, parser and runtime tests
docs/       official ARR language specification
```

## Status

ARR is being built as a real language. `main` is the single canonical development line. New syntax is promoted only when it has implementation tests and official documentation.
