/// <reference types="chrome"/>

chrome.runtime.onInstalled.addListener((details) => {
  chrome.storage.sync.set({ dataset: [], selection: [], fields: [] });
  chrome.contextMenus.create({
    title: "Form Builder",
    id: "ctxMenuMain",
    contexts: ["page", "selection"],
  });
});

chrome.contextMenus.onClicked.addListener((e) => {
  chrome.storage.sync.get(["selection"]).then((result) => {
    let selectionData: string[] = result.selection;

    selectionData.push(e.selectionText!);

    console.log(selectionData);

    chrome.storage.sync.set({ selection: selectionData });
  });
});

console.log("Background script is running...");
