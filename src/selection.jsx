// Selection.jsx

import React, { useEffect } from "react";
import { render } from "react-dom";

function Selection() {
  useEffect(() => {
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "init_screen_sharing") {
        const stream = request.stream;

        // Display the screen sharing prompt or use the stream as needed
        // Example: display the stream in a video element
        const videoElement = document.createElement("video");
        videoElement.srcObject = stream;
        document.body.appendChild(videoElement);

        // Add logic to handle user interaction and start recording if necessary
      }
    });
  }, []);

  return <div className="main">{/* Add your screen sharing UI here */}</div>;
}

render(<Selection />, document.getElementById("selection-target"));
