import TokenScene from "./Scene/TokenScene";
import { Route, Switch } from "react-router-dom";
import ScenesList from "./Scene/ScenesList";
import TestScene from "./Scene/TestScene";
import { WagmiConfig } from "wagmi";
import client from "./web3/client";
import Profile from "./web3/Profile";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Object3D } from "three";

const Scene = () => {
  const meshRef = useRef<Object3D>(null);

  useFrame((state) => {
    if (meshRef.current) 
       meshRef.current.rotation.set(0, 0, Math.sin(state.clock.elapsedTime));
  });

  const { camera} = useThree();

  useFrame((state) => {
    camera.position.y = Math.sin(state.clock.elapsedTime);
  })

  return (
    <>
      <ambientLight args={["white", 0.25]} />
      <pointLight position={[10, 10, 0]} />
      {/* @ts-ignore */}
      <mesh position-x={[1]} rotation-y={Math.PI / 3} rotation-x={Math.PI / 4} ref={meshRef}>
        <boxBufferGeometry />
        <meshLambertMaterial color="red" />
      </mesh>
<mesh position-x={[-1]} rotation-y={Math.PI / 3} rotation-x={Math.PI / 4} >
        <sphereBufferGeometry />
        <meshLambertMaterial color="blue" />
      </mesh>
    </>
  );
};

const App = () => {
  return (
    <div className="w-screen h-screen">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
};

export default App;
