import { BackgroundImageInjector } from "./BackgroundImageInjector.js";
import { update } from "./DataStructureUpdater.js";

/**
 * 処理中のメッセージボックスの操作関連
 */
const processDialog = {
	area: document.getElementById("process_dialog"),
	/**
	 * メッセージボックスを表示する。
	 */
	show: () => processDialog.area.classList.remove("hidden"),
	/**
	 * メッセージボックスを隠す。
	 */
	hide: () => processDialog.area.classList.add("hidden"),
	/**
	 * メッセージボックスのテキストを変更する。
	 * @param {string} text 変更するテキスト
	 */
	setLabel: (text) => document.querySelector("#process_dialog > p").innerText = text
}

/**
 * フッターの操作関連
 */
const footer = {
	footer: document.getElementById("footer"),
	saveButton: document.getElementById("save"),
	/**
	 * フッターを表示する。
	 */
	show: () => {
		document.body.classList.add("footer_space");
		footer.footer.classList.remove("hidden");
		footer.saveButton.disabled = false;
	},
	/**
	 * フッターを隠す。
	 */
	hide: () => {
		document.body.classList.remove("footer_space");
		footer.footer.classList.add("hidden");
	}
}

const imageSelector = document.getElementById("image_selector");
const noImageLabel = document.querySelector("#image_selector > p");
const allClearButton = document.getElementById("all_clear");
const allClearConfirmArea = document.getElementById("all_clear_confirm_area");
/**
 * "image_selector"に画像を追加する。
 * @param {string} imageSrc 画像のソース
 */
function addImage(imageSrc) {
	const imageDivElement = document.createElement("div");
	const imageElement = document.createElement("img");
	imageElement.src = imageSrc;
	imageDivElement.addEventListener("click", () => {
		imageDivElement.remove();
		if(imageSelector.childElementCount == 1) {
			noImageLabel.classList.remove("hidden");
			allClearButton.disabled = true;
			allClearConfirmArea.classList.add("hidden");
		}
		footer.show();
	});
	imageDivElement.appendChild(imageElement);
	imageSelector.appendChild(imageDivElement);
	noImageLabel.classList.add("hidden");
	allClearButton.disabled = allClearButton.classList.contains("hidden");
}

//画像追加のタブの操作
document.querySelectorAll("#image_addition_tabs > p").forEach((element) => element.addEventListener("click", (event) => {
	document.getElementsByClassName("active_tab").item(0).classList.remove("active_tab");
	event.target.classList.add("active_tab");
	const tabIndex = event.target.getAttribute("data-tab-index");
	document.querySelectorAll("#image_addition_tab_area > div").forEach((areaElement, index) => {
		if(index == tabIndex) areaElement.classList.remove("hidden");
		else areaElement.classList.add("hidden");
	});
	if(tabIndex == 2) {
		document.querySelectorAll("#image_addition_tabs > p:not(:last-child), #image_addition_tab_area").forEach((element) => element.classList.add("warning_border"));
		allClearButton.disabled = imageSelector.childElementCount == 1;
	}
	else {
		Array.from(document.getElementsByClassName("warning_border")).forEach((element) => element.classList.remove("warning_border"));
		allClearConfirmArea.classList.add("hidden");
	}
}));

/**
 * 画像の配列から画像を読み込む
 * @param {Array} imageArray
 */
function loadImages(imageArray) {
	imageArray.forEach((image, index) => {
		const reader = new FileReader();
		reader.addEventListener("load", (event) => {
			addImage(event.target.result);
			if(index == imageArray.length - 1) {
				processDialog.hide();
				footer.show();
			}
		}, {once: true});
		reader.readAsDataURL(image);
	});
}

/**
 * ページの視認性低下のメッセージを更新する。
 */
function refreshHardVisibilityMessage() {
	const hardVisibilityMessage = document.querySelector("#background_opacity_area > p");
	const hardVisibilityText = document.querySelector("#background_opacity_area > p > span:last-child");
	if(backgroundOpacity.value == 0 || backgroundOpacity.value >= 0.5) {
		if(backgroundOpacity.value == 0) hardVisibilityText.innerText = chrome.i18n.getMessage("image_invisible_warning");
		else hardVisibilityText.innerText = chrome.i18n.getMessage("image_opacity_warning");
		hardVisibilityMessage.classList.remove("hidden");
	}
	else {
		hardVisibilityText.innerText = "";
		hardVisibilityMessage.classList.add("hidden");
	}
}

//ローカルから画像読み込み
document.getElementById("load_from_local").addEventListener("click", () => {
	const fileInputElement = document.createElement("input");
	fileInputElement.type = "file";
	fileInputElement.accept = "image/*";
	fileInputElement.multiple = true;
	fileInputElement.addEventListener("change", () => {
		processDialog.show();
		processDialog.setLabel(chrome.i18n.getMessage("process_dialog_load"));
		const fileList = Array.from(fileInputElement.files);
		const localImages = fileList.filter((file) => file.type.startsWith("image/"));
		if(fileList.length > localImages.length) alert(chrome.i18n.getMessage("error_invalid_files"));
		loadImages(localImages);
		if(localImages.length == 0) processDialog.hide();
	});
	fileInputElement.click();
});

//クリップボードから画像読み込み
document.getElementById("load_from_clipboard").addEventListener("click", () => {
	processDialog.show();
	processDialog.setLabel(chrome.i18n.getMessage("process_dialog_load"));
	navigator.clipboard.read().then((clipboard) => {
		const clipboardImages = clipboard.filter((item) => item.types.find((type) => type.startsWith("image/")));
		if(clipboard.length > clipboardImages.length) alert(chrome.i18n.getMessage("error_no_clipboard_image"));
		Promise.all(clipboardImages.map((image) => image.getType(image.types.find((type) => type.startsWith("image/"))))).then(loadImages);
		if(clipboardImages.length == 0) processDialog.hide();
	}).catch(() => {
		alert(chrome.i18n.getMessage("error_no_clipboard_permission"));
		processDialog.hide();
	});
});

//画像全削除ボタン
allClearButton.addEventListener("click", () => {
	allClearConfirmArea.classList.remove("hidden");
	allClearButton.disabled = true;
});

//画像全削除確認ボタン
document.getElementById("all_clear_confirm").addEventListener("click", () => {
	noImageLabel.classList.remove("hidden");
	allClearConfirmArea.classList.add("hidden");
	allClearButton.disabled = true;
	footer.show();
	while(imageSelector.childElementCount >= 2) imageSelector.children.item(1).remove();
});

const imagePrevious = document.getElementById("image_previous");
const imageNext = document.getElementById("image_next");
const imagePositionNow = document.getElementById("image_position_now");
function previewChange() {
	//プレビューの画像変更ボタンの設定
	document.getElementById("image_position_total").innerText = imageSelector.children.length - 1;
	imagePrevious.disabled = true;
	imageNext.disabled = imageSelector.childElementCount <= 2;
	if(imageSelector.children.length >= 2) {
		imagePositionNow.innerText = 1;
		background.setImage(imageSelector.children.item(1).firstElementChild.src);
	}
	else {
		imagePositionNow.innerText = 0;
		background.setImage("");
	}
}

const imageSelectorObserver = new MutationObserver(previewChange);
imageSelectorObserver.observe(imageSelector, {
	childList: true
});

const previewFrame = document.getElementById("preview_frame");
const backgroundOpacity = document.getElementById("background_opacity");
const blurBorder = document.getElementById("blur_border");
const background = new BackgroundImageInjector(previewFrame, "", 0, 4, backgroundOpacity.value, blurBorder.value);
["frame_right", "frame_bottom", "frame_right_bottom"].forEach((elementId) => document.getElementById(elementId).addEventListener("mousedown", (event) => {
	function onPreviewResize(event) {
		if(resizeFrag[0]) previewFrame.style.width = `${frameSize[0] - mousePos[0] + event.screenX}px`;
		if(resizeFrag[1]) previewFrame.style.height = `${frameSize[1] - mousePos[1] + event.screenY}px`;
	}

	const mousePos = [event.screenX, event.screenY];
	const frameSize = [previewFrame.clientWidth, previewFrame.clientHeight];
	const resizeFrag = [event.target.id.startsWith("frame_right"), /^frame(_right)?_bottom$/.test(event.target.id)];
	document.body.addEventListener("mousemove", onPreviewResize);
	document.body.addEventListener("mouseup", () => document.body.removeEventListener("mousemove", onPreviewResize), {once: true});
}));

imagePrevious.addEventListener("click", () => {
	const currentPosition = Number(imagePositionNow.innerText);
	if(currentPosition >= 2) {
		imagePositionNow.innerText = currentPosition - 1;
		imagePrevious.disabled = currentPosition == 2;
		imageNext.disabled = false;
		background.setImage(imageSelector.children.item(currentPosition - 1).firstElementChild.src);
	}
});

imageNext.addEventListener("click", () => {
	const currentPosition = Number(imagePositionNow.innerText);
	if(currentPosition <= imageSelector.childElementCount - 2) {
		imagePositionNow.innerText = currentPosition + 1;
		imageNext.disabled = currentPosition == imageSelector.childElementCount - 2;
		imagePrevious.disabled = false;
		background.setImage(imageSelector.children.item(currentPosition + 1).firstElementChild.src);
	}
});

const justifyMethodWhole = document.getElementById("justify_method_whole");
const justifyMethodExpand = document.getElementById("justify_method_expand");
const expandAlignGrid = document.getElementById("expand_align_grid");
justifyMethodWhole.addEventListener("change", () => {
	if(justifyMethodWhole.checked) {
		background.setJustifyMethod(0);
		expandAlignGrid.parentElement.classList.add("hidden");
		document.getElementById("expand_align_cc").checked = true;
		background.setImageAlign(4);
	}
});
justifyMethodExpand.addEventListener("change", () => {
	if(justifyMethodExpand.checked) {
		background.setJustifyMethod(1);
		expandAlignGrid.parentElement.classList.remove("hidden");
	}
});

const expandAlign = document.getElementsByName("expand_align");
expandAlign.forEach((element) => element.addEventListener("change", () => {
	for(let i = 0; i < expandAlign.length; i ++) {
		if(expandAlign.item(i).checked) {
			background.setImageAlign(i);
			break;
		}
	}
}));

backgroundOpacity.addEventListener("change", () => {
	background.setOpacity(backgroundOpacity.value);
	refreshHardVisibilityMessage();
});

const generalHideSidePanel = document.getElementById("general_hide_side_panel");
const sampleSidePanel = document.querySelector("#sample_search_page > div:last-child > div:last-child");
generalHideSidePanel.addEventListener("change", () => {
	if(generalHideSidePanel.checked) sampleSidePanel.classList.add("hidden");
	else sampleSidePanel.classList.remove("hidden");
});

blurBorder.addEventListener("change", () => background.setBlur(blurBorder.value));

/**
 * 画像の保存枚数
 * @type {number}
 */
const googleHideSeasonalIllust = document.getElementById("google_hide_seasonal_illust");
let savedImageCount = 0;
footer.saveButton.addEventListener("click", () => {
	footer.hide();
	processDialog.show();
	processDialog.setLabel(chrome.i18n.getMessage("process_dialog_saving"));
	footer.saveButton.disabled = true;
	let imageAlignNumber;
	for(let i = 0; i < expandAlign.length; i++) {
		if(expandAlign.item(i).checked) {
			imageAlignNumber = i;
			break;
		}
	}
	const data = {
		image_count: 0,
		style: {
			justify_method: justifyMethodExpand.checked ? 1 : 0,
			image_align: imageAlignNumber,
			opacity: backgroundOpacity.value,
			border_blur: blurBorder.value
		},
		site_config: {
			general: {
				hide_side_panel: generalHideSidePanel.checked
			},
			google: {
				hide_seasonal_illust: googleHideSeasonalIllust.checked
			}
		}
	}
	Array.from(imageSelector.children).slice(1).forEach((imageDiv) => data[`image_${data.image_count++}`] = imageDiv.firstElementChild.src);

	function saveImage() {
		chrome.storage.local.set(data, () => {
			savedImageCount = data.image_count;
			processDialog.setLabel(chrome.i18n.getMessage("process_dialog_save_done"));
			setTimeout(processDialog.hide, 1500);
		});
	}

	if(data.image_count < savedImageCount) {
		const removeImageArray = [];
		for(let i = data.image_count; i < savedImageCount; i++) removeImageArray.push(`image_${i}`);
		chrome.storage.local.remove(removeImageArray, saveImage);
	}
	else saveImage();
});

document.querySelectorAll(".modify").forEach((element) => element.addEventListener("click", () => footer.show()));

window.addEventListener("beforeunload", (event) => {
	if(!footer.saveButton.disabled) event.returnValue = chrome.i18n.getMessage("message_unsaved_changes");
});

//イベント設定等以外の処理
document.documentElement.lang = chrome.i18n.getMessage("@@ui_locale");
document.title = chrome.i18n.getMessage("options_title");
document.querySelectorAll("[data-locale-key]").forEach((element) => element.innerText = chrome.i18n.getMessage(element.dataset.localeKey));
processDialog.show();
processDialog.setLabel(chrome.i18n.getMessage("process_dialog_update"));
const windowRatio = window.innerWidth / window.innerHeight;
if(windowRatio <= 16 / 9) previewFrame.style.width = `${480 * (windowRatio / 1.78)}px`;
else previewFrame.style.height = `${270 / (windowRatio / 1.78)}px`;
update().then(() => {
	processDialog.setLabel(chrome.i18n.getMessage("process_dialog_load"));
	chrome.storage.local.get(["image_count", "style", "site_config"], (result) => {
		switch(result.style.justify_method) {
			case 0:
				justifyMethodWhole.checked = true;
				break;
			case 1:
				justifyMethodExpand.checked = true;
				expandAlignGrid.parentElement.classList.remove("hidden");
				break;
		}
		background.setJustifyMethod(result.style.justify_method);
		expandAlign.item(result.style.image_align).checked = true;
		background.setImageAlign(result.style.image_align);
		backgroundOpacity.value = result.style.opacity;
		refreshHardVisibilityMessage();
		background.setOpacity(result.style.opacity);
		blurBorder.value = result.style.border_blur;
		background.setBlur(result.style.border_blur);
		generalHideSidePanel.checked = result.site_config.general.hide_side_panel;
		if(result.site_config.general.hide_side_panel) sampleSidePanel.classList.add("hidden");
		googleHideSeasonalIllust.checked = result.site_config.google.hide_seasonal_illust;
		if(result.image_count > 0) {
			const loadImageArray = [];
			for(let i = 0; i < result.image_count; i++)  loadImageArray.push(`image_${i}`);
			chrome.storage.local.get(loadImageArray, (resultImages) => {
				for(let i = 0; i < result.image_count; i++) addImage(resultImages[`image_${i}`]);
				savedImageCount = result.image_count;
				processDialog.hide();
			});
		}
		else {
			savedImageCount = result.image_count;
			processDialog.hide();
		}
	});
});