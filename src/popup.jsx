import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import { FiMic, FiSettings, FiVideo } from "react-icons/fi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { RiComputerLine } from "react-icons/ri";
import { GoCopy } from "react-icons/go";
import "./global.css";
import { Button, Switch } from "@mui/material";

function Popup() {
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const screenStream = useRef(null);
  const screenChunks = useRef([]);
  const [screenUrl, setScreenUrl] = useState(null);
  const [checked, setChecked] = useState(false);
  const [audio, setAudio] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState(null);
  const [popup, setPopUp] = useState(false);

  const startRecording = async () => {
    try {
      // Request access to screen capture

      setPopUp(true);
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
          // Push the data into screenChunks
          screenChunks.current.push(event.data);
          console.log(
            "screenChunks size inside ondataavailable:",
            screenChunks.current.length
          );
        }
      };

      mediaRecorder.current.onstop = () => {
        const screenBlob = new Blob(screenChunks.current, {
          type: "video/webm",
        });
        const link = URL.createObjectURL(screenBlob);
        setScreenUrl(link);

        // Send a message to the content script to stop recording
        chrome.runtime.sendMessage({ action: "stopvideo" });
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

  const sendVideoToBackend = async (file) => {
    try {
      const formdata = new FormData();
      formdata.append("title", "myVideo");
      formdata.append("videoFile", file);

      const response = await fetch(
        "https://lobster-app-q4dx3.ondigitalocean.app/api/videos/save",
        {
          method: "POST",
          body: formdata,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const videoId = responseData.videoId;

        const link = document.createElement("a");
        const encodedVideoId = encodeURIComponent(videoId);
        link.href = `https://helpmeoutweb.vercel.app/video/${encodedVideoId}`;
        link.innerText = "Click here to view your video";
        link.target = "_blank";
        document.body.appendChild(link);
        console.log("Video uploaded successfully");
      } else {
        console.error("Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && recording) {
      chrome.runtime.sendMessage({ action: "stopvideo" });

      mediaRecorder.current.stop();
      screenStream.current.getTracks().forEach((track) => track.stop());
      setRecording(false);

      mediaRecorder.current.onstop = () => {
        console.log("Recording stopped");

        const screenBlob = new Blob(screenChunks.current, {
          type: "video/webm",
        });
        const newScreenFile = new File([screenBlob], "recorded.webm", {
          type: "video/webm",
        });

        console.log("newScreenFile:", newScreenFile);
        sendVideoToBackend(newScreenFile);
      };
    }
  };

  const handleCheckBoxChange = (e) => {
    setChecked(e.target.checked);
  };
  const handleAudioChange = (e) => {
    setAudio(e.target.checked);
  };

  const conditionalStyling = popup ? "no" : "main";
  return (
    <div className={conditionalStyling}>
      <div className="header">
        <div className="logo">
          <img src="/assets/logomain.png" alt="logo" />
        </div>
        <div className="assets">
          <FiSettings color="#120B48" size={20} />
          <AiOutlineCloseCircle color="#B6B3C6" size={20} />
        </div>
      </div>
      <div className="main-container">
        <h2>
          This extension helps you record and share help videos with ease.
        </h2>
      </div>
      <div className="tabs">
        <div className="computer">
          <RiComputerLine size={30} />
          <p> Full Screen</p>
        </div>
        <div className="current">
          <GoCopy size={30} />
          <p>Current Tab</p>
        </div>
      </div>
      <div className="camera">
        <div className="video">
          <FiVideo size={20} />
          <p>Camera</p>
        </div>
        <div className="switch">
          <Switch
            checked={checked}
            onChange={handleCheckBoxChange}
            style={{
              color: checked ? "#120b48" : "#120b48",
            }}
          />
        </div>
      </div>
      <div className="audio">
        <div className="mic">
          <FiMic size={20} />
          <p>Audio</p>
        </div>
        <div className="switch">
          <Switch
            checked={audio}
            onChange={handleAudioChange}
            style={{
              color: checked ? "#120b48" : "#120b48",
            }}
          />
        </div>
      </div>
      <div>
        <Button
          className="btn-record"
          id="start_screen_sharing"
          variant="contained"
          onClick={recording ? stopRecording : startRecording}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </Button>
      </div>
    </div>
  );
}

render(<Popup />, document.getElementById("react-target"));
