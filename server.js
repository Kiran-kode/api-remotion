import express from "express";
import cors from "cors";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import { subtitle } from "./data.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // accept JSON input

app.post("/render-video", async (req, res) => {
  const { videoUrl, subtitles } = req.body;

  if (!videoUrl || !subtitles) {
    return res.status(400).json({ error: "Missing videoUrl or subtitles" });
  }

  // Save subtitles to ./data.js
  const subtitleString = `export const subtitle = ${JSON.stringify(subtitles, null, 2)};`;
  fs.writeFileSync("./data.js", subtitleString);

  try {
    const bundleLocation = await bundle({
      entryPoint: path.resolve("./root.jsx"),
    });

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: "ScaleAndOpacityAnimationCaption",
      inputProps: { url: videoUrl },
    });

    const outputPath = `out/video-${Date.now()}.mp4`;

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: { url: videoUrl },
    });

    res.download(outputPath);
  } catch (err) {
    console.error("Render failed:", err);
    res.status(500).json({ error: "Failed to render video" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
