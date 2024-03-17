package com.example.open_gl_es_demo

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.example.open_gl_es_demo.ui.theme.OpenGLESdemoTheme
import io.github.sceneview.Scene
import io.github.sceneview.animation.Transition.animateRotation
import io.github.sceneview.math.Position
import io.github.sceneview.math.Rotation
import io.github.sceneview.node.ModelNode
import io.github.sceneview.rememberCameraNode
import io.github.sceneview.rememberEngine
import io.github.sceneview.rememberModelLoader
import io.github.sceneview.rememberNode
import kotlin.time.Duration.Companion.seconds
import kotlin.time.DurationUnit.MILLISECONDS

class MainActivity : ComponentActivity() {

    @OptIn(ExperimentalMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            OpenGLESdemoTheme {
                Box(modifier = Modifier.fillMaxSize()) {
                    val engine = rememberEngine()
                    val modelLoader = rememberModelLoader(engine)

                    val cameraNode = rememberCameraNode(engine).apply {
                        position = Position(z = 4.0f)
                    }
                    val centerNode = rememberNode(engine)
                        .addChildNode(cameraNode)
                    val cameraTransition = rememberInfiniteTransition(label = "CameraTransition")
                    val cameraRotation by cameraTransition.animateRotation(
                        initialValue = Rotation(y = 0.0f),
                        targetValue = Rotation(y = 360.0f),
                        animationSpec = infiniteRepeatable(
                            animation = tween(durationMillis = 5.seconds.toInt(MILLISECONDS))
                        )
                    )

                    val model = rememberNode {
                        ModelNode(
                            modelInstance = modelLoader.createModelInstance(
                                assetFileLocation = "models/skull.glb",
                            ),
                            scaleToUnits = 1.0f,
                            centerOrigin = Position(0f, 0f , 0f),
                        )
                    }
                    model.apply{rotation = Rotation(-90f, 0f, 0f)}

                    Scene(
                        modifier = Modifier.fillMaxSize(),
                        engine = engine,
                        modelLoader = modelLoader,
                        cameraNode = cameraNode,
                        childNodes = listOf(
                            centerNode,
                            model
                        ),
                        onFrame = {
                            centerNode.rotation = cameraRotation
                            cameraNode.lookAt(centerNode)
                        }
                    )
                }
            }
        }
    }
}