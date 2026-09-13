# ARR

ARR is a deliberately strange, expressive language built from its own syntax with a small React-inspired UI layer, Kotlin-like declarations, and a light Swift influence.

## v0.1 foundation

- `.arr` source files
- lexer and parser
- AST
- primitive types and arrays
- variables/constants
- expressions and calls
- `if`, `else`, `while`, `for`
- functions and `return`
- `boot {}` blocks
- `kernelPanic {{ ... }}` and `reboot`
- member access with `.`
- React-inspired component syntax through `component`
- Kotlin-inspired `val`/`var` aliases
- Swift-inspired `let` and optional `?` type marker

This first foundation is intentionally not a clone of any existing language. The grammar is designed to grow into ARR's own identity.

## Example

```arr
component App {
    state count: int = 0

    render {
        Text("count = ${count}")
        Button("+1") {
            count += 1
        }
    }
}

fn main() {
    print("ARR online")
}

boot {
    main()
}
```

## Running

The runtime foundation is implemented in TypeScript. Build with `npm run build`, then execute an `.arr` file with `node dist/cli.js examples/hello.arr`.
