# ARR Android Runtime

ARR can package a Kotlin `MainActivity` into an Android APK using the Android Gradle Plugin.

## Local build

From the repository root:

```bash
node tools/build-kotlin-apk.mjs --source examples/kotlin/MainActivity.kt
```

The builder normalizes the Kotlin package to `dev.arr.runtime`, injects the source into the Android runtime template, and runs `gradle :app:assembleDebug`.

The APK is produced at:

```text
android-runtime/app/build/outputs/apk/debug/app-debug.apk
```

## GitHub Actions

`.github/workflows/build-apk.yml` builds the runtime on changes to the Android runtime, the example Kotlin app, or the builder. It can also be started manually with `workflow_dispatch`.

The manual workflow accepts `kotlin_source`, for example:

```text
examples/kotlin/MainActivity.kt
```

After the job finishes, GitHub exposes `arr-app-debug-apk` as a downloadable workflow artifact.

## Runtime API

`ARRRuntime` provides a small Android-native application surface:

- `root()` for the application root
- `column(...)` for vertical layout
- `text(...)` for text
- `button(...)` for actions

The runtime is intentionally small so ARR can grow its own Android application model instead of copying another language's syntax.
