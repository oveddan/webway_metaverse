import {
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DoubleSide, Mesh, PositionalAudio, sRGBEncoding } from "three";
import { VideoConfig } from "../Config/types/elements";
import { SceneContext } from "../SceneContext";

const Stream = ({}: { url: string }) => {
  return null;
};

const VideoFilePlayer = ({ url, volume = 20}: { url: string, volume?: number }) => {
  const context = useContext(SceneContext);
  const hasClicked = context?.hasClicked;
  const listener = context?.listener;

  const [aspect, setAspect] = useState(1);

  const handleMetadataLoaded = useCallback((e: SyntheticEvent) => {
    const videoElement = e.target as HTMLVideoElement;

    if (videoElement.videoWidth && videoElement.videoHeight) {
      const aspect = videoElement.videoWidth / videoElement.videoHeight;

      console.log(aspect);
      setAspect(aspect);
    }
  }, []);

  const [video] = useState(() =>
    Object.assign(document.createElement("video"), {
      src: url,
      crossOrigin: "Anonymous",
      loop: true,
      onloadedmetadata: handleMetadataLoaded,
    })
  );
  useEffect(() => void (hasClicked && video.play()), [video, hasClicked]);

  const [positionalAudio, setPositionalAudio] = useState<PositionalAudio>();

  useEffect(() => {
    if (listener) {
      const positionalAudio = new PositionalAudio(listener);

      setPositionalAudio(positionalAudio);
    
      return () => {
        positionalAudio.disconnect();
      }
    }
  }, [listener]);

  useEffect(() => {
    if (!positionalAudio) return;

    positionalAudio.setRolloffFactor(1.5);
    positionalAudio.setRefDistance(volume);
  }, [positionalAudio, volume])

  const [meshRef, setMeshRef] = useState<Mesh | null>(null);

  useEffect(() => {
    if (!meshRef || !positionalAudio) return;

    positionalAudio.setMediaElementSource(video);

    meshRef.add(positionalAudio);
  
    return () => {
      positionalAudio.disconnect();
      meshRef.remove(positionalAudio);
    }
  }, [meshRef, positionalAudio]);

  return (
    <>
      <mesh scale-x={aspect} ref={setMeshRef}>
        <planeBufferGeometry args={[1, 1]} />
        <meshBasicMaterial toneMapped={false} side={DoubleSide}>
          <videoTexture attach="map" args={[video]} encoding={sRGBEncoding} />
        </meshBasicMaterial>
      </mesh>
    </>
  );
};

const VideoElement = ({ config }: { config: VideoConfig }) => {
  if (!config.file?.streamUrl && !config.file?.originalUrl) return null;

  if (config.file.streamUrl) return <Stream url={config.file.streamUrl} />;

  if (!config.file?.originalUrl) return null;

  return <VideoFilePlayer url={config.file.originalUrl} volume={config.volume} />;
};

export default VideoElement;
