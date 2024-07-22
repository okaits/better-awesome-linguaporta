const autoSelectMean = document.querySelector("#auto-select-mean");
const resetCount = document.querySelector("#reset-count");
const startFrom = document.querySelector("#start-from");

chrome.storage.local.get(["autoSelectMean", "lastSearchedUnit"], (s) => {
  if (s.autoSelectMean === true) {
    autoSelectMean.children[0].classList.add("show");
  }

  startFrom.value = s.lastSearchedUnit;
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
  chrome.storage.local.get(["autoSelectMean", "lastSearchedUnit"], (s) => {
    startFrom.value = s.lastSearchedUnit;
  });
});

resetCount.addEventListener(
  "change",
  () => {
    chrome.storage.local.set({ lastSearchedUnit: resetCount.value });
  },
  false,
);
