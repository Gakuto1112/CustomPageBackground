chrome.storage.local.get(["images", "style"], (backgroundResult) => {
	if(backgroundResult.images.length != 0) new BackgroundImageInjector("window", backgroundResult.images[Math.floor(Math.random() * backgroundResult.images.length)], backgroundResult.style.justify_method, backgroundResult.style.image_align, backgroundResult.style.opacity, backgroundResult.style.border_blur);
});