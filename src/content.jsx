// Content.jsx

import React from "react";

function Content() {
  async function startScreenSharing() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      // Send the stream to your background script to start screen sharing
      chrome.runtime.sendMessage({ action: "start_screen_sharing", stream });
    } catch (error) {
      console.error("Error starting screen sharing:", error);
    }
  }

  return (
    <div>
      <button id="startScreen" onClick={startScreenSharing}>
        Start Screen Sharing
      </button>
    </div>
  );
}

export default Content;
