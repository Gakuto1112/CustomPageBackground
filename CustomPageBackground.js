function makeTransparentById(id) {
	const targetElement = document.getElementById(id);
	if(targetElement) targetElement.style.backgroundColor = "transparent";
}

function makeTransparentByClassName(className) {
	const array = Array.from(document.getElementsByClassName(className));
	if(array.length >= 1) Array.from(document.getElementsByClassName(className)).forEach((element) => element.style.backgroundColor = "transparent");
}

chrome.storage.local.get(["apply_sites"], (siteResult) => {
	if(siteResult.apply_sites.find((site) => location.href.startsWith(site))) {
		chrome.storage.local.get(["images", "style"], (backgroundResult) => {
			if(backgroundResult.images.length != 0) new BackgroundImageInjector("window", backgroundResult.images[Math.floor(Math.random() * backgroundResult.images.length)], backgroundResult.style.justify_method, backgroundResult.style.image_align, backgroundResult.style.opacity, backgroundResult.style.border_blur);
		});
		if(location.href.startsWith("https://www.google.com/search")) {
			const header = Array.from(document.getElementsByClassName("sfbg"));
			const searchForm = document.getElementById("searchform");
			if(searchForm) {
				const observer = new MutationObserver(() => {
					if(searchForm.classList.contains("minidiv")) header.forEach((element) => element.style.backgroundColor = "");
					else header.forEach((element) => element.style.backgroundColor = "transparent");
				});
				observer.observe(searchForm, {
					attributes: true,
					attributeFilter: ["class"]
				});				
			}
			const kO001e = document.getElementById("kO001e");
			if(kO001e) {
				const observer = new MutationObserver(() => {
					if(kO001e.classList.contains("DU1Mzb")) kO001e.style.backgroundColor = "";
					else kO001e.style.backgroundColor = "transparent";
				});
				observer.observe(kO001e, {
					attributes: true,
					attributeFilter: ["class"]
				});
			}
			makeTransparentByClassName("sfbg");
			makeTransparentByClassName("s8GCU");
			makeTransparentByClassName("jZWadf")
			makeTransparentById("kO001e");
			makeTransparentById("pTwnEc");
			makeTransparentById("appbar");
			makeTransparentByClassName("dG2XIf");
			makeTransparentByClassName("yyjhs");
			makeTransparentByClassName("GHDvEf");
			makeTransparentByClassName("f6F9Be");
			makeTransparentByClassName("FalWJb");
			makeTransparentById("tw-target");
			makeTransparentByClassName("irmCpc");
			makeTransparentByClassName("XKnPEd");
			makeTransparentByClassName("HskPDe");
			makeTransparentByClassName("Z7Mseb");
			makeTransparentByClassName("SMWA9c");
		}
		else if(location.href.startsWith("https://www.bing.com/search")) {
			Array.from(document.getElementById("b_results").children).forEach((child) => child.style.backgroundColor = "transparent");
			makeTransparentByClassName("b_footer");
			makeTransparentByClassName("rel_ent_w");
			makeTransparentById("dc_topSection");
			makeTransparentByClassName("dcont");
			makeTransparentByClassName("tta_incell");
			makeTransparentByClassName("tta_outcell");
			makeTransparentById("tta_output_ta");
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