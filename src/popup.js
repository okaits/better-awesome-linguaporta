
let autoSelectMean = document.querySelector('#auto-select-mean');

chrome.storage.local.get(['autoSelectMean'], (o) => {
    if (o.autoSelectMean !== false) { //true or undef のとき、
        autoSelectMean.firstChild.classList.add('show');
    };
});

autoSelectMean.addEventListener('click', () => {
    if(autoSelectMean.firstChild.classList.contains('show')) {
        autoSelectMean.firstChild.classList.remove('show');
        chrome.storage.local.set({'autoSelectMean': false});
    } else {
        autoSelectMean.firstChild.classList.add('show');
        chrome.storage.local.set({'autoSelectMean': true});
    };
});