package dev.arr.runtime

import android.content.Context
import android.graphics.Color
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView

class ARRRuntime(private val context: Context) {
    fun column(vararg children: View): LinearLayout = LinearLayout(context).apply {
        orientation = LinearLayout.VERTICAL
        setPadding(24, 24, 24, 24)
        children.forEach { addView(it, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)) }
    }

    fun text(value: String, size: Float = 18f): TextView = TextView(context).apply {
        text = value
        textSize = size
        setTextColor(Color.WHITE)
        setPadding(0, 12, 0, 12)
    }

    fun button(label: String, action: () -> Unit): Button = Button(context).apply {
        text = label
        setOnClickListener { action() }
    }

    fun root(): LinearLayout = LinearLayout(context).apply {
        orientation = LinearLayout.VERTICAL
        gravity = Gravity.TOP
        setBackgroundColor(Color.rgb(15, 15, 18))
    }
}
