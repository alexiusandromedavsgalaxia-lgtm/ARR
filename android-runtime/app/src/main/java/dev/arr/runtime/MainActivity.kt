package dev.arr.runtime

import android.os.Bundle
import androidx.activity.ComponentActivity

class MainActivity : ComponentActivity() {
    private lateinit var runtime: ARRRuntime

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        runtime = ARRRuntime(this)
        setContentView(buildApp())
    }

    private fun buildApp() = runtime.root().apply {
        addView(runtime.column(
            runtime.text("ARR App Runtime", 28f),
            runtime.text("Kotlin → Android APK", 20f),
            runtime.text("Esta aplicación es la plantilla ejecutable del runtime de ARR."),
            runtime.button("Probar runtime") {
                setContentView(runtime.column(
                    runtime.text("ARR Runtime activo", 26f),
                    runtime.text("La aplicación Kotlin está ejecutándose dentro del contenedor Android de ARR."),
                    runtime.button("Volver") { setContentView(buildApp()) }
                ))
            }
        ))
    }
}
