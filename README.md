# ARR

ARR is a deliberately strange programming language with a native declarative UI model and an ARR-original runtime. It is also being grown into a systems language: the same `.arr` source can target a freestanding machine-executable environment.

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
- `docs/FRAMEWORK.md` UI, audio, graphics, input, storage and time framework
- `docs/MODULES.md` modules and standard library
- `docs/DIAGNOSTICS.md` diagnostics
- `docs/TOOLCHAIN.md` CLI and tooling
- `docs/NATIVE.md` freestanding native target and ABI
- `docs/CONFORMANCE.md` compatibility contract
- `docs/ARR_NATIVE.md` ARR-only grammar and reactive primitives

## Native systems target

ARR now has a real `x86-bios` target. A boot block can be lowered to a 512-byte BIOS boot sector, assembled with NASM and executed directly by x86 firmware/QEMU without the ARR interpreter at runtime.

```arr
boot {
    print("ARR OS is alive!")
}
```

```text
npm run build
node dist/cli.js build examples/hello-os.arr --target=x86-bios --out build/arr-os.img
qemu-system-x86_64 -drive format=raw,file=build/arr-os.img
```

This is deliberately the first brick of an ARR-native operating-system stack. The roadmap is to grow the native ABI through a stage-2 loader, long mode, memory management, interrupts, scheduling, processes, system calls, drivers, storage and a real kernel/user boundary.

## Framework foundation

The runtime exposes ARR-owned `UI`, `Audio`, `Graphics`, `Input`, `Storage` and `Time` namespaces. They are backend-neutral foundations, not wrappers around another language's UI framework.

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
src/        lexer, parser, AST, interpreter, framework and native compiler
examples/   canonical ARR programs, including a bootable OS seed
 tests/     lexer, parser and runtime tests
docs/       official ARR language, framework and native-system specification
```

## Status

ARR is being built as a real language and systems toolchain. `main` is the single canonical development line. Native features are promoted only when the compiler contract, generated artifact and CI validation move together.
