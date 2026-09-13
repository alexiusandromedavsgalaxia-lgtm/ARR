# ARR Modules and Standard Library

## Modules

A module is a source unit with a stable name and explicit exports/imports.

Relative import:

```arr
import KernelPanic from ./kernel/panic.arr
```

Named import:

```arr
import { print, len } from std.io
```

Import resolution is deterministic. Relative paths resolve from the importing file. Standard modules resolve from the ARR standard-library root. Implementations must reject ambiguous resolution rather than silently selecting a random file.

## Module initialization

Module declarations are loaded before boot execution. A module is initialized at most once per runtime module graph unless a future isolated-loader feature explicitly requests a fresh instance.

## Cycles

Cyclic dependencies are legal only where declarations can be resolved without requiring an uninitialized value. The loader must report a cycle diagnostic when initialization order becomes impossible.

## Standard library philosophy

The standard library should expose ordinary capabilities without making the language itself enormous. The core language owns syntax and semantics; the library owns reusable APIs.

Planned standard modules:

- `std.io` for text and stream I/O
- `std.fs` for filesystem access
- `std.text` for Unicode/text helpers
- `std.math` for numeric functions
- `std.collections` for arrays/maps and collection algorithms
- `std.time` for clocks and durations
- `std.process` for process abstractions
- `std.net` for network APIs
- `std.ui` for renderer-neutral UI primitives
- `std.test` for tests and assertions
- `std.kernel` for privileged runtime capabilities

## `std.io`

Conceptual API:

```arr
print("hello")
println("hello")
```

Future stream APIs use typed readers and writers rather than untyped host objects.

## `std.text`

Text is Unicode-aware. The standard library must distinguish bytes, Unicode scalar values, and user-perceived characters rather than assuming one byte equals one character.

## `std.collections`

Collections provide iteration, mapping, filtering, folding, searching, sorting, and stable indexing where appropriate.

## `std.process`

Process operations are capability-controlled. A normal sandbox may expose no process creation at all.

## `std.kernel`

Kernel APIs are privileged and may be unavailable in ordinary applications. The language syntax can remain present while the runtime denies the capability.

## Lockfile

`arr.lock` is reserved for deterministic dependency resolution. The lockfile format will contain module identity, source hash, version and dependency metadata.

## Package configuration

`arrconfig.json` is the project configuration format. The intended top-level fields are:

```json
{
  "name": "my-arr-app",
  "version": "0.1.0",
  "entry": "src/main.arr",
  "language": "0.1"
}
```

Unknown fields should be ignored by older tooling when they are explicitly namespaced as experimental.
