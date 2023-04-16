chrome.storage.local.get("bing_popup_count", (result) => {
    const count = result.bing_popup_count == undefined ? 0 : result.bing_popup_count;
    if(count < 3) {
        if(!document.getElementsByClassName("hp_body").item(0).classList.contains("no_image")) {
            chrome.storage.local.set({
                bing_popup_count: count + 1
            }, () => {
                const popupRoot = document.createElement("div");
                popupRoot.classList.add("custom_page_background_bing_popup");
                const popupTitle = document.createElement("div");
                const titleIcon = document.createElement("img");
                titleIcon.src = chrome.runtime.getURL("icons/icon48.png");
                popupTitle.appendChild(titleIcon);
                const titleText = document.createElement("p");
                titleText.innerText = "カスタム背景からのお知らせ";
                popupTitle.appendChild(titleText);
                popupRoot.appendChild(popupTitle);
                const popupBody = document.createElement("p");
                popupBody.innerText = "こちらのbingのトップページも背景挿入の対象のページとなっています。挿入された背景を表示するには、画面右上の「設定とクリックリンク」（≡）から、「ホームページの画像を表示」をオフにして下さい。";
                popupRoot.appendChild(popupBody);
                const dismissButton = document.createElement("button");
                dismissButton.innerText = "OK";
                dismissButton.addEventListener("click", () => {
                    chrome.storage.local.set({
                        bing_popup_count: 3
                    }, () => popupRoot.remove());
                });
                popupRoot.appendChild(dismissButton);
                document.body.appendChild(popupRoot);
            });
        }
        else {
            chrome.storage.local.set({
                bing_popup_count: 3
            });
        }
    }
});