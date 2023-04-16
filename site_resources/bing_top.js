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
                titleText.innerText = chrome.i18n.getMessage("bing_popup_title");
                popupTitle.appendChild(titleText);
                popupRoot.appendChild(popupTitle);
                const popupBody = document.createElement("p");
                popupBody.innerText = chrome.i18n.getMessage("bing_popup_body");
                popupRoot.appendChild(popupBody);
                const dismissButton = document.createElement("button");
                dismissButton.innerText = chrome.i18n.getMessage("bing_popup_dismiss");
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