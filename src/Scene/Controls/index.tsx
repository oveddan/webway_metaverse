import { FlyControls, PointerLockControls } from "@react-three/drei";

const Controls = () => {
  return (
    <>
      <PointerLockControls />
      <FlyControls />
    </>
  );
};

export default Controls;
