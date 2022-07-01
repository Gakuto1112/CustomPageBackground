let applySites = [];
let lastURL = "";

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
			apply_sites: [
				"https://www.google.com/search",
				"https://www.bing.com/search",
				"https://search.yahoo.co.jp"
			]
		});
	}
});

chrome.tabs.onUpdated.addListener((tabId, object, tab) => {
	if(tab.url != lastURL) {
		if(applySites.find((site) => tab.url.startsWith(site))) {
			chrome.scripting.executeScript({files: ["CustomPageBackground.js", "BackgroundImageInjector.js"], target: {tabId: tabId}});
			chrome.scripting.insertCSS({files: ["AllTransparent.css", "BackgroundImageInjector.css"], target: {tabId: tabId}});
		}
		lastURL = tab.url;
	}
});

chrome.storage.local.get(["apply_sites"], (result) => {
	applySites = result.apply_sites;
});