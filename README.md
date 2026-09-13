# ARR

ARR is a deliberately strange, expressive programming language with a React-inspired UI model, Kotlin-like type and function syntax, a tiny Swift influence, and its own runtime concepts.

> **ARR is not JavaScript with funny punctuation.**

## Design DNA

- React influence: declarative components, props, state, fragments, reactive rendering.
- Kotlin influence: `val`, `var`, nullable types, concise functions, type inference, expression-oriented control flow.
- Swift influence: lightweight optionals and explicit `some`/`none` values.
- ARR-native: `signal`, `spawn`, `boot`, `panic`, `reboot`, pipeline operators, strange literals, and kernel-aware modules.

## First syntax

```arr
package hello

val name: Text = "ARR"
var count = 0

fn greet(who: Text) -> Text {
    return "hello ${who}"
}

component App {
    state count: Int = 0

    render {
        Column {
            Text("${greet(name)}")
            Button("+1") on click {
                count += 1
            }
            Text("count = ${count}")
        }
    }
}

boot App()
```

## Status

ARR is currently in the language-foundation phase. The repository is being built from the grammar and lexer upward so the syntax remains coherent instead of becoming a pile of unrelated features.

See `LANGUAGE.md` for the initial language contract.
