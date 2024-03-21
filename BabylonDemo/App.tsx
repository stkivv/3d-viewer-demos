import React, {
  FunctionComponent,
  useEffect,
  useCallback,
  useState,
} from "react";

import {
  SafeAreaView,
  View,
  Button,
  ViewProps,
  StatusBar,
  Image,
} from "react-native";

import { EngineView, useEngine } from "@babylonjs/react-native";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { Camera } from "@babylonjs/core/Cameras/camera";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Asset } from "expo-asset";
import RNFS from "react-native-fs";
import { HemisphericLight } from "@babylonjs/core/Lights";

const EngineScreen: FunctionComponent<ViewProps> = (props: ViewProps) => {
  const engine = useEngine();
  const [camera, setCamera] = useState<Camera>();
  const [scene, setScene] = useState<Scene>();

  useEffect(() => {
    const loadScene = async () => {
      if (engine) {
        const url =
          "https://raw.githubusercontent.com/stkivv/3d-viewer-demos/main/SceneViewerDemo/app/src/main/assets/models/skull.glb";
        await SceneLoader.LoadAsync(url, undefined, engine).then((loadScene) => {
          setScene(loadScene);
          loadScene.createDefaultCameraOrLight(true, undefined, true);
          (loadScene.activeCamera as ArcRotateCamera).alpha += Math.PI;
          (loadScene.activeCamera as ArcRotateCamera).radius = 100;
          setCamera(loadScene.activeCamera!);

          scene?.whenReadyAsync().then(() => {
            const mesh = scene.meshes[0];
            mesh.rotate(new Vector3(1, 0, 0), 90)
          })
        });
      }
    };
    loadScene();
  }, [engine]);

  return (
    <>
      <View style={props.style}>
        <View style={{ flex: 1 }}>
          <EngineView camera={camera} displayFrameRate={true} />
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
