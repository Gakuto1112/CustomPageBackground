chrome.runtime.onInstalled.addListener((details) => {
	if(details.reason == "install") {
		chrome.storage.local.set({
			images: [],
			style: {
				justify_method: 0,
				opacity: 0.5,
				border_blur: 10
			},
			apply_sites: []
		});
	}
});