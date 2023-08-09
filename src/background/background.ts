/// <reference types="chrome"/>

chrome.runtime.onInstalled.addListener((details) => {
  chrome.storage.sync.set({ dataset: [] });
  chrome.contextMenus.create({
    title: "Form Builder",
    id: "ctxMenuMain",
    contexts: ["page", "selection"],
  });
  chrome.contextMenus.onClicked.addListener((e) => {
    chrome.storage.sync.get;
  });
});

console.log("Background script is running...");
