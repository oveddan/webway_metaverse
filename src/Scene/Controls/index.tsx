import { FlyControls, PointerLockControls } from "@react-three/drei";

const Controls = () => {
  return (
    <>
      <PointerLockControls />
      <FlyControls movementSpeed={3}/>
    </>
  );
};

export default Controls;
