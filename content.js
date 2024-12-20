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

    // Apply Gaussian blur to the editor
    editor.style.filter = "blur(8px)";
    editor.style.position = "relative"; // Ensure the editor itself is positioned for overlay placement

    // Create an overlay
    const overlay = document.createElement("div");
    const editorRect = editor.getBoundingClientRect(); // Get the editor's position and dimensions
    overlay.style.position = "absolute";
    overlay.style.top = `${editorRect.top}px`;
    overlay.style.left = `${editorRect.left}px`;
    overlay.style.width = `${editorRect.width}px`;
    overlay.style.height = `${editorRect.height}px`;
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)"; // Dark semi-transparent overlay
    overlay.style.zIndex = 1000; // Ensure overlay is above all other content
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.pointerEvents = "auto"; // do not allow clicks to pass through to the editor
    overlay.innerHTML = `
        <h3 style="margin-bottom: 20px; color: white;">SOLVED BEFORE:</h3>
        <div style="pointer-events: auto;"> <!-- Allow interaction with buttons -->
            <button id="showSolution" style="margin-right: 10px; background-color: lightgreen; padding: 10px 20px; border: none; cursor: pointer;">SHOW</button>
            <button id="clearSolution" style="background-color: lightcoral; padding: 10px 20px; border: none; cursor: pointer;">CLEAR</button>
        </div>
    `;

    // Append the overlay to the body and position it over the editor
    document.body.appendChild(overlay);

    console.log("Overlay added above the blurred editor. Waiting for user action...");

    // Adjust overlay position if the window resizes
    window.addEventListener("resize", () => {
        const updatedRect = editor.getBoundingClientRect();
        overlay.style.top = `${updatedRect.top}px`;
        overlay.style.left = `${updatedRect.left}px`;
        overlay.style.width = `${updatedRect.width}px`;
        overlay.style.height = `${updatedRect.height}px`;
    });
    console.log("Overlay added above the blurred editor. Waiting for user action...");

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