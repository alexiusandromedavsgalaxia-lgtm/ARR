# ARR Framework

The ARR framework is the standard library layer around the language runtime. It is deliberately ARR-owned. React is the only outside design influence, limited to declarative composition and reactive UI ideas. The framework does not require React, JavaScript UI libraries, or a platform-specific widget toolkit.

## Framework shape

`Runtime` creates one framework instance and exposes these ARR namespaces:

- `UI` for declarative interface trees
- `Audio` for clips, voices, volume, seeking, haptics and transport state
- `Graphics` for backend-neutral drawing commands
- `Input` for keyboard and pointer state
- `Storage` for process-local persistent-style key/value state
- `Time` for clocks and asynchronous delays

The public TypeScript API is also exported from `src/framework.ts`.

## UI

UI nodes are plain ARR-owned values. A renderer can consume the tree on any supported host.

```text
UI.column([
    UI.text("ARR"),
    UI.row([
        UI.button("play"),
        UI.button("stop")
    ])
])
```

The foundation contains constructors for text, images, icons, boxes, rows, columns, stacks, scrolling regions, buttons, toggles, sliders, text input, canvas and fragments.

`mount()` stores the current root tree and notifies render listeners. This is the first renderer-neutral layer. Native windowing, accessibility, layout, focus, animation and platform renderers are scheduled as later framework modules.

## Audio

Audio is modeled around clips and voices rather than exposing a host audio engine directly.

```text
Audio.load("click", "assets/click.arrsound")
voice = Audio.play("click")
Audio.setVolume(voice, 0.8)
Audio.seek(voice, 2.0)
Audio.stop(voice)
```

The foundation tracks playback state but intentionally does not pretend that a Node interpreter can emit physical sound by itself. Platform audio backends will consume the same voice model.

## Graphics

Graphics produces backend-neutral drawing commands:

```text
Graphics.clear("#000000")
Graphics.rect({x: 10, y: 10, width: 100, height: 50}, "#ffffff")
Graphics.circle({x: 80, y: 80}, 20, "#ff00ff")
Graphics.line({x: 0, y: 0}, {x: 100, y: 100})
```

A future GPU backend can translate these operations to a native graphics API without changing ARR source semantics.

## Input

`Input` owns normalized key and pointer state. Hosts feed it events; ARR programs read state without depending on browser or desktop event objects.

## Storage

`Storage` is a typed key/value surface. The current foundation is in-memory. File-backed, encrypted and platform persistence providers are separate planned layers.

## Time

`Time.now()`, `Time.seconds()` and `Time.sleep(ms)` provide a minimal deterministic vocabulary for application timing. A future scheduler will add frames, timers, cancellation and monotonic clocks.

## Framework roadmap

The framework is intentionally being built in layers rather than pretending a small interpreter already equals a mature operating-system SDK.

1. UI tree and renderer contract
2. reactive render scheduler and component lifecycle
3. layout, focus and accessibility
4. animation and transitions
5. audio graph, spatial audio and decoding backends
6. GPU command buffers, textures, fonts and shaders
7. input devices, gestures and gamepad support
8. filesystem, secure storage and permissions
9. networking, streams and serialization
10. windows, scenes, application lifecycle and platform adapters
11. testing, inspection, profiling and developer tooling

Each promoted feature must have ARR semantics, implementation code, tests and documentation before becoming part of the stable framework contract.
