chrome.runtime.onInstalled.addListener((details) => {
	if(details.reason == "install") {
		chrome.storage.local.set({
			image_count: 0,
			style: {
				justify_method: 0,
				image_align: 4,
				opacity: 0.3,
				border_blur: 10
			}
		}, chrome.runtime.openOptionsPage);
	}
});

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());