// Content.jsx

import React, { useEffect } from "react";

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

  useEffect(() => {
    startScreenSharing();
  }, []);

  return <div></div>;
}

export default Content;
