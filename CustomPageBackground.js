//画像の挿入
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

//サイドバーの非表示
chrome.storage.local.get("site_config", (siteConfig) => {
	if(siteConfig.site_config.general.hide_side_panel) {
		["TQc1id"].forEach((className) => {
			Array.from(document.getElementsByClassName(className)).forEach((element) => {
				const sidePanelArea = document.createElement("div");
				sidePanelArea.classList.add("background_image_injector_side_panel_area");
				element.classList.forEach((sidePanelClass) => {
					sidePanelArea.classList.add(sidePanelClass);
					element.classList.remove(sidePanelClass);
				});
				element.classList.add("background_image_injector_hidden_base", "background_image_injector_hidden");
				const showSidePanelButton = document.createElement("button");
				showSidePanelButton.innerText = "サイドパネル再表示";
				showSidePanelButton.classList.add("background_image_injector_show_side_panel_button");
				showSidePanelButton.addEventListener("click", () => {
					element.classList.remove("background_image_injector_hidden");
					showSidePanelButton.remove();
				}, {once: true});
				sidePanelArea.appendChild(showSidePanelButton);
				element.parentNode.appendChild(sidePanelArea);
				sidePanelArea.appendChild(element);
			});
		});
	}
});