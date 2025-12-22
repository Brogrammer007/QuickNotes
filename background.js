chrome.action.onClicked.addListener((tab) => {
  // Ignorisi sistemske stranice
  if (!tab.url || tab.url.startsWith("chrome://")) return;

  // 1. Probaj da posaljes poruku "Otvori se!"
  chrome.tabs.sendMessage(tab.id, { action: "toggle" }, (response) => {
    
    // 2. Ako Chrome kaze "Nema nikog kod kuce" (Greska: Receiving end does not exist)
    if (chrome.runtime.lastError) {
      console.log("Skripta nije pronadjena. Ubacujem rucno...");

      // Ubaci CSS
      chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["styles.css"]
      }).catch(() => {});

      // Ubaci JS (Skriptu)
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      }, () => {
        // Kada se ubaci, sacekaj 0.1 sekundu i probaj opet
        setTimeout(() => {
          chrome.tabs.sendMessage(tab.id, { action: "toggle" });
        }, 100);
      });
    }
  });
});
