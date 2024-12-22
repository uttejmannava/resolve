chrome.runtime.onInstalled.addListener(() => {
    console.log("ReSolve: LeetCode Solution Hider installed!");

    chrome.storage.sync.get(["blurEnabled", "hideDifficulty"], (data) => {
      const defaults = {
          blurEnabled: data.blurEnabled ?? true,
          hideDifficulty: data.hideDifficulty ?? true,
      };

      // save default values
      chrome.storage.sync.set(defaults, () => {
          console.log("Default settings initialized:", defaults);
      });
  });
});