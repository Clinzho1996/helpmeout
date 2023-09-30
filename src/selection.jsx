import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import "./global.css";

function Selection() {
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const screenChunks = useRef([]);
  const [screenUrl, setScreenUrl] = useState(null);
  const [checked, setChecked] = useState(false);
  const [audio, setAudio] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const startRecording = async () => {
    try {
      // Request access to screen capture
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: checked,
        audio: audio,
      });
      screenStream.current = stream;

      // Create a MediaRecorder instance
      mediaRecorder.current = new MediaRecorder(stream);

      // Event handler when data becomes available (chunks of video)
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          screenChunks.current.push(event.data);
        }
      };

      // Event handler when recording stops
      mediaRecorder.current.onstop = () => {
        const screenBlob = new Blob(screenChunks.current, {
          type: "video/webm",
        });
        const link = URL.createObjectURL(screenBlob);
        // You can use screenUrl to play or share the recording
        setScreenUrl(link);
      };

      // Start recording
      mediaRecorder.current.start();

      setRecording(true);
    } catch (error) {
      console.error("Error starting screen recording:", error);
      if (error.name === "NotAllowedError") {
        setErrorMessage(
          "Permission denied: You need to grant permission to record your screen and audio."
        );
      } else if (!checked) {
        setErrorMessage("Camera permission needed");
      } else {
        setErrorMessage("An error occurred while starting the recording.");
      }
    }
  };

  useEffect(() => {
    // Start recording when the component mounts
    startRecording();
  }, []);

  return (
    <div className="main">{errorMessage && <div>{errorMessage}</div>}</div>
  );
}

render(<Selection />, document.getElementById("selection-target"));
