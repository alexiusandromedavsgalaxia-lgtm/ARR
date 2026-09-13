# ARR Type System

## 1. Philosophy

ARR is statically typed by design, with inference for local declarations. The runtime still carries type information because ARR can run interpreted and because UI/state boundaries need runtime validation.

The type system has three layers:

1. primitive types;
2. structural/container types;
3. runtime-native types such as functions, components, signals, and handles.

## 2. Primitive types

| Type | Meaning |
|---|---|
| `Int8` | signed 8-bit integer |
| `Int16` | signed 16-bit integer |
| `Int32` | signed 32-bit integer |
| `Int64` | signed 64-bit integer |
| `UInt8` | unsigned 8-bit integer |
| `UInt16` | unsigned 16-bit integer |
| `UInt32` | unsigned 32-bit integer |
| `UInt64` | unsigned 64-bit integer |
| `Float32` | IEEE-style single precision value |
| `Float64` | IEEE-style double precision value |
| `Bool` | `true` or `false` |
| `Text` | Unicode text |
| `Byte` | one byte value |
| `Unit` | no meaningful value |
| `Any` | explicitly dynamic value |

Lowercase names such as `int`, `int8`, `uint64`, `string`, `bool`, `float`, and `double` are compatibility spellings in the foundation.

## 3. Arrays

`Array<T>` contains values of one element type.

```arr
val numbers: Array<Int32> = [1, 2, 3]
```

The shorthand `T[]` is reserved for the compact syntax family:

```arr
Int32[] numbers = [1, 2, 3]
```

## 4. Maps

`Map<K,V>` associates keys with values. Keys must satisfy the runtime's stable-key contract.

```arr
val ports: Map<Text, Int32> = {
    "http": 80,
    "https": 443
}
```

Map literal syntax is scheduled for the full parser even if the v0.1 foundation initially exposes maps through standard-library functions.

## 5. Optionals

`T?` is a sum of `T` and `none`.

```arr
var title: Text? = none
```

Optional access:

```arr
title?.length
```

Fallback:

```arr
title ?: "untitled"
```

The optional operator is not a Boolean test. It preserves the semantic distinction between absence and `false`, `0`, or empty text.

## 6. Function types

A function type is conceptually:

```text
(A, B) -> C
```

Function values close over their lexical environment.

## 7. Component types

A component is a first-class declarative value. Component parameters form props. Component state is scoped to an instance.

## 8. Signal types

`Signal<T>` represents reactive state. A `state` member is syntactic sugar for a component-scoped signal with lifecycle rules.

## 9. Mutability

Type and mutability are separate concepts. `Int32` describes a value; `var` describes whether a binding may be reassigned.

```arr
val x: Int32 = 1
var y: Int32 = 2
```

`x = 3` is a binding error. `y = 3` is valid if the value type remains compatible.

## 10. Numeric rules

Arithmetic must not silently narrow values. Widening is permitted where the destination type can represent the source value. Narrowing requires an explicit conversion function or future cast syntax.

Unsigned values may not become negative.

Integer division semantics are type-directed. Integer divided by integer produces an integer result in integer mode; floating operands produce a floating result.

## 11. Equality

`==` is semantic equality. `!=` is its negation. Equality does not perform arbitrary coercion.

## 12. `Any`

`Any` is an escape hatch, not the default.

```arr
var mystery: Any = readRuntimeValue()
```

Operations on `Any` require runtime checks.

## 13. Type errors

Type errors are compile-time diagnostics when the compiler has enough information. The interpreter must still validate explicit type annotations at runtime.

Canonical message:

```text
ARR E2001 type: cannot assign Text to Int32
```

## 14. Type aliases

Future syntax:

```arr
type UserId = UInt64
type Handler = (Request) -> Response
```

Aliases do not create a new runtime representation unless declared as a distinct nominal type in a future version.

## 15. Generics

The long-term generic grammar uses angle brackets:

```arr
fn first<T>(items: Array<T>) -> T? {
    ...
}
```

Generic constraints and specialization are compiler-level features and are not required for the interpreter foundation.

## 16. Null safety rule

The language should make accidental null/none propagation visible. A non-optional `T` cannot contain `none`.

## 17. Runtime values

The reference runtime uses an internal tagged representation conceptually equivalent to:

```text
Number
Boolean
Text
None
Array
Map
Function
Component
Signal
Handle
Unit
```

The concrete TypeScript implementation may use JavaScript values internally, but public ARR semantics must remain independent of JavaScript coercion quirks.
