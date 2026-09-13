package dev.arr.runtime

import android.content.res.Configuration
import android.os.Bundle
import android.graphics.Color
import android.view.Gravity
import android.view.View
import android.widget.LinearLayout
import android.widget.Space
import androidx.activity.ComponentActivity

class MainActivity : ComponentActivity() {
    private lateinit var runtime: ARRRuntime
    private var selectedTab = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        runtime = ARRRuntime(this)
        setContentView(buildApp())
    }

    private fun isTablet(): Boolean {
        return (resources.configuration.screenLayout and Configuration.SCREENLAYOUT_SIZE_MASK) >=
            Configuration.SCREENLAYOUT_SIZE_LARGE
    }

    private fun buildApp(): View {
        return if (isTablet()) buildTabletApp() else buildMobileApp()
    }

    private fun buildMobileApp(): View {
        val root = runtime.root()
        root.setPadding(0, 0, 0, 0)

        val content = runtime.column(
            runtime.text("ARR App Builder", 26f),
            runtime.text("Aplicaciones Android desde ARR", 17f),
            runtime.text("Diseña · escribe Kotlin · compila APK"),
            runtime.button("Nueva aplicación") {
                showMobileMessage("Nueva aplicación", "Crea un proyecto Android nuevo desde el runtime de ARR.")
            },
            runtime.button("Mis proyectos") {
                showMobileMessage("Mis proyectos", "Aquí aparecerán tus aplicaciones ARR y Kotlin.")
            },
            runtime.button("Compilar APK") {
                showMobileMessage("Compilación", "El proyecto se enviará al pipeline de Gradle para generar la APK.")
            }
        )
        content.setPadding(20, 28, 20, 16)

        val scroll = android.widget.ScrollView(this).apply {
            addView(content)
            setBackgroundColor(Color.rgb(15, 15, 18))
        }

        val tabs = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
            setPadding(6, 8, 6, 8)
            setBackgroundColor(Color.rgb(24, 24, 28))
        }

        val tabNames = listOf("Inicio", "Código", "Proyectos", "Ajustes")
        tabNames.forEachIndexed { index, name ->
            val tab = runtime.button(name) {
                selectedTab = index
                showMobileTab(index)
            }
            tabs.addView(tab, LinearLayout.LayoutParams(0, 58, 1f))
        }

        root.addView(scroll, LinearLayout.LayoutParams(-1, 0, 1f))
        root.addView(tabs, LinearLayout.LayoutParams(-1, 66))
        return root
    }

    private fun showMobileTab(index: Int) {
        val title = when (index) {
            0 -> "Inicio"
            1 -> "Código"
            2 -> "Proyectos"
            else -> "Ajustes"
        }
        val message = when (index) {
            0 -> "Panel principal del runtime."
            1 -> "Editor y herramientas Kotlin/ARR."
            2 -> "Tus proyectos y sus APK."
            else -> "Configuración del runtime y compilación."
        }
        showMobileMessage(title, message)
    }

    private fun showMobileMessage(title: String, message: String) {
        setContentView(runtime.column(
            runtime.text(title, 28f),
            runtime.text(message, 17f),
            runtime.button("Volver") { setContentView(buildApp()) }
        ))
    }

    private fun buildTabletApp(): View {
        val root = runtime.root()
        root.addView(runtime.column(
            runtime.text("ARR App Builder", 32f),
            runtime.text("Interfaz tablet", 20f),
            runtime.text("En pantallas grandes ARR puede mostrar navegación y contenido simultáneamente."),
            runtime.button("Nueva aplicación") { showMobileMessage("Nueva aplicación", "Proyecto nuevo") },
            runtime.button("Proyectos") { showMobileMessage("Proyectos", "Lista de proyectos") },
            runtime.button("Compilar APK") { showMobileMessage("Compilar", "Preparando Gradle") }
        ), LinearLayout.LayoutParams(-1, -1))
        return root
    }
}
