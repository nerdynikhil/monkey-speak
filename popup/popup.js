document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('speakButton');
    const statusDiv = document.getElementById('status');
    
    // Load initial state
    chrome.storage.local.get(['speechEnabled'], (result) => {
        const isSpeaking = result.speechEnabled || false;
        updateButtonState(isSpeaking);
    });

    function updateButtonState(isSpeaking) {
        toggleButton.textContent = isSpeaking ? 'Disable Speech' : 'Enable Speech';
        toggleButton.className = isSpeaking ? 'disabled' : '';
        statusDiv.textContent = isSpeaking ? 'Speech is enabled' : 'Speech is disabled';
    }

    toggleButton.addEventListener('click', function() {
        chrome.storage.local.get(['speechEnabled'], (result) => {
            const newState = !result.speechEnabled;
            
            chrome.storage.local.set({ speechEnabled: newState }, () => {
                updateButtonState(newState);
                
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: "toggleTTS",
                        enabled: newState
                    });
                });
            });
        });
    });
});