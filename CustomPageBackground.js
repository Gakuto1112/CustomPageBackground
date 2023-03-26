Promise.all([
	import(chrome.runtime.getURL("BackgroundImageInjector.js")),
	import(chrome.runtime.getURL("DataStructureUpdater.js")),
]).then((modules) => {
	modules[1].update().then(() => {
		chrome.storage.local.get("image_count", (imageCount) => {
			if(imageCount.image_count > 0) {
				const targetImage = Math.floor(Math.random() * imageCount.image_count);
				chrome.storage.local.get([`image_${targetImage}`, "style"], (resultData) => new modules[0].BackgroundImageInjector("window", resultData[`image_${targetImage}`], resultData.style.justify_method, resultData.style.image_align, resultData.style.opacity, resultData.style.border_blur));
			}
		});
	});
});