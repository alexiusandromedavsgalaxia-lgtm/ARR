# ARR Official Language Reference

Version 0.1 foundation. This document is the normative human-facing reference for the ARR language. When an implementation disagrees with this document, the implementation is wrong unless the document is explicitly marked experimental.

## 0. Language identity

ARR is a general-purpose language with a native declarative UI layer. Its influences are intentionally uneven: React contributes the idea of describing UI as a tree, Kotlin contributes concise typed declarations and `val`/`var`, Swift contributes a very small optional-value influence, and ARR supplies the remaining grammar, runtime model, module model, signals, boot semantics, and kernel vocabulary.

ARR is not JSX, JavaScript, Kotlin, Swift, or a transpiler syntax. Similar-looking constructs do not imply identical semantics.

## 1. Source units

The canonical source extension is `.arr`. A project may contain ordinary modules, UI modules, runtime modules, and kernel-aware modules. Source is Unicode text and is interpreted as UTF-8.

A source file consists of zero or more declarations and statements. Whitespace is normally insignificant except inside literals. Statements may optionally end with `;`; the reference formatter may insert or remove semicolons without changing meaning.

## 2. Names

Identifiers begin with an ASCII letter or `_` and may contain letters, digits, and `_`. Names are case-sensitive.

Recommended conventions:

- types/components: `PascalCase`
- functions/variables/signals: `camelCase`
- constants: `SCREAMING_SNAKE_CASE` when the constant is public and semantic
- modules: lowercase dotted names or filesystem names

Reserved words include `import`, `from`, `fn`, `if`, `else`, `while`, `for`, `return`, `boot`, `const`, `val`, `var`, `let`, `component`, `state`, `render`, `true`, `false`, `null`, `kernelPanic`, and `reboot`, plus the primitive type words.

## 3. Values

ARR values are classified as numeric, boolean, textual, unit, optional, array, map/object, function, component, signal, or runtime handle values.

The foundation recognizes integer families, floating-point families, `string`, `bool`, and `any`. The long-term public spelling is `Int8`, `Int16`, `Int32`, `Int64`, `UInt8`, `UInt16`, `UInt32`, `UInt64`, `Float32`, `Float64`, `Bool`, `Text`, `Byte`, `Unit`, and `Any`.

The implementation may accept lowercase aliases during the compatibility period.

## 4. Literals

### Integer

```arr
0
42
-7
```

### Floating point

```arr
3.14
0.5
```

### Boolean

```arr
true
false
```

### Null/none

The canonical absence value is `none`. `null` is accepted by the foundation parser as a compatibility literal.

### Text

```arr
"hello"
```

Escape sequences include `\\`, `\"`, `\n`, and `\t`.

Interpolation uses `${ ... }` and is an ARR expression, not a textual macro.

### Arrays

```arr
[1, 2, 3]
["a", "b"]
```

## 5. Declarations

ARR deliberately supports multiple declaration spellings because the language has a strange surface grammar.

```arr
val answer: Int = 42
var counter = 0
const version: Text = "0.1"
let temporary = 10
Int score = 100
int8 byteValue = 255
```

`val`, `const`, and `let` are immutable by contract. `var` and explicitly mutable declarations may be reassigned.

A type annotation follows a colon in Kotlin-like form or precedes the name in compact ARR form.

## 6. Type inference

When an initializer exists, the compiler may infer its static type.

```arr
val name = "ARR"
val count = 3
```

Inference does not mean dynamic typing. Once a value receives a static type, incompatible assignments are diagnostics.

## 7. Optional types

`T?` means a value is either a valid `T` or `none`.

```arr
var selected: Text? = none
```

Optional access is written `?.`:

```arr
selected?.length
```

The fallback operator is `?:`:

```arr
val visible = selected ?: "nothing selected"
```

The runtime must not evaluate a member operation after an optional receiver becomes `none`.

## 8. Functions

Canonical function syntax:

```arr
fn add(a: Int, b: Int) -> Int {
    return a + b
}
```

Expression functions:

```arr
fn double(x: Int) -> Int = x * 2
```

Parameters are immutable bindings unless explicitly declared otherwise by a future parameter modifier.

Functions are first-class values.

## 9. Calls

```arr
print("hello")
add(2, 3)
```

Arguments are evaluated left-to-right.

## 10. Operators

The core precedence, highest first, is:

1. call and member access
2. unary `!`, unary `+`, unary `-`
3. `*`, `/`, `%`
4. `+`, `-`
5. `<`, `<=`, `>`, `>=`
6. `==`, `!=`
7. `&&`
8. `||`
9. assignment `=`, `+=`, `-=`, `*=`, `/=`

ARR also reserves `|>` for the native pipeline and `?:` for optional fallback.

## 11. Control flow

```arr
if score >= 10 {
    print("win")
} else {
    print("again")
}
```

```arr
while running {
    tick()
}
```

The complete control-flow family includes `if`, `else`, `while`, `for`, `return`, and block scopes. `for` is reserved in the lexer and is part of the public grammar target even where the initial interpreter remains conservative.

## 12. Blocks and scope

A block introduces a lexical scope. Inner scopes may read outer bindings. Reassignment walks outward until the binding is found. Declaring a name in an inner scope shadows an outer name.

```arr
val x = 1
{
    val x = 2
    print(x)
}
print(x)
```

## 13. Components

A component is an ARR value whose primary purpose is to describe a UI tree.

```arr
component Greeting(name: Text) {
    render {
        Text("hello ${name}")
    }
}
```

Components are not HTML templates. They are language-level declarations.

## 14. State

`state` declares component-local mutable state.

```arr
component Counter {
    state count: Int = 0

    render {
        Text("${count}")
    }
}
```

A state read during rendering establishes a reactive dependency. A state write invalidates dependent render work.

## 15. Signals

A `signal` is a general reactive value.

```arr
signal online: Bool = false
```

Signals differ from ordinary variables because reads can participate in dependency tracking.

## 16. UI tree syntax

ARR uses constructor-like nodes:

```arr
Column {
    Text("hello")
    Row {
        Button("A")
        Button("B")
    }
}
```

Properties may eventually use a compact `name: value` form. Events use ARR's distinctive attachment form:

```arr
Button("save") on click {
    save()
}
```

## 17. Modules and imports

Filesystem import:

```arr
import KernelPanic from ./kernel/panic.arr
```

Named imports:

```arr
import { print, len } from std.io
```

Import resolution is deterministic. Relative paths resolve relative to the importing source file. Standard-library names resolve through the ARR toolchain's standard-library root.

## 18. Boot

Boot is a language construct rather than a convention imposed by the CLI.

```arr
boot {
    main()
}
```

A component can also be the boot target in the UI runtime:

```arr
boot App()
```

Boot execution occurs after declarations in the module have been registered.

## 19. Kernel vocabulary

ARR intentionally has a kernel-flavored layer. It is a runtime abstraction, not a claim that every ARR program directly manipulates the host operating system.

```arr
kernelPanic {{
    stopAllProcess()
}}
```

The runtime may expose `reboot`, `stopAllProcess`, process handles, and privileged module operations. Sandboxed execution can deny privileged operations.

## 20. Reboot

```arr
reboot
```

or:

```arr
reboot()
```

The first is a control statement. The second resolves through the runtime built-in. A compliant runtime raises a reboot control signal and must not silently continue the current boot sequence.

## 21. Pipelines

```arr
value |> trim() |> normalize() |> print()
```

Pipeline semantics are specified as left-value insertion into the first argument position of the next callable stage. A compiler may optimize the chain without changing observable evaluation order.

## 22. Comments

Line comments:

```arr
// comment
```

Block comments are part of the language contract even if a foundation lexer initially implements only line comments:

```arr
/* comment */
```

## 23. Diagnostics

Every syntax diagnostic should identify the source file, line, column, diagnostic class, and a short explanation. A future diagnostic renderer may add a source excerpt and caret.

Canonical format:

```text
ARR E1002 parser: expected ')' at example.arr:12:19
```

Diagnostics are stable enough to be used by editors and CI. Human wording may improve, but error codes should not be casually recycled.

## 24. Runtime determinism

The interpreter evaluates expressions in a deterministic order. Function arguments are left-to-right. Reactive invalidation is queued deterministically. Privileged process scheduling may be concurrent in a future runtime, but observable language semantics must define ordering where user code can observe it.

## 25. Compatibility promise

ARR v0.x is experimental, but syntax already published as normative should not be changed silently. Breaking changes require a language-version note and migration guidance.

## 26. What is deliberately not ARR

ARR does not parse JSX. ARR does not require JavaScript. ARR does not treat React as a runtime dependency. ARR does not pretend `kernelPanic` is a magical replacement for an operating-system kernel. Those are all important boundaries.

## 27. Canonical tiny program

```arr
val name: Text = "ARR"
var count: Int = 0

fn hello(who: Text) -> Text {
    return "hello ${who}"
}

component App {
    state count: Int = 0

    render {
        Column {
            Text(hello(name))
            Button("increment") on click {
                count += 1
            }
            Text("count = ${count}")
        }
    }
}

boot {
    print(hello(name))
}
```
