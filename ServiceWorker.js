chrome.runtime.onInstalled.addListener((details) => {
	if(details.reason == "install") {
		chrome.storage.local.set({
			image_count: 0,
			style: {
				justify_method: 0,
				image_align: 4,
				opacity: 0.3,
				border_blur: 10
			},
			site_config: {
				general: {
					hide_side_panel: false
				},
				google: {
					hide_seasonal_illust: false
				}
			}
		}, chrome.runtime.openOptionsPage);
	}
});

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());