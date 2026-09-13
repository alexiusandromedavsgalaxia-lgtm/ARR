# ARR Runtime and Execution Model

## 1. Execution pipeline

The reference implementation is conceptually:

```text
source text
   ↓
lexer
   ↓
tokens
   ↓
parser
   ↓
AST
   ↓
semantic checks
   ↓
module loading
   ↓
runtime environment
   ↓
boot phase
   ↓
program execution
```

A native compiler may replace the final interpreter stages, but the observable language semantics remain the same.

## 2. Environment

Every execution context has an environment chain. A local binding is stored in the nearest lexical environment. Reads search outward. Assignments search outward for the existing binding.

This gives ARR lexical scoping and makes closures possible.

## 3. Functions

Functions capture the environment in which they are declared. Parameters become bindings in a new invocation environment.

A return does not continue execution of the function body. The runtime propagates a return control signal until it reaches the function boundary.

## 4. Boot phase

Top-level declarations are registered first. Boot blocks are collected rather than executed immediately. Once module initialization completes, boot blocks execute in declaration order.

This prevents a boot block from accidentally running before a function declared later in the same file exists.

## 5. Errors

Runtime errors are classified into:

- name errors;
- type errors;
- call errors;
- member-access errors;
- module errors;
- control signals;
- privileged-operation errors.

Control signals such as reboot and kernel panic are not ordinary exceptions from the language user's perspective. They are runtime control transitions.

## 6. Kernel panic

`kernelPanic {{ ... }}` is an explicit privileged control construct. The body executes in the current runtime context. If `stopAllProcess()` is reached, the runtime terminates active ARR execution and reports a panic condition.

The language specification does not require the host operating system itself to panic.

## 7. Reboot

`reboot` terminates the current execution cycle and transfers control to the host launcher or supervisor. A supervised runtime may restart the ARR process. A simple CLI may report the request and exit.

## 8. Loop safety

The foundation interpreter uses a loop guard so an accidentally infinite `while` cannot silently consume an unbounded interpreter process. A production runtime may replace this with cancellation, scheduler cooperation, or explicit resource budgets.

## 9. Determinism

Expression evaluation is left-to-right. Function arguments are left-to-right. Declarations are registered in source order. Boot blocks run in source order.

Future concurrency constructs must specify synchronization and observable ordering explicitly.

## 10. Reactive execution

A component render establishes dependencies when it reads signals or state. A write invalidates dependent render nodes. The scheduler batches invalidations and performs the minimum necessary recomputation.

The public contract does not expose a specific scheduler implementation.

## 11. Runtime handles

Kernel and process features use opaque handles. ARR code should not depend on the host language representation of a handle.

Conceptual examples:

```arr
val worker: ProcessHandle = spawn(workerFn)
worker.stop()
```

## 12. Sandboxing

A runtime may execute ARR in restricted mode. In restricted mode, filesystem, process, kernel, network, and native-extension operations can be denied by capability policy.

Capability failures are deterministic diagnostics, not undefined behavior.

## 13. Memory

The interpreter may rely on the host garbage collector. A native implementation may use reference counting, tracing GC, arenas, or ownership analysis. The language semantics do not require one memory-management strategy.

## 14. ABI boundary

The stable ABI is a future compiler/runtime boundary. ARR values crossing a native boundary must be represented by versioned tagged values. Host pointers must never be exposed as ordinary ARR integers.

## 15. Runtime versioning

The runtime reports its language version and runtime version separately. A runtime can implement several compatible language versions.
