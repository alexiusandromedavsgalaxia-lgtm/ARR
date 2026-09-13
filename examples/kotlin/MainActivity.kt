import android.os.Bundle
import androidx.activity.ComponentActivity
import dev.arr.runtime.ARRRuntime

class MainActivity : ComponentActivity() {
    private lateinit var runtime: ARRRuntime

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        runtime = ARRRuntime(this)

        setContentView(
            runtime.column(
                runtime.text("Mi aplicación ARR", 28f),
                runtime.text("Código Kotlin convertido en APK."),
                runtime.button("Hola desde ARR") {
                    setContentView(
                        runtime.column(
                            runtime.text("¡Funciona!", 32f),
                            runtime.text("Este código salió del proyecto ARR y terminó dentro de una APK Android.")
                        )
                    )
                }
            )
        )
    }
}
