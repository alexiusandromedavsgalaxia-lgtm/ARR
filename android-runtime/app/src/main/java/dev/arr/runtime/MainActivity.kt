package dev.arr.runtime

import android.content.res.Configuration
import android.graphics.Color
import android.os.Bundle
import android.view.Gravity
import android.view.View
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import androidx.activity.ComponentActivity

class MainActivity : ComponentActivity() {
    private lateinit var content: LinearLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(buildApp())
        showPage(0)
    }

    private fun isTablet() = (resources.configuration.screenLayout and Configuration.SCREENLAYOUT_SIZE_MASK) >= Configuration.SCREENLAYOUT_SIZE_LARGE

    private fun buildApp(): View {
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.rgb(15, 15, 18))
        }
        if (isTablet()) {
            val body = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
            val nav = buildNavigation(true)
            content = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(32, 28, 32, 24)
            }
            val scroll = ScrollView(this).apply { addView(content) }
            body.addView(nav, LinearLayout.LayoutParams(260, -1))
            body.addView(scroll, LinearLayout.LayoutParams(0, -1, 1f))
            root.addView(body, LinearLayout.LayoutParams(-1, 0, 1f))
        } else {
            content = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(20, 28, 20, 20)
            }
            root.addView(ScrollView(this).apply { addView(content) }, LinearLayout.LayoutParams(-1, 0, 1f))
            root.addView(buildNavigation(false), LinearLayout.LayoutParams(-1, 76))
        }
        return root
    }

    private fun buildNavigation(tablet: Boolean): LinearLayout {
        val nav = LinearLayout(this).apply {
            orientation = if (tablet) LinearLayout.VERTICAL else LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
            setPadding(6, 8, 6, 8)
            setBackgroundColor(Color.rgb(24, 24, 28))
        }
        listOf("Inicio", "Código", "Proyectos", "Ajustes").forEachIndexed { index, label ->
            nav.addView(android.widget.Button(this).apply {
                text = label
                setOnClickListener { showPage(index) }
            }, if (tablet) LinearLayout.LayoutParams(-1, 64) else LinearLayout.LayoutParams(0, 64, 1f))
        }
        return nav
    }

    private fun showPage(index: Int) {
        content.removeAllViews()
        val titles = listOf("ARR App Builder", "Código", "Proyectos", "Ajustes")
        val messages = listOf(
            "Aplicaciones Android desde ARR. La navegación funciona sin reemplazar la pantalla completa.",
            "Editor ARR/Kotlin y herramientas de previsualización.",
            "Tus proyectos y las APK generadas por el pipeline de Android.",
            "Configuración del runtime y del proceso de compilación."
        )
        content.addView(TextView(this).apply {
            text = titles[index]
            textSize = 28f
            setTextColor(Color.WHITE)
            setPadding(0, 0, 0, 16)
        })
        content.addView(TextView(this).apply {
            text = messages[index]
            textSize = 17f
            setTextColor(Color.LTGRAY)
            setPadding(0, 0, 0, 24)
        })
        if (index == 0) {
            content.addView(android.widget.Button(this).apply {
                text = "Probar ARR"
                setOnClickListener { status("¡ARR está funcionando!") }
            })
        }
    }

    private fun status(message: String) {
        content.addView(TextView(this).apply {
            text = message
            textSize = 20f
            setTextColor(Color.WHITE)
            setPadding(0, 24, 0, 0)
        })
    }
}
