console.log("Awesome LINGUAPORTA is working.");

const pageType = Object.freeze({
  top: 101,
  textbooks: 101,
  units: 102,
  problemMean: 211, //単語の意味
  problemMeanCorrect: 212,
  problemMeanIncorrect: 213,
  problemFill: 221, //空所補充
  problemFillCorrect: 222,
  problemFillIncorrect: 223,
  problemSort: 231, //単語並び替え
  problemSortCorrect: 232,
  problemSortIncorrect: 233,
  problemDictate: 241, //ディクテーション
  problemDictateCorrect: 242,
  problemDictateIncorrect: 243,
});

const problemTypes = Object.freeze([
  pageType.problemMean,
  pageType.problemMeanCorrect,
  pageType.problemMeanIncorrect,
  pageType.problemFill,
  pageType.problemFillCorrect,
  pageType.problemFillIncorrect,
  pageType.problemSort,
  pageType.problemSortCorrect,
  pageType.problemSortIncorrect,
  pageType.problemDictate,
  pageType.problemDictateCorrect,
  pageType.problemDictateIncorrect,
]);

const correctTypes = Object.freeze([
  pageType.problemMeanCorrect,
  pageType.problemFillCorrect,
  pageType.problemSortCorrect,
  pageType.problemDictateCorrect,
]);

function getPageType() {
  const bodyClass = Array.from(document.body.classList);

  if (bodyClass.includes("page-home")) {
    return pageType.top;
  } else if (bodyClass.includes("page-study")) {
    return pageType.textbooks;
  } else if (bodyClass.includes("page-units")) {
    return pageType.units;
  } else if (bodyClass.includes("page-problem")) {
    const pageTitle =
      document.querySelector(".page-title").firstElementChild.textContent;
    if (pageTitle.endsWith("単語の意味")) {
      if (isCorrectPage()) {
        return pageType.problemMeanCorrect;
      } else if (isIncorrectPage()) {
        return pageType.problemMeanIncorrect;
      }
      return pageType.problemMean;
    } else if (pageTitle.endsWith("空所補充")) {
      if (isCorrectPage()) {
        return pageType.problemFillCorrect;
      } else if (isIncorrectPage()) {
        return pageType.problemFillIncorrect;
      }
      return pageType.problemFill;
    } else if (pageTitle.endsWith("単語並び替え")) {
      if (isCorrectPage()) {
        return pageType.problemSortCorrect;
      } else if (isIncorrectPage()) {
        return pageType.problemSortIncorrect;
      }
      return pageType.problemSort;
    } else if (pageTitle.endsWith("ディクテーション")) {
      if (isCorrectPage()) {
        return pageType.problemDIctateCorrect;
      } else if (isIncorrectPage()) {
        return pageType.problemDIctateIncorrect;
      }
      return pageType.problemDictate;
    }
  }
  return null;
}

function isCorrectPage() {
  if (document.querySelector("#true_msg")) {
    return true;
  }
  return false;
}

function isIncorrectPage() {
  if (document.querySelector("#false_msg")) {
    return true;
  }
  return false;
}

function isExplainPage() {
  if (document.querySelector('#problem-area > form[name="ExpForm"]')) {
    return true;
  }
  return false;
}

function selectTextBook() {
  const textBooks = document.querySelectorAll(".textbook");
  if (textBooks.length === 1) {
    textBooks[0].children[1].children[1].click();
  }
}

function selectMean() {
  chrome.storage.local.get(["lastSearchedUnit", "autoSelectMean"], (s) => {
    const lastSearchedUnit = s.lastSearchedUnit || 0;
    if (s.autoSelectMean === true) {
      _selectMean(lastSearchedUnit); //async func
    } else {
      chrome.storage.onChanged.addListener((changes, namespase) => {
        if (
          namespase === "local" &&
          changes.autoSelectMean &&
          changes.autoSelectMean.newValue === true
        ) {
          _selectMean(lastSearchedUnit); //async func
        }
      });
    }
  });
}

async function _selectMean(lastSearchedUnit) {
  const unitsParPage = Number(
    (await safeQuerySelector(".unit-categories-display-count > .selected"))
      .textContent,
  );
  const pageNum = Number(
    (
      await safeQuerySelector(
        ".unit-categories-footer > .paging > .paging > .selected",
      )
    ).textContent,
  );
  const lastUnit = pageNum * unitsParPage;
  const firstUnit = lastUnit - unitsParPage + 1;

  console.log(
    firstUnit,
    lastSearchedUnit + 1,
    lastSearchedUnit,
    lastUnit,
    null,
    firstUnit <= lastSearchedUnit + 1,
    lastSearchedUnit < lastUnit,
  );
  if (firstUnit <= lastSearchedUnit + 1 && lastSearchedUnit < lastUnit) {
    const notDone = getNotDoneMean();
    if (notDone.length === 0) {
      chrome.storage.local.set({ lastSearchedUnit: lastUnit }, () => {
        Array.from(
          document.querySelector(".unit-categories-footer > .paging > .paging")
            .children,
        )
          .at(-1)
          .click(); //got to next page
      });
    } else {
      notDone[0].children[3].children[0].click(); //click 学習 button
    }
  }
}

function getNotDoneMean() {
  const units = Array.from(
    document.querySelector("#unit-categories-table > table > tbody").children,
  );
  const means = units.filter((el) => {
    return el.children[0].textContent.endsWith("単語の意味");
  });
  const notDoneMean = means.filter((el) => {
    return el.children[3].children[0].nodeName === "BUTTON";
  });
  console.log(units, means, notDoneMean);
  return notDoneMean;
}

async function safeQuerySelector(selectors) {
  let el = document.querySelector(selectors);
  while (!el) {
    await sleep(10);
    el = document.querySelector(selectors);
  }
  return el;
}

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

async function scrollToProblem() {
  const problemEl = document.querySelector("#problem-area");
  problemEl.scrollIntoView();
  for (let i = 0; i < 8; i++) {
    await sleep(8);
    problemEl.scrollIntoView();
  }
}

function sortChoices() {
  const formEl = document.querySelector("#drill_form");

  let formEls = [];
  while (formEl.children[0]) {
    formEls.push(formEl.removeChild(formEl.children[0]));
  }

  let frontEls = [];
  while (formEls[0].tagName !== "INPUT") {
    // when retry, O/X is inserted
    frontEls.push(formEls.shift());
  }

  let choices = [];
  for (let i = 0; i < 5; i++) {
    let choice = document.createElement("DIV");
    for (let j = 0; j < 2; j++) {
      // remove <br>
      while (
        !(formEls[0].tagName && ["INPUT", "LABEL"].includes(formEls[0].tagName))
      ) {
        formEls.shift();
      }

      const el = formEls.shift();

      // click answer button when select
      if (el.tagName === "INPUT") {
        el.addEventListener("change", answer, false);
      }

      choice.appendChild(el);
    }
    choices.push(choice);
  }

  choices.sort((a, b) => {
    return a.children[1].textContent > b.children[1].textContent ? -1 : 1;
  });

  for (let i = 0; i < 5; i++) {
    formEls.unshift(choices.pop());
  }

  for (let i = 0; i < frontEls.length; i++) {
    formEls.unshift(frontEls.pop());
  }

  while (formEls.length != 0) {
    formEl.appendChild(formEls.shift());
  }
}

function answer() {
  document.querySelector("#ans_submit")?.click();
}

function styleChoices() {
  const formEl = document.querySelector("#drill_form");
  formEl.style.display = "flex";
  formEl.style.flexDirection = "column";
}

function removeBrBetweenQuestionAndChoices() {
  parentEl = document.querySelector("#question_area");
  parentEl.removeChild(parentEl.children[3]);
}

function nextProblemOrQuitProblem() {
  nextProblemButton = document.querySelector(
    ".button-success.button-next-problem",
  );
  if (nextProblemButton) {
    nextProblemButton?.click();
  } else {
    document.back.submit();
  }
}

// Main Process
const thisPageType = getPageType();
console.log(`pageType: ${thisPageType}`);

if (problemTypes.includes(thisPageType)) {
  scrollToProblem();
}

if (thisPageType === pageType.textbooks) {
  selectTextBook();
} else if (thisPageType === pageType.units) {
  selectMean();
} else if (
  [pageType.problemMean, pageType.problemMeanIncorrect].includes(thisPageType)
) {
  sortChoices();
  styleChoices();
  removeBrBetweenQuestionAndChoices();
} else if (correctTypes.includes(thisPageType)) {
  nextProblemOrQuitProblem();
}
