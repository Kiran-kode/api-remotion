import {
  AbsoluteFill,
  interpolateColors,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import { subtitle } from "./data";
import { cn } from "./utils";
import { isInBetween } from "./lib";

const fontFamily = "Lateef";

loadFont({
  family: fontFamily,
  url: staticFile(`fonts/${fontFamily}/${fontFamily}-Bold.ttf`),
}).then(() => console.log("font loaded."));

const getSegmentByFrame = (subtitle, frame) => {
  return subtitle.segments.find((segment) => isInBetween(frame, segment));
};

export const BoldAnimationCaption = () => {
  const frame = useCurrentFrame();
  const segment = getSegmentByFrame(subtitle, frame);

  return (
    <AbsoluteFill dir="rtl" style={{ fontFamily }}>
      <AbsoluteFill>
        <OffthreadVideo src={staticFile("videos/video.mp4")} />
      </AbsoluteFill>
      <AbsoluteFill className="w-full h-full flex items-center justify-end py-20">
        {segment && (
          <div className="flex flex-row gap-2 text-6xl p-4 bg-white/50 rounded-lg shadow-lg">
            {segment.words.map((word, index) => (
              <h1
                key={index}
                className={cn(
                  "text-black",
                  isInBetween(frame, word)
                    ? "opacity-100 font-extrabold"
                    : "opacity-75"
                )}
              >
                {word.text}
              </h1>
            ))}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ScaleAndOpacityAnimationCaption = (props) => {
  const { url } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const segment = getSegmentByFrame(subtitle, frame);

  const opacityAnimation = (word, nextWord, frame) => {
    if (frame < word.fromFrame) {
      return 0;
    } else if (frame < word.toFrame) {
      return spring({
        frame: frame - word.fromFrame,
        fps,
        config: { damping: 200 },
        durationInFrames: word.toFrame - word.fromFrame,
        from: 0,
        to: 1,
      });
    } else if (nextWord) {
      return spring({
        frame: frame - word.toFrame,
        fps,
        config: { damping: 200 },
        durationInFrames: nextWord.toFrame - word.toFrame,
        from: 1,
        to: 0,
      });
    } else return 1;
  };

  return (
    <AbsoluteFill dir="rtl" style={{ fontFamily }}>
      <AbsoluteFill>
        <OffthreadVideo src={url} />
      </AbsoluteFill>
      <AbsoluteFill className="w-full h-full flex  items-end justify-center py-20">
        {segment && (
          <div className="flex  text-7xl p-4">
            {segment.words.map((word, index) => {
              const color = interpolateColors(
                frame,
                [word.fromFrame, word.toFrame],
                ["#bbbbbb", "#eeeeee"]
              );
              const opacity = opacityAnimation(
                word,
                segment.words[index + 1],
                frame
              );
              return (
                <div
                  className=" flex m-1 p-2 bg-purple-900 rounded-3xl"
                  style={{ backgroundColor: `rgba(104, 24, 166, ${opacity})` }}
                  key={index}
                >
                  <h1
                    style={{ color, opacity: 1 }}
                    className={cn(
                      "text-white font-extrabold"
                      // isInBetween(frame, word)
                      //   ? "opacity-100 font-extrabold"
                      //   : "opacity-75",
                    )}
                  >
                    {word.text}
                  </h1>
                </div>
              );
            })}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
