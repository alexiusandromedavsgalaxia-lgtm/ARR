# ARR Native System Target

ARR now has its first genuinely freestanding execution target: `x86-bios`.

## What this means

A `.arr` program containing a `boot { ... }` block can be lowered to NASM assembly and assembled into a 512-byte BIOS boot sector. The generated image is not an ARR interpreter bundle and does not need Node.js at runtime.

Example:

```arr
boot {
    print("ARR OS is alive!")
}
```

Build it with:

```text
npm run build
node dist/cli.js build examples/hello-os.arr --target=x86-bios --out build/arr-os.img
```

The result is a bootable raw image. In QEMU:

```text
qemu-system-x86_64 -drive format=raw,file=build/arr-os.img
```

## Current native ABI

The first ABI deliberately starts tiny:

- BIOS boot entry at `0x7c00`;
- 16-bit real-mode execution;
- stack initialization;
- BIOS teletype output through `int 0x10`;
- halt loop after ARR boot code finishes.

This is the foundation, not the finished ARR operating-system platform. The next native layers are a stage-2 loader, protected/long mode transition, physical memory management, interrupts, a scheduler, system calls, drivers, a filesystem, process isolation and a richer native code generator.

The important contract is now real: ARR source can cross the boundary from language/runtime code into a freestanding machine-executable artifact.
