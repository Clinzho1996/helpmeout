// Background.jsx

import React, { useEffect } from "react";

const Background = () => {
  useEffect(() => {
    // Listen for messages from the content script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "start_screen_sharing") {
        // Open a new tab for screen sharing
        chrome.tabs.create(
          { url: chrome.runtime.getURL("selectionscreen.html") },
          (tab) => {
            // Store the stream in a variable so you can access it in the screenSharing.jsx page
            const stream = request.stream;
            chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
              if (tabId === tab.id && changeInfo.status === "complete") {
                // Send the stream to the newly created tab
                chrome.tabs.sendMessage(tabId, {
                  action: "init_screen_sharing",
                  stream: stream,
                });
              }
            });
          }
        );
      }
    });
  }, []);

  return <div>Background Script</div>;
};

export default Background;
