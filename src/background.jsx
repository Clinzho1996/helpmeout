import React, { useEffect } from "react";

const Background = () => {
  useEffect(() => {
    // Listen for messages from the content script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "start_screen_sharing") {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            const tab = tabs[0]; // Get the currently active tab

            // Send a message to the content script to start screen sharing
            chrome.tabs.sendMessage(
              tab.id,
              { action: "start_video" },
              function (response) {
                if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError);
                } else {
                  console.log(response.message);
                }
              }
            );
          }
        );
      }
    });
  }, []);

  return <div>Background Script</div>;
};

export default Background;
