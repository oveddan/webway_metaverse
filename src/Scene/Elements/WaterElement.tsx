import { Suspense, useEffect, useMemo, useState } from "react";
import { useLoader } from "@react-three/fiber";
import {
  BufferGeometry,
  Material,
  PlaneBufferGeometry,
  TextureLoader,
} from "three";
import { Water2Options } from "three-stdlib";
// for some reason, the types def has Water2 as a named export, but its really a default export
// @ts-ignore
import { Water } from "three/examples/jsm/objects/Water2";
import { WaterConfig } from "../Config/types/elements";
import { convertURIToHTTPS, toIpfsUrl } from "../lib/ipfs";


const toUrlFromIpfs = (cid: string) =>
  convertURIToHTTPS({ url: toIpfsUrl(cid) });

const getWaterNormalUrls = () => {
  return [
    `Qme8hNLFWv1sxNZu1aFhRedHwHAg6jooCCtkXNgLqjdJKK`,
    `QmeuvyH5gDehfXZ1bBW1LPyjkAGd7QATKij8WLhjRo4x9e`,
  ].map(toUrlFromIpfs) as [string, string];
};

const WaterInner = ({
  width,
  height,
  color,
  flowSpeed,
  scale,
}: WaterConfig) => {
  const waterNormalURLs = useMemo(() => getWaterNormalUrls(), []);

  const waterNormalTextureA = useLoader(TextureLoader, waterNormalURLs[0]);
  const waterNormalTextureB = useLoader(TextureLoader, waterNormalURLs[1]);

  const waterOptions = useMemo<Water2Options>(
    () => ({
      color,
      flowSpeed,
      scale,
      textureHeight: 512,
      textureWidth: 512,
    }),
    [color, flowSpeed, scale]
  );
  const [water2, setWater2] = useState<Water>();

  const [geometry, setGeometry] = useState<BufferGeometry>();

  useEffect(() => {
    const geometry = new PlaneBufferGeometry(width, height);
    setGeometry(geometry);
  }, [width, height]);

  useEffect(() => {
    if (!waterNormalTextureA || !waterNormalTextureB || !geometry) return;
    const args: Water2Options = {
      ...waterOptions,
      normalMap0: waterNormalTextureA,
      normalMap1: waterNormalTextureB,
    };
    const water2 = new Water(geometry, args);
    setWater2(water2);

    return () => {
      (water2.material as Material).dispose();
    };
  }, [geometry, waterNormalTextureA, waterNormalTextureB, waterOptions]);

  if (!water2) return null;

  return (
    <group rotation-x={-Math.PI / 2}>
      <primitive object={water2} />
    </group>
  );
};

const WaterElement = ({ config }: { config: WaterConfig }) => {
  return (
    <Suspense fallback={null}>
      <WaterInner {...config} />
    </Suspense>
  );
};
export default WaterElement;
