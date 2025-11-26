async function main() {
    while (!(document.getElementById("unit-categories-table") || document.getElementById("question_area"))) {
        await new Promise(r => setTimeout(r, 10));
    };
    if (document.body.classList.contains("page-units")) {
        // Unit選択画面
        const table = document.getElementById("units_list");
        // 念の為誤答履歴を削除
        sessionStorage.triedBefore = "";
        const observerCallback = () => {
            console.log("callback function called!")
            const undone_tasks_startbtn = document.querySelectorAll("#unit-categories-table table tbody tr td.cate-study button");
            const units_nav_lastelem = Array.from(document.querySelector("div#unit-categories-table div nav nav.paging.pc-only").children).slice(-1)[0];
            for (const undone_task_startbtn of undone_tasks_startbtn) {
                if (undone_task_startbtn.parentElement.parentElement.children[0].innerText.includes("単語の意味")) {
                    undone_task_startbtn.click();
                };
            };
            units_nav_lastelem.click();
        }
        const observer = new MutationObserver(observerCallback);
        observer.observe(table, {childList: true});
        observerCallback();
    } else if (document.body.classList.contains("page-problem") 
            && document.querySelector('h2.page-title small b').innerText.includes("ラジオボタン")
            && !document.getElementById("commentary")) {
        // 選択問題を解く画面
        const choices_div = document.querySelector("#drill_form");
        choices_div.scrollIntoView(true);
        // 選択肢のテキストを取得
        const choiceTexts = []
        for (const choice of choices_div.getElementsByTagName("input")) {
            choiceTexts.push(choice.value);
        }
        choiceTexts.sort()
        // 選択肢をすべてボタンに置換
        const choices_div_parent = choices_div.parentElement;
        choices_div.remove();
        const new_choices_div = document.createElement("div");

        const formHiddenInput = document.createElement("input");
        formHiddenInput.hidden = true;
        formHiddenInput.name = "answer[0]";
        choices_div_parent.appendChild(formHiddenInput);
        document.getElementById("ans_submit").style.display = "none";
        // 送信時チェックを騙す
        const formHiddenRadio = document.createElement("input");
        formHiddenRadio.type = "radio";
        formHiddenRadio.checked = true;
        formHiddenRadio.hidden = true;
        choices_div_parent.appendChild(formHiddenRadio);

        let choice_number = 1;
        for (const choiceText of choiceTexts) {
            const choiceButton = document.createElement("button");
            choiceButton.type = "button";
            choiceButton.innerText = choice_number + ". " + choiceText;
            choiceButton.classList.toggle("button");
            choiceButton.classList.toggle("button-primary");
            choiceButton.style.marginLeft = "10px";
            choiceButton.style.marginBottom = "10px";
            choiceButton.dataset.choiceNum = choice_number;

            const triedBefore = sessionStorage.triedBefore;
            if (typeof triedBefore == "string" && triedBefore.split(",").includes(String(choice_number))) {
                choiceButton.disabled = true;
                choiceButton.style.backgroundColor = "gray";
            }

            choiceButton.addEventListener("click", e => {
                formHiddenInput.value = choiceText;
                const triedBefore = sessionStorage.triedBefore;
                if (typeof triedBefore == "string") {
                    sessionStorage.triedBefore = `${triedBefore},${String(e.currentTarget.dataset.choiceNum)}`
                } else {
                    sessionStorage.triedBefore = String(e.currentTarget.dataset.choiceNum)
                }
                document.getElementById("ans_submit").click();
            });
            new_choices_div.appendChild(choiceButton);
            choice_number++;
        }
        choices_div_parent.appendChild(new_choices_div);

        function answer(choicenum) {
            new_choices_div.querySelectorAll("button")[choicenum].click();
        }

        // キーボード入力で解答
        const nowKeys = new Set(); // 現在押されているキー
        const answerKeys = []; // 押されたキーの履歴
        document.addEventListener("keydown", e => {
            if (e.key == "1") {
                answer(0);
            } else if (e.key == "2") {
                answer(1);
            } else if (e.key == "3") {
                answer(2);
            } else if (e.key == "4") {
                answer(3);
            } else if (e.key == "5") {
                answer(4);
            } else {
                answerKeys.push(e.key);
                nowKeys.add(e.key);

                if ((answerKeys.join("").indexOf("one") >= 0) || (nowKeys.has("o") && nowKeys.has("n") && nowKeys.has("e"))) {
                    answer(0);
                } else if ((answerKeys.join("").indexOf("two") >= 0) || (nowKeys.has("t") && nowKeys.has("w") && nowKeys.has("o"))) {
                    answer(1);
                } else if ((answerKeys.join("").indexOf("thr") >= 0) || (nowKeys.has("t") && nowKeys.has("h") && nowKeys.has("r"))) {
                    answer(2);
                } else if ((answerKeys.join("").indexOf("fou") >= 0) || (nowKeys.has("f") && nowKeys.has("o") && nowKeys.has("u"))) {
                    answer(3);
                } else if ((answerKeys.join("").indexOf("fiv") >= 0) || (nowKeys.has("f") && nowKeys.has("i") && nowKeys.has("v"))) {
                    answer(4);
                };
            };
        });
    } else if (document.body.classList.contains("page-problem") 
            && document.querySelector('h2.page-title small b').innerText.includes("ラジオボタン")) {
        // 正解で、解説が表示されている画面
        const go_next_button = document.getElementsByClassName("button-next-problem")[0];
        // 誤答履歴を削除
        sessionStorage.triedBefore = "";
        if (go_next_button) {
            setTimeout(() => {go_next_button.click();}, 1000);
        } else {
            document.back.submit()
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", main)
} else {
    main();
}
