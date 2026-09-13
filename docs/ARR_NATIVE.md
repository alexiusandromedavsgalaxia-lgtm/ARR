# ARR Native Grammar

This document defines the deliberately strange part of ARR. React is the only external design influence retained by the project. The syntax and runtime semantics below are ARR-owned.

## 1. Signals

A signal is a reactive cell.

```arr
signal clicks: int = 0
```

Reading `clicks` inside an ordinary expression reads its current value. Writing to it invalidates registered watchers.

## 2. Watchers

```arr
watch clicks {
    print("changed")
}
```

A watcher is attached to one signal. When the signal changes, its block executes.

## 3. Emit

`emit` changes a signal without exposing the runtime cell itself.

```arr
emit clicks(clicks + 1)
```

This is intentionally not an event-emitter library API. It is core ARR syntax.

## 4. Derived values

```arr
derive label = "clicks=" + clicks
```

A derived binding describes a value computed from the current environment. The first runtime implementation stores the computed value; the reactive scheduler is an evolving part of the language contract.

## 5. Components

```arr
component Counter {
    state title: string = "ARR"

    render {
        Column {
            Text(title)
            Button("+") {
                emit clicks(clicks + 1)
            }
        }
    }
}
```

The component tree is declarative. It is not JSX and does not require JavaScript.

## 6. Strange-by-design rules

ARR intentionally avoids compatibility aliases from other languages. There is one canonical spelling for each core construct.

The language may add unusual punctuation and operators in future revisions, but every such feature must have:

1. a lexer rule,
2. an AST representation,
3. parser tests,
4. runtime semantics,
5. diagnostic behavior,
6. official documentation.

## 7. Runtime vocabulary

`boot` defines startup work. `kernelPanic {{ ... }}` represents a privileged fatal runtime transition. `reboot` requests a runtime restart transition.

These constructs are part of ARR's execution model rather than UI framework APIs.

## 8. Design rule

If a feature can be implemented as a normal library call without changing ARR's grammar or semantics, it should remain a library feature. Core ARR syntax is reserved for concepts that genuinely belong to the language.
