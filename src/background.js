// This file contains the background script for the Chrome extension. It manages events and handles communication between different parts of the extension.

chrome.runtime.onInstalled.addListener(() => {
    console.log("MonkeySpeak extension installed.");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "speak") {
        chrome.tts.speak(request.text, { rate: 1.0 });
        sendResponse({ status: "speaking" });
    } else if (request.action === "toggleSpeak") {
        // Toggle TTS functionality
        chrome.tabs.sendMessage(sender.tab.id, {
            action: "toggleTTS"
        });
        sendResponse({ status: "success" });
    }
});