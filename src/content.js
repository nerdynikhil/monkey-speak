let isSpeakingEnabled = false;
let currentUtterance = null;

// Function to extract text from word element
function getWordText(wordElement) {
    return Array.from(wordElement.querySelectorAll('letter'))
        .map(letter => letter.textContent)
        .join('');
}

// Function to speak the word
function speakWord(word) {
    if (!isSpeakingEnabled) return;
    
    // Cancel any ongoing speech
    if (currentUtterance) {
        window.speechSynthesis.cancel();
    }

    currentUtterance = new SpeechSynthesisUtterance(word);
    currentUtterance.rate = 1.0;
    currentUtterance.pitch = 1.0;
    currentUtterance.volume = 1.0;
    currentUtterance.lang = 'en-US';
    
    window.speechSynthesis.speak(currentUtterance);
}

// Observer to watch for active word changes
const wordObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'class' &&
            mutation.target.classList.contains('active')) {
            const wordText = getWordText(mutation.target);
            speakWord(wordText);
        }
    });
});

// Function to start observing
function startObserving() {
    const wordsContainer = document.getElementById('words');
    if (wordsContainer) {
        wordObserver.observe(wordsContainer, {
            attributes: true,
            subtree: true,
            childList: true
        });
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleTTS") {
        isSpeakingEnabled = request.enabled;
        if (!isSpeakingEnabled && currentUtterance) {
            window.speechSynthesis.cancel();
        }
        sendResponse({ status: "success" });
    }
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['speechEnabled'], (result) => {
        isSpeakingEnabled = result.speechEnabled || false;
        startObserving();
    });
});

// Clean up when page unloads
window.addEventListener('unload', () => {
    if (currentUtterance) {
        window.speechSynthesis.cancel();
    }
    wordObserver.disconnect();
});