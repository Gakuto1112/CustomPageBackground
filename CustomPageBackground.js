function makeTransparentById(id) {
	document.getElementById(id).style.backgroundColor = "transparent";
}

function makeTransparentByClassName(className) {
	Array.from(document.getElementsByClassName(className)).forEach((element) => element.style.backgroundColor = "transparent");
}

chrome.storage.local.get(["apply_sites"], (siteResult) => {
	if(siteResult.apply_sites.find((site) => location.href.startsWith(site))) {
		chrome.storage.local.get(["images", "style"], (backgroundResult) => {
			if(backgroundResult.images.length != 0) new BackgroundImageInjector("window", backgroundResult.images[Math.floor(Math.random() * backgroundResult.images.length)], backgroundResult.style.justify_method, backgroundResult.style.opacity, backgroundResult.style.border_blur);
		});
		if(location.href.startsWith("https://www.google.com/search")) {
			makeTransparentById("pTwnEc");
			makeTransparentById("appbar");
		}
		else if(location.href.startsWith("https://www.bing.com/search")) Array.from(document.getElementById("b_results").children).forEach((child) => child.style.backgroundColor = "transparent");
		else if(location.href.startsWith("https://search.yahoo.co.jp/search")) {
			makeTransparentById("header");
			makeTransparentById("contents");
			makeTransparentByClassName("sw-Expand__button");
			Array.from(document.getElementsByClassName("Contents__innerGroupBody").item(0).children).forEach((child) => child.style.backgroundColor = "transparent");
			makeTransparentByClassName("Footer");
			makeTransparentByClassName("Footer__space");
		}
	}
});