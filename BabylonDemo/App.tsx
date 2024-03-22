import React, { FunctionComponent, useEffect, useState } from "react";

import { SafeAreaView, View, ViewProps, StatusBar } from "react-native";

import { EngineView, useEngine } from "@babylonjs/react-native";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { Camera } from "@babylonjs/core/Cameras/camera";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Animation, Space } from "@babylonjs/core";

const EngineScreen: FunctionComponent<ViewProps> = (props: ViewProps) => {
  const engine = useEngine();
  const [camera, setCamera] = useState<Camera>();
  const [scene, setScene] = useState<Scene>();

  useEffect(() => {
    const loadScene = async () => {
      if (engine) {
        const url =
          "https://raw.githubusercontent.com/stkivv/3d-viewer-demos/main/SceneViewerDemo/app/src/main/assets/models/skull.obj";
        await SceneLoader.LoadAsync(url, undefined, engine).then(
          (loadScene) => {
            loadScene.createDefaultCameraOrLight(true, undefined, true);
            (loadScene.activeCamera as ArcRotateCamera).alpha += 0;
            (loadScene.activeCamera as ArcRotateCamera).radius = 100;
            loadScene.meshes.forEach((mesh) => {
              mesh.rotationQuaternion = null;
              mesh.rotate(new Vector3(1, 0, 0), -Math.PI / 2, Space.WORLD);
            });
            setScene(loadScene);
            setCamera(loadScene.activeCamera!);
          }
        );
      }
    };
    loadScene();
  }, [engine]);

  const cameraAnimation = new Animation(
    "cameraAnimation",
    "alpha",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );

  cameraAnimation.setKeys([
    {
      frame: 0,
      value: 0,
    },
    {
      frame: 150,
      value: 2 * Math.PI,
    },
  ]);

  useEffect(() => {
    if (camera) {
      camera.animations = [];
      camera.animations.push(cameraAnimation);
      scene!.beginAnimation(camera, 0, 150, true);
    }
  }, [camera, scene])

  return (
    <>
      <View style={props.style}>
        <View style={{ flex: 1 }}>
          <EngineView camera={camera} displayFrameRate={true}/>
        </View>
      </View>
    </>
  );
};

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <EngineScreen style={{ flex: 1 }} />
      </SafeAreaView>
    </>
  );
};

export default App;
