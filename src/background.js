function onPageLoad() {
    // ここに実行したいJavaScriptコードを書きます
    console.log("ページがロードされました！");
    // 例: 特定の要素を取得して操作する
    document.body.style.color = "red";
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("Page updated");
    if (changeInfo.status == 'complete') {
        console.log("run");
        console.log(tabId, changeInfo,tab);

        chrome.tabs.getSelected(null, (tab) => {
            console.log(tab.url)
        });
    }
});