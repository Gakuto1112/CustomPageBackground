function makeTransparentById(idArray) {
	idArray.forEach((id) => {
		const targetElement = document.getElementById(id);
		if(targetElement) targetElement.style.backgroundColor = "transparent";
	});
}

function makeTransparentByClassName(classNameArray) {
	classNameArray.forEach((className) => {
		const array = Array.from(document.getElementsByClassName(className));
		if(array.length >= 1) Array.from(document.getElementsByClassName(className)).forEach((element) => element.style.backgroundColor = "transparent");
	});
}

chrome.storage.local.get(["apply_sites"], (siteResult) => {
	if(siteResult.apply_sites.find((site) => location.href.startsWith(site))) {
		chrome.storage.local.get(["images", "style"], (backgroundResult) => {
			if(backgroundResult.images.length != 0) new BackgroundImageInjector("window", backgroundResult.images[Math.floor(Math.random() * backgroundResult.images.length)], backgroundResult.style.justify_method, backgroundResult.style.image_align, backgroundResult.style.opacity, backgroundResult.style.border_blur);
		});
		let transparentId = [];
		let transparentClassName = [];
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
			transparentId = ["kO001e", "pTwnEc", "appbar", "tw-target"];
			transparentClassName = ["sfbg", "s8GCU", "jZWadf", "dG2XIf", "yyjhs", "GHDvEf", "f6F9Be", "FalWJb", "irmCpc", "XKnPEd", "HskPDe", "Z7Mseb", "SMWA9c", "vZFyxc"];
		}
		else if(location.href.startsWith("https://www.bing.com/search")) {
			transparentId = ["dc_topSection", "tta_output_ta"];
			transparentClassName = ["b_footer", "rel_ent_w", "dcont", "tta_incell", "tta_outcell"];
			Array.from(document.getElementById("b_results").children).forEach((child) => child.style.backgroundColor = "transparent");

		}
		else if(location.href.startsWith("https://search.yahoo.co.jp/search")) {
			transparentId = ["header", "contents"];
			transparentClassName = ["sw-Expand__button", "Footer", "Footer__space"];
			Array.from(document.getElementsByClassName("Contents__innerGroupBody").item(0).children).forEach((child) => child.style.backgroundColor = "transparent");
		}
		makeTransparentById(transparentId);
		makeTransparentByClassName(transparentClassName);
	}
});