console.log("Better LINGUAPORTA is working.");

let enterFunc = function () { console.log('enterFunc undefined') };
let rightFunc = function () { console.log('rightFunc undefined') };
let leftFunc = function () { console.log('leftFunc undefined') };

const types = ["単語の意味", "空所補充", "単語並び替え", "ディクテーション"];

// クイズのページだったら,
if (document.querySelector('.bloc-resp-lessonname')) {

    const lessonName = document.querySelector('.bloc-resp-lessonname').innerHTML;

    // 問題タイプ(形式)の判定
    const lessonType = txt2typeNum(lessonName);

    // Typeが`単語の意味`だったら,
    if (lessonType === 0) {
        if (isAnsPage()) {

            enterFunc = () => {
                document.querySelector('#ans_submit').click();
            }



            // 選択肢が押されたら、解答を自動で送信
            document.querySelectorAll('input[type="radio"]').forEach((e) => {
                e.addEventListener('change', () => {
                    document.querySelector('#ans_submit').click();
                })
            });

        } else if (isTFPage()) {

            // デフォルトでは、Enterで次の問題で行く
            enterFunc = () => {
                document.querySelector('.btn-problem-next').parentNode.submit();
            };

            if (isTruePage()) {
                document.querySelector('.btn-problem-next').parentNode.submit();
            }

            if (isFalsePage()) {
                document.querySelectorAll('input[type="radio"]').forEach((e) => {
                    e.addEventListener('change', () => {
                        document.querySelector('#ans_submit').click();
                    })
                });
            }

        } else if (isEndPage()) {
            document.querySelector('.btn-return-units').parentNode.submit();
        }
    }

    // Typeが`空所補充`だったら,
    else if (lessonType === 1) {

        if (isAnsPage()) {

            document.querySelector('[name="answer[0]"]').focus();

            enterFunc = () => {
                document.querySelector('#ans_submit').click();
            }
        } else if (isTFPage()) {

            // デフォルトでは、Enterで次の問題で行く
            enterFunc = () => {
                document.querySelector('.btn-problem-next').parentNode.submit();
            };

            

            if (isTruePage()) {
                document.querySelector('.btn-problem-next').parentNode.submit();
            }

        } else if (isEndPage()) {
            document.querySelector('.btn-return-units').parentNode.submit();
        }
    }

    // Typeが`単語並び替え`だったら,
    else if (lessonType === 2) {
        if (isAnsPage()) {

            enterFunc = () => {
                document.querySelector('#ans_submit').click();
            }

        } else if (isTFPage) {

            // デフォルトでは、Enterで次の問題で行く
            enterFunc = () => {
                document.querySelector('.btn-problem-next').parentNode.submit();
            };

            // cardがクリックされた場合、Enterで解答する
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('CardStyle')) {
                    enterFunc = () => {
                        document.querySelector('#ans_submit').click();
                    };
                }
            });

            if (isTruePage()) {
                document.querySelector('.btn-problem-next').parentNode.submit();
            }
        } else if (isEndPage()) {
            document.querySelector('.btn-return-units').parentNode.submit();
        }

    }

    // STUDYページだったら,
} else if (document.querySelector('h2') && document.querySelector('h2').innerHTML === "学習書籍") {
    enterFunc = () => { document.querySelector('.btn-reference-select').click(); };
    if (document.querySelectorAll('.btn-reference-select').length === 1) {
        enterFunc();
    }

    // 学習ユニットページだったら、
} else if (isUnitPage()) {

    let thisPageNum = Number(document.querySelector('.dis_page').innerHTML);
    chrome.storage.local.get(['goalUnitPageNum'], (o) => {

        let goalPageNum = o.goalUnitPageNum || 1;

        //console.log([thisPageNum, goalPageNum]);

        chrome.storage.local.get(['autoSelectMean'], (o) => {
            if (o.autoSelectMean !== false) { //true, undefのとき、自動で'単語の意味'をセレクトする
                if (thisPageNum === goalPageNum) {

                    searchMean(thisPageNum);


                } else {
                    unit_view_page(String(goalPageNum));
                }
            } else {

                chrome.storage.onChanged.addListener((obj,str) => {
                    if (str === 'local', obj.autoSelectMean.newValue === true) {
                        searchMean(thisPageNum);
                    };
                });
            };
        });


    });

}



window.addEventListener('keydown', (e) => {
    //console.log(e.code);
    if (e.code === 'Enter') {
        enterFunc();
    } else if (e.code === 'ArrowRight') {
        rightFunc();
    } else if (e.code === 'ArrowLeft') {
        leftFunc();
    }
});

// Functions

function isAnsPage() {
    return !isTFPage() && !isEndPage();
}

function isTFPage() {
    if (isTruePage() || isFalsePage()) {
        return true;
    } else { return false; }
}

function isTruePage() {
    if (document.querySelector('#true_msg') && document.querySelector('.btn-problem-next')) {
        return true;
    } else { return false; }
}

function isFalsePage() {
    if (document.querySelector('#false_msg') && document.querySelector('.btn-problem-next')) {
        return true;
    } else { return false; }
}

function isEndPage() {
    if (document.querySelector('#true_msg') && !document.querySelector('.btn-problem-next')) {
        return true;
    } else { return false; }
}

function isUnitPage() {
    if (document.querySelector('.table-unit-list')) {
        return true;
    } else { return false; }
}

function txt2typeNum(string) {
    let result = null;
    for (const [i, v] of types.entries()) {
        const re = new RegExp(".*" + v + ".*");
        if (re.test(string)) {
            result = i;
            break;
        }
    }
    return result;
}


function unit_view_page(page) {

    let ele = document.querySelector('form[name="SetUnitPage"]');

	document.querySelector('input[name="unit_list_page"]').setAttribute('value', page);

	ele.submit();

}

function searchMean(thisPageNum) {
    let notFound = true;
    document.querySelectorAll('.col-unitname').forEach((v,num) => {
        if (num !== 0) {
            if (txt2typeNum(v.innerHTML) === 0 && v.childNodes[1].firstChild.tagName === 'INPUT') { //有効なクイズがあったら、
                v.childNodes[1].firstChild.click();
                notFound = false;
            }
        }
    });
    if (notFound) {
        chrome.storage.local.set({ 'goalUnitPageNum': thisPageNum + 1},() => {
            unit_view_page(String(thisPageNum + 1));
        });
    }
}