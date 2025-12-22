# Quick Notes - Chrome Extension 📝

A simple, lightweight Chrome extension that lets you stick notes to any webpage. Your notes are saved automatically and reappear whenever you visit the same URL.

![Icon](icons/icon128.png)

## Features ✨

*   **Stick Anywhere:** Add a note to any website.
*   **Auto-Save:** Everything you type is saved locally to your browser instantly.
*   **Per-URL Storage:** Each page has its own unique note.
*   **Rich Customization:**
    *   🎨 **5 Colors:** Yellow, Blue, Green, Pink, Dark Mode.
    *   🔤 **4 Fonts:** Handwriting, Sans-serif, Monospace, Serif.
    *   📏 **Adjustable Text Size.**
*   **Ghost Mode 👻:** Make the note semi-transparent to see content behind it.
*   **Smart Controls:**
    *   **Pin 📌:** Quickly snap to any corner of the screen.
    *   **Minimize _:** Collapse the note to save space.
    *   **Resize:** Drag the bottom-right corner to change dimensions.
*   **Privacy First:** All data is stored locally (`chrome.storage.local`). No cloud, no tracking.

## Installation 🛠️

Since this extension is not yet in the Chrome Web Store, you can install it manually in "Developer Mode":

1.  **Download** this repository (Code -> Download ZIP) and unzip it.
2.  Open Chrome and go to `chrome://extensions`.
3.  Enable **Developer mode** (toggle in the top-right corner).
4.  Click **Load unpacked**.
5.  Select the folder where you unzipped the files.
6.  The **Quick Notes** icon should appear in your toolbar!

## How to Use 🚀

1.  Navigate to any website (e.g., Google, Wikipedia).
2.  Click the **Quick Notes icon** in your browser toolbar.
3.  A yellow sticky note will appear. Start typing!
4.  **Customize:** Use the buttons in the header to change color, font, or transparency.
5.  **Move:** Drag the header to move the note around.
6.  **Close:** Click `X` to hide the note. Click the extension icon again to bring it back.

## Permissions 🔒

*   `activeTab` & `scripting`: To inject the sticky note onto the current page.
*   `storage`: To save your notes locally on your computer.

## License

Free to use and modify. Enjoy!

