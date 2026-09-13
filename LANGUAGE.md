# ARR Language Contract v0.1

## 1. What ARR is

ARR is a hybrid language. It borrows ideas from declarative UI systems, Kotlin-style concise typed code, a very small amount of Swift-like optionality, and a deliberately original runtime model.

The goal is a language that can describe ordinary programs and reactive interfaces without splitting the project into a programming language plus a separate UI language.

## 2. Source files

- `.arr` source files
- `arrconfig.json` project configuration
- `arr.lock` dependency lockfile (future)

## 3. Core values

The initial primitive vocabulary is intentionally small:

```text
Int8  Int16  Int32  Int64
UInt8 UInt16 UInt32 UInt64
Float32 Float64
Bool
Text
Byte
Unit
Any
```

Arrays use `Array<T>` and maps use `Map<K, V>`.

Nullable values use `T?`.

```arr
var title: Text? = none
val answer: Int = 42
```

## 4. Variables

```arr
val immutable = 10
var mutable = 20
```

`val` cannot be reassigned. `var` can.

Type inference is preferred when the type is obvious.

## 5. Functions

```arr
fn add(a: Int, b: Int) -> Int {
    return a + b
}
```

A single-expression function can use `=`:

```arr
fn double(x: Int) -> Int = x * 2
```

## 6. Control flow

```arr
if score >= 10 {
    print("win")
} else {
    print("again")
}

while running {
    tick()
}
```

`if` is an expression and can produce a value.

## 7. Interpolation

Strings may contain `${expression}`:

```arr
val message = "hello ${name}, count=${count}"
```

## 8. ARR-native signals

A `signal` is mutable reactive state. Reading a signal establishes a dependency for a reactive consumer.

```arr
signal count: Int = 0

count += 1
```

The exact scheduler is an implementation detail. The language contract only requires deterministic dependency tracking.

## 9. Components

Components are declarative values that can render a tree.

```arr
component Counter {
    state count: Int = 0

    render {
        Column {
            Text("count: ${count}")
            Button("add") on click {
                count += 1
            }
        }
    }
}
```

A component body is not HTML, JSX, or JavaScript. It is ARR syntax.

## 10. Props

```arr
component Greeting(name: Text) {
    render {
        Text("hello ${name}")
    }
}
```

## 11. Events

ARR uses the unusual `on event {}` form:

```arr
Button("save") on click {
    save()
}
```

This keeps events visually attached to the thing producing them.

## 12. Pipelines

ARR defines `|>` as a native pipeline operator:

```arr
value |> trim() |> normalize() |> print()
```

The pipeline is syntax, not a macro.

## 13. Optionals

The optional model is deliberately tiny:

```arr
val maybeName: Text? = none

val shown = maybeName ?: "anonymous"
```

`?.` performs optional access.

## 14. Modules

```arr
import KernelPanic from ./kernel/panic.arr
import { print, read } from std.io
```

## 15. Kernel-aware operations

ARR can expose privileged runtime concepts without pretending that an ordinary application is a real operating-system kernel.

```arr
kernel {
    process.spawn(worker)
}
```

The interpreter/compiler may reject kernel operations when running in a restricted user runtime.

## 16. Panic and reboot

These are ARR-native runtime controls:

```arr
panic("fatal state")
reboot
```

A kernel module may provide the more theatrical form:

```arr
kernelPanic {{
    stopAllProcess()
}}
```

`kernelPanic {{ ... }}` is parsed as a special ARR construct, not as an arbitrary block comment.

## 17. Boot

A program may declare its entry point with:

```arr
boot App()
```

or:

```arr
boot {
    main()
}
```

## 18. Comments

```arr
// line comment

/* block comment */
```

## 19. Deliberately weird syntax

ARR allows a small set of distinctive constructs so it does not collapse into Kotlin-with-React:

```arr
signal count := 0

value |> ?print

component ~ App {
    render => Column {
        Text("ARR")
    }
}
```

These forms are experimental in v0.1 and must not be implemented until they have grammar tests.

## 20. Non-goals for v0.1

- No JSX compatibility.
- No JavaScript parser.
- No pretending to compile native machine code before the language semantics exist.
- No framework-specific syntax disguised as core grammar.

The first implementation target is a deterministic lexer + parser + AST + interpreter. Native compilation can come later.
