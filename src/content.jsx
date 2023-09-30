import React from "react";

function Content() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      function: () => {
        chrome.runtime.sendMessage({ action: "startScreenSharing" });
      },
    });
  });

  return <div>Content</div>;
}

export default Content;
