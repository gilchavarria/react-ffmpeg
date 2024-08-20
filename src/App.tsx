import { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

function App() {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";  
      const ffmpeg = ffmpegRef.current;
      ffmpeg.on("log", ({ message }) => {
        if (messageRef.current) messageRef.current.innerHTML = message;
      });
      ffmpeg.on("progress", (ratio) => {
        if (messageRef.current) {
          messageRef.current.innerHTML = `Progress: ${ratio}`;
        }
        console.log(ratio);
      });
      // toBlobURL is used to bypass CORS issue, urls with the same
      // domain can be used directly.
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
        workerURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.worker.js`,
          "text/javascript"
        ),
      });
      setLoaded(true);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  const watermark = async () => {
    const imageURL = 
      "http://tig-media.s3.amazonaws.com/maryland_fb_2018/score_update/opponents/bowling_green.png";
    const videoURL =
      "http://tig-media.s3.amazonaws.com/ti_motion_demo/brush_1x1/backgrounds/background.mp4";
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile("input.mp4", await fetchFile(videoURL));
    await ffmpeg.writeFile("image.png", await fetchFile(imageURL));
    await ffmpeg.writeFile('arial.ttf', await fetchFile('http://tig-media.s3.amazonaws.com/ti_motion_demo/css/fonts/Block.ttf'));
    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-filter_complex",
      "drawtext=fontfile=/arial.ttf:text='Tigers':x=(w-text_w)/2:y=(h-text_h)/2:fontsize=50:fontcolor=white",
      "output.mp4",
    ]);
    const fileData = await ffmpeg.readFile("output.mp4");
    const data = new Uint8Array(fileData as ArrayBuffer);
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );
    }
  };

  return (
    <div>
      {loaded ? (
        <>
          <video
            style={{
              height: "300px",
            }}
            ref={videoRef}
            controls
          ></video>
          <br />
          <p ref={messageRef}></p>
          <button onClick={watermark}>Add Watermark</button>
        </>
      ) : (
        <>
          {loading && <p>Loading ffmpeg-core...</p>}
          <button onClick={load}>Load ffmpeg-core</button>
        </>
      )}
    </div>
  );
}

export default App;
