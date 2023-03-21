let applySites = [];
function loadApplySites() {
	chrome.storage.local.get(["apply_sites"], (result) => {
		applySites = result.apply_sites;
	});
}

chrome.runtime.onInstalled.addListener((details) => {
	if(details.reason == "install") {
		chrome.storage.local.set({
			images: [],
			style: {
				justify_method: 0,
				image_align: 4,
				opacity: 0.5,
				border_blur: 10
			},
			apply_sites: []
		});
	}
});

chrome.tabs.onUpdated.addListener((tabId, object, tab) => {
	if(applySites.find((site) => tab.url.startsWith(site)) && object.status == "complete") chrome.scripting.executeScript({files: ["CustomPageBackgroundChecker.js"], target: {tabId: tabId}});
});

chrome.runtime.onMessage.addListener((message, sender) => {
	switch(message.message) {
		case "inject":
			chrome.scripting.executeScript({files: ["CustomPageBackground.js"], target: {tabId: sender.tab.id}});
			chrome.scripting.insertCSS({files: ["AllTransparent.css", "BackgroundImageInjector.css"], target: {tabId: sender.tab.id}});
			break;
		case "reload":
			loadApplySites();
			break;
	}
});

loadApplySites();