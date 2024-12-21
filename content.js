// chrome.storage.sync.get("hideDifficulty", (data) => {
//     console.log("ReSolve: Checking if hide difficulty is enabled...");
//     if (!data.hideDifficulty) {
//         console.log("ReSolve: Hide difficulty is disabled.");
//         return;
//     }

//     console.log("ReSolve: Hide difficulty is enabled. Modifying difficulty...");
//     const difficulty = document.querySelector('div[class*="text-difficulty-"]');
//     // other features
//     if (!difficulty) {
//         console.log("ReSolve: Difficulty not found. Exiting.");
//         return;
//     } else {
//         difficulty.textContent = "🤷‍♂️"
//         console.log("ReSolve: Difficulty modified.");
//     }

// });

chrome.storage.sync.get("hideDifficulty", (data) => {
    console.log("ReSolve: Checking if hide difficulty is enabled...");
    if (!data.hideDifficulty) {
        console.log("ReSolve: Hide difficulty is disabled.");
        return;
    }

    console.log("ReSolve: Hide difficulty is enabled. Hiding content temporarily...");

    // Find the parent container
    const parent = document.querySelectorAll('div.flex.gap-1')[9];
    if (!parent) {
        console.log("ReSolve: Parent container not found. Exiting.");
        return;
    }

    // Hide the parent container to prevent flashing
    parent.style.display = "none";

    const checkAndModifyDifficulty = () => {
        const difficulty = document.querySelector('div[class*="text-difficulty-"]');
        if (difficulty) {
            difficulty.textContent = "🤷‍♂️"; // Modify difficulty text
            console.log("ReSolve: Difficulty modified.");

            // Show the parent container after modification
            parent.style.display = "";
        } else {
            // Retry until the element is found
            setTimeout(checkAndModifyDifficulty, 50);
        }
    };

    checkAndModifyDifficulty();
});

chrome.storage.sync.get("blurEnabled", (data) => {
    console.log("ReSolve: Checking if blur is enabled...");
    if (!data.blurEnabled) {
        console.log("ReSolve: Blur is disabled. Exiting.");
        return;
    }

    console.log("ReSolve: Blur is enabled. Searching for the editor...");
    const editor = document.getElementById('editor');
    if (!editor) {
        console.log("ReSolve: Code editor not found. Exiting.");
        return;
    }

    console.log("ReSolve: Code editor found. Checking if the problem is solved...");
    const isSolved = document.querySelector('svg.fill-none.stroke-current.text-message-success'); // check for green check beside solved text
    if (!isSolved) {
        console.log("ReSolve: Problem is not marked as solved. Exiting.");
        return;
    }

    console.log("ReSolve: Problem is solved. Applying blur...");

    // check light or dark mode
    const appearance = document.documentElement.className

    // Ensure the editor is positioned for overlay placement
    editor.style.position = "relative";

    // Apply backdrop filter for blur
    const blurLayer = document.createElement("div");
    blurLayer.style.position = "absolute";
    blurLayer.style.top = 0;
    blurLayer.style.left = 0;
    blurLayer.style.width = "100%";
    blurLayer.style.height = "100%";
    blurLayer.style.backdropFilter = "blur(8px)";
    // bg black or white depending on appearance
    blurLayer.style.backgroundColor = appearance === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.4)"
    blurLayer.style.zIndex = 1; // behind overlay, above editor
    editor.appendChild(blurLayer);

    // Create the overlay content
    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.zIndex = 2; // placed above blur layer
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.pointerEvents = "auto"; // enable interaction with overlay

    const textColor = appearance === "dark" ? "white" : "black"
    const buttonTextColor = appearance === "dark" ? "white" : "black"

    overlay.innerHTML = `
        <h3 style="margin-bottom: 20px; color: ${textColor};">SOLVED BEFORE:</h3>
        <div style="pointer-events: auto;"> <!-- Allow interaction with buttons -->
            <button id="showSolution" style="margin-right: 10px; background-color: lightgreen; color: ${buttonTextColor}; padding: 10px 20px; border: none; cursor: pointer;">SHOW</button>
            <button id="clearSolution" style="background-color: lightcoral; color: ${buttonTextColor}; padding: 10px 20px; border: none; cursor: pointer;">CLEAR</button>
        </div>
    `;

    setTimeout(() => {
        editor.appendChild(overlay);
        console.log("ReSolve: Overlay added inside the editor. Waiting for user action...");
    }, 600);

    // Button handlers
    overlay.querySelector("#showSolution").addEventListener("click", () => {
        console.log("ReSolve: User clicked 'SHOW'. Removing blur...");
        blurLayer.remove();
        overlay.remove();
    });

    overlay.querySelector("#clearSolution").addEventListener("click", () => {
        console.log("ReSolve: User clicked 'CLEAR'. Clearing code...");
        const resetButton = editor.querySelectorAll('div.flex.items-center.gap-1 button')[3];

        if (resetButton) {
            resetButton.click();
            console.log("ReSolve: Reset button clicked. Waiting for the confirm button...");
    
            setTimeout(() => { // accounts for small delay after clicking reset button
                const confirmButton = document.querySelectorAll('div.mt-8.flex.justify-end button')[1];
                if (confirmButton) {
                    confirmButton.click();
                    console.log("ReSolve: Confirm button clicked. Removing overlay...");
                } else {
                    console.log("ReSolve: Confirm button not found.");
                }
            }, 100);
        } else {
            console.log("ReSolve: Reset button not found. Unable to clear code.");
        }

        setTimeout(() => {
            blurLayer.remove();
            overlay.remove();
        }, 100);


    });
});