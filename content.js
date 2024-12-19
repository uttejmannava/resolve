chrome.storage.sync.get("blurEnabled", (data) => {
    console.log("LeetCode Hider: Checking if blur is enabled...");
    if (!data.blurEnabled) {
        console.log("LeetCode Hider: Blur is disabled. Exiting.");
        return;
    }

    console.log("LeetCode Hider: Blur is enabled. Searching for the editor...");
    const editor = document.getElementById('editor');
    if (!editor) {
        console.log("LeetCode Hider: Code editor not found. Exiting.");
        return;
    }
  
    console.log("LeetCode Hider: Code editor found. Checking if the problem is solved...");
    const isSolved = document.querySelector('svg.fill-none.stroke-current.text-message-success'); // check for green check beside solved text
    if (!isSolved) {
        console.log("LeetCode Hider: Problem is not marked as solved. Exiting.");
        return;
    }
  
    console.log("LeetCode Hider: Problem is solved. Applying blur...");

    // apply blur
    editor.style.position = "relative";
    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(255, 255, 255, 0.95)"; // Increased opacity
    overlay.style.zIndex = 100; // Ensure overlay is above all other content
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.innerHTML = `
        <h3 style="margin-bottom: 20px;">SOLVED BEFORE:</h3>
        <div>
            <button id="showSolution" style="margin-right: 10px; background-color: lightgreen; padding: 10px 20px; border: none; cursor: pointer;">SHOW</button>
            <button id="clearSolution" style="background-color: lightcoral; padding: 10px 20px; border: none; cursor: pointer;">CLEAR</button>
        </div>
    `;
    editor.appendChild(overlay);

    console.log("LeetCode Hider: Overlay added. Waiting for user action...");

    // Button handlers
    overlay.querySelector("#showSolution").addEventListener("click", () => {
        console.log("LeetCode Hider: User clicked 'SHOW'. Removing blur...");
        editor.style.filter = "none"; // Remove blur
        overlay.remove(); // Remove overlay
    });

    overlay.querySelector("#clearSolution").addEventListener("click", () => {
        console.log("LeetCode Hider: User clicked 'CLEAR'. Clearing code...");
        const codeEditor = editor.querySelector(".CodeMirror-code"); // Actual code lines within the editor
        if (codeEditor) {
            console.log("LeetCode Hider: Code editor content cleared.");
            codeEditor.innerHTML = ""; // Clear code
        } else {
            console.log("LeetCode Hider: Code editor content not found. Unable to clear.");
        }
        editor.style.filter = "none"; // Remove blur
        overlay.remove(); // Remove overlay
    });
});