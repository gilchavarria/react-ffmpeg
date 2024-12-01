import { useState, useRef } from 'react';
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import { LiveText } from './components/LiveText';
import { Person } from './components/Person';
import { ChildComponent } from './components/ChildComponent';
import { Batman } from './components/Batman';

function App() {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

/*
  const [parentState, setParentState] = useState(''); // useState hook used to manage state

  const handleChildStateChange = (newState) => { // function receives updated state from child component
    setParentState(newState);                     // updates parentState
  }
*/

  /* Create a new object called batmanName */
  const batmanName = {
    first: 'Bruce', // properties
    last: 'Wayne',
  }

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
    const videoURL =
      "https://tig-media.s3.amazonaws.com/ephs_mbb/matchup/backgrounds/slash_blue_bg.mp4";
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile("input.mp4", await fetchFile(videoURL));
    await ffmpeg.writeFile('block.ttf', await fetchFile('https://tig-media.s3.amazonaws.com/ephs_mbb/css/fonts/Block.ttf'));
    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-filter_complex",
      "drawtext=fontfile=/block.ttf:text='Fuzzy Red Panda':x=(w-text_w)/2:y=(h-text_h)/2:fontsize=50:fontcolor=white:enable='between(t,1,6)'",
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
    <div
      style={{
        margin: "auto",
        padding: "20px",
      }}
    >

      <LiveText name='Gilbert' />
      <Person name={"Jax"} />{" "}

      {/* name prop is equal to a string */}
      {/* messageCount prop is equal to a number */}
      {/* isLoggedIn prop is equal to a boolean */}
      <ChildComponent name='Vishwas' messageCount={20} isLoggedIn={false} /> 

      <Batman name={batmanName} />

      {loaded ? (
        <>
          <video
            style={{
              height: "200px",
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
