import {
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DoubleSide, sRGBEncoding } from "three";
import { VideoConfig } from "../Config/types/elements";
import { SceneContext } from "../SceneContext";

const Stream = ({}: { url: string }) => {
  return null;
};

const VideoFilePlayer = ({ url }: { url: string }) => {
  const hasClicked = useContext(SceneContext)?.hasClicked;

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

  return (
    <mesh scale-x={aspect} >
        <planeBufferGeometry args={[1,1]} />
      <meshBasicMaterial toneMapped={false} side={DoubleSide}>
        <videoTexture attach="map" args={[video]} encoding={sRGBEncoding}  />
      </meshBasicMaterial>
    </mesh>
  );
};

const VideoElement = ({ config }: { config: VideoConfig }) => {
  if (!config.file?.streamUrl && !config.file?.originalUrl) return null;

  if (config.file.streamUrl) return <Stream url={config.file.streamUrl} />;

  if (!config.file?.originalUrl) return null;

  return <VideoFilePlayer url={config.file.originalUrl} />;
};

export default VideoElement;
