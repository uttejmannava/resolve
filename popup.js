document.addEventListener("DOMContentLoaded", () => {
    const closeButton = document.getElementById("closePopup");

    closeButton.addEventListener("click", () => {
        window.close();
    });
    
    const blurToggle = document.getElementById("blurToggle");
    const hideDifficultyToggle = document.getElementById("hideDifficultyToggle");
  
    chrome.storage.sync.get(["blurEnabled", "hideDifficulty"], (data) => {
        blurToggle.checked = data.blurEnabled ?? true;
        hideDifficultyToggle.checked = data.hideDifficulty ?? true;
    });
  
    // save
    blurToggle.addEventListener("change", () => {
        chrome.storage.sync.set({ blurEnabled: blurToggle.checked }, () => {
            console.log(`Blur setting updated to: ${blurToggle.checked}`);
        });
    });

    hideDifficultyToggle.addEventListener("change", () => {
        chrome.storage.sync.set({ hideDifficulty: hideDifficultyToggle.checked }, () => {
            console.log(`Hide difficulty setting updated to: ${hideDifficultyToggle.checked}`);
        });
    });
});