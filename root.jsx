import "./style.css";
import { Composition, registerRoot } from "remotion";
import {
  BoldAnimationCaption,
  ScaleAndOpacityAnimationCaption,
} from "./caption";
import { subtitle } from "./data.js";

export const RemotionRoot = () => {
  return (
    <>
     
      <Composition
        id="ScaleAndOpacityAnimationCaption"
        durationInFrames={130}
        fps={30}
        width={1920}
        height={1080}
        component={ScaleAndOpacityAnimationCaption}
      />
       <Composition
        id="BoldAnimationCaption"
        durationInFrames={130}
        fps={30}
        width={1920}
        height={1080}
        component={BoldAnimationCaption}
      />
    </>
  );
};

registerRoot(RemotionRoot);
