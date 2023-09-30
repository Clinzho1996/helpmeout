import React, { useEffect } from "react";

const Background = () => {
  // Request the desktopCapture permission in your background script
  chrome.permissions.request(
    {
      permissions: ["desktopCapture"],
    },
    (granted) => {
      if (granted) {
        console.log("Desktop capture permission granted.");
      } else {
        console.error("Desktop capture permission denied.");
      }
    }
  );

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startScreenSharing") {
      // Forward the message to the content script or perform other actions
      // You can handle the screen sharing logic here
    }
  });

  return <div>Background Script</div>;
};

export default Background;
