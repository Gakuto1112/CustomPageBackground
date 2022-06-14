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
			transparentClassName = ["g-blk", "sfbg", "s8GCU", "jZWadf", "dG2XIf", "yyjhs", "GHDvEf", "f6F9Be", "FalWJb", "irmCpc", "XKnPEd", "HskPDe", "Z7Mseb", "SMWA9c", "vZFyxc"];
		}
		else if(location.href.startsWith("https://www.bing.com/search")) {
			transparentId = ["dc_topSection", "tta_output_ta"];
			transparentClassName = ["b_footer", "rel_ent_w", "dcont", "tta_incell", "tta_outcell", "b_algo", "b_ans", "b_wpTabsWrapper", "b_msg", "lite-entcard-blk", "mc_vtvc", "ent-dtab-content", "ent-dtab-style-content", "ent-dtab-ovr ent-dtab-ovr-nl", "b_imagePair", "video_metadata", "b_rrsr", "b_cards", "rel_ent_tw"];
			const className1 = document.getElementsByClassName("ent-dtab-ovr");
			if(className1.item(0)) className1.item(0).style.border = "none";
		}
		else if(location.href.startsWith("https://search.yahoo.co.jp")) {
			transparentId = ["header", "contents", "msthdtp"];
			transparentClassName = ["sw-Expand__button", "Footer", "Footer__space", "sw-Carousel__listItem", "sw-CardBase", "p"];
		}
		makeTransparentById(transparentId);
		makeTransparentByClassName(transparentClassName);
	}
});