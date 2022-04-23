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
			const searchForm = document.getElementById("searchform");
			const header = Array.from(document.getElementsByClassName("sfbg"));
			const observer = new MutationObserver(() => {
				if(searchForm.classList.contains("minidiv")) header.forEach((element) => element.style.backgroundColor = "");
				else header.forEach((element) => element.style.backgroundColor = "transparent");
			});
			observer.observe(searchForm, {
				attributes: true,
				attributeFilter: ["class"]
			});
			makeTransparentByClassName("sfbg");
			makeTransparentById("pTwnEc");
			makeTransparentById("appbar");
			makeTransparentByClassName("GHDvEf");
			makeTransparentByClassName("f6F9Be");
		}
		else if(location.href.startsWith("https://www.bing.com/search")) {
			Array.from(document.getElementById("b_results").children).forEach((child) => child.style.backgroundColor = "transparent");
			makeTransparentByClassName("b_footer");
		}
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