if(window.getComputedStyle(document.body).backgroundColor == "rgb(32, 33, 36)") document.documentElement.style.setProperty("--background-color", "#202124");
chrome.storage.local.get("site_config", (siteConfig) => {
	if(siteConfig.site_config.google.hide_seasonal_illust) Array.from(document.getElementsByClassName("IormK")).forEach((element) => element.style.display = "none");
});