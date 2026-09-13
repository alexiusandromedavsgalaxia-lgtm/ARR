# ARR Components

ARR components are language-level declarative values. React is an influence on the tree-oriented idea, not a runtime dependency.

## Declaration

```arr
component Greeting(name: Text) {
    render {
        Text("hello ${name}")
    }
}
```

## Props

Props are immutable inputs by default.

```arr
component Profile(name: Text, age: Int) {
    render {
        Column {
            Text(name)
            Text("age = ${age}")
        }
    }
}
```

## State

`state` is component-local reactive mutable state:

```arr
component Counter {
    state count: Int = 0

    render {
        Text("count = ${count}")
        Button("add") on click {
            count += 1
        }
    }
}
```

A state read during rendering creates a dependency. A state write invalidates dependent render work.

## Signals

`signal` is the general reactive primitive:

```arr
signal theme: Text = "dark"
```

Signals can be consumed by multiple components and non-UI runtime code.

## Tree nodes

ARR uses ordinary language expressions to describe a tree rather than embedding JSX:

```arr
Column {
    Text("hello")
    Row {
        Button("A")
        Button("B")
    }
}
```

A node may be a built-in renderer value or another ARR component.

## Events

The canonical event attachment form is deliberately ARR-specific:

```arr
Button("save") on click {
    save()
}
```

Event payloads use a scoped parameter form:

```arr
Slider() on change(value) {
    volume = value
}
```

## Conditional trees

```arr
if loggedIn {
    Text("welcome")
} else {
    Button("sign in") on click {
        signIn()
    }
}
```

## Identity and lifecycle

A component instance has stable identity independent of its current rendered shape. The intended lifecycle is create, initialize, mount, render, subscribe, update, rerender, unmount, release.

Lifecycle hooks are still experimental syntax and are not a v0.1 compatibility promise.

## Renderer independence

The same ARR component model is intended to support web, desktop, mobile, terminal, embedded and test renderers. The core language does not require a particular visual platform.

## Why not JSX?

Because ARR deliberately keeps one grammar. UI code is parsed as ARR, typed as ARR, and executed by ARR. There is no second markup language hidden inside strings of angle brackets.
