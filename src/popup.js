let autoSelectMean = document.querySelector("#auto-select-mean");
let resetCount = document.querySelector("#reset-count");

chrome.storage.local.get(["autoSelectMean"], (s) => {
  if (s.autoSelectMean === true) {
    autoSelectMean.children[0].classList.add("show");
  }
});

autoSelectMean.addEventListener("click", () => {
  console.log("clicked");
  if (autoSelectMean.children[0].classList.contains("show")) {
    autoSelectMean.children[0].classList.remove("show");
    chrome.storage.local.set({ autoSelectMean: false });
  } else {
    autoSelectMean.children[0].classList.add("show");
    chrome.storage.local.set({ autoSelectMean: true });
  }
});

resetCount.addEventListener("click", () => {
  console.log("button clicked");
  chrome.storage.local.set({ lastSearchedUnit: 0 });
});
