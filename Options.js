import { BackgroundImageInjector } from "./BackgroundImageInjector.js"

const imageSelector = document.getElementById("image_selector");
/**
 * "image_selector"に画像を追加する。
 * @param {string} imageSrc 画像のソース
 * @param {boolean} drawSample プレビューにこの画像を背景として描画するかどうか。
 * @param {boolean} showFooter 設定の保存を促すフッターを表示するかどうか。
 */
function addImage(imageSrc, drawSample, showFooter) {
	const imageDivElement = document.createElement("div");
	const imageElement = document.createElement("img");
	imageElement.src = imageSrc;
	if(drawSample) imageElement.addEventListener("load", () => drawPreviewElementSample(), {once: true});
	imageDivElement.addEventListener("click", () => {
		imageDivElement.remove();
		slideInFooter();
	});
	imageDivElement.appendChild(imageElement);
	imageSelector.appendChild(imageDivElement);
	if(showFooter) slideInFooter();
}

/**
 * プレビューの初期描画・再描画を行う。
 */
function drawPreviewElementSample() {
	const canvas = document.getElementById("preview_elements_sample");
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	const context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	context.strokeStyle = "black";
	context.lineWidth = 1;
	context.fillStyle = "white";
	context.fillRect(20, 20, Math.max(Math.min(canvas.clientWidth - 80, 250), 50), 20);
	context.strokeRect(20, 21, Math.max(Math.min(canvas.clientWidth - 80, 250), 50), 18);
	context.fillStyle = "royalblue";
	context.fillRect(Math.max(Math.min(canvas.clientWidth - 61, 231), 71), 20, 40, 20);
	for(let i = 0; i < (canvas.clientHeight - 60) / 70; i++) {
		context.fillStyle = "mediumblue";
		context.fillRect(20, i * 70 + 60, Math.max(Math.min(canvas.clientWidth - 40, 150), 90), 10);
		context.fillStyle = "dimgray";
		for(let j = 0; j < 3; j++) context.fillRect(20, i * 70 + j * 10 + 80, Math.max(Math.min(canvas.clientWidth - 40, 120), 90), 5);
	}
}

const imagePrevious = document.getElementById("image_previous");
const imageNext = document.getElementById("image_next");
const imagePositionNow = document.getElementById("image_position_now");
const imageAllClearButton = document.getElementById("image_all_clear_button");
function previewChange() {
	//プレビューの画像変更ボタンの設定
	document.getElementById("image_position_total").innerText = imageSelector.children.length - 1;
	imagePrevious.classList.add("button_disabled");
	if(imageSelector.childElementCount >= 3) imageNext.classList.remove("button_disabled");
	else imageNext.classList.add("button_disabled");
	if(imageSelector.children.length >= 2) {
		imagePositionNow.innerText = 1;
		background.setImage(imageSelector.children.item(1).firstElementChild.src);
	}
	else {
		imagePositionNow.innerText = 0;
		background.setImage("");
	}
	if(imageSelector.childElementCount >= 2) imageAllClearButton.classList.remove("button_disabled");
	else imageAllClearButton.classList.add("button_disabled");
}

const footer = document.getElementById("footer");
const saveButton = document.getElementById("save_button");
function slideInFooter() {
	//フッターのスライドイン
	if(footer.classList.contains("hidden")) {
		saveButton.classList.remove("button_disabled");
		footer.classList.remove("hidden");
		footer.classList.add("footer_slide_in");
		footer.addEventListener("animationend", () => footer.classList.remove("footer_slide_in"), {once: true});
	}
}

function slideOutFooter() {
	//フッターのスライドアウト
	if(!footer.classList.contains("hidden")) {
		footer.classList.remove("footer_slide_in");
		footer.classList.add("footer_slide_out");
		footer.addEventListener("animationend", () => {
			footer.classList.remove("footer_slide_out");
			footer.classList.add("hidden")
		}, {once: true});
	}
}

const imageSelectorObserver = new MutationObserver(previewChange);
imageSelectorObserver.observe(imageSelector, {
	childList: true
});

document.getElementById("new_image").addEventListener("click", () => {
	const fileInputElement = document.createElement("input");
	fileInputElement.type = "file";
	fileInputElement.accept = ".png, .jpg, .jpeg, .gif";
	fileInputElement.multiple = true;
	fileInputElement.addEventListener("change", () => {
		const fileList = Array.from(fileInputElement.files);
		const acceptFileType = ["png", "jpg", "jpeg", "gif"];
		const inputImages = fileList.filter((file) => acceptFileType.indexOf(file.name.split(".").slice(-1)[0].toLowerCase()) >= 0);
		if(fileList.length != inputImages.length) alert("対応していない拡張子のファイルが選択されています。これらのファイルは無視されます。\n\n使用出来る拡張子は " + acceptFileType.join(", ") + " です。");
		inputImages.forEach((image) => {
			const reader = new FileReader();
			reader.addEventListener("load", (event) => addImage(event.target.result, false, true));
			reader.readAsDataURL(image);
		});
	});
	fileInputElement.click();
});

imageAllClearButton.addEventListener("click", () => {
	if(imageSelector.childElementCount >= 2) {
		if(confirm("「画像全消去」ボタンが押されました。保存してある画像を全て削除します。宜しいですか？")) {
			while(imageSelector.childElementCount >= 2) imageSelector.children.item(1).remove();
			imageAllClearButton.classList.add("button_disabled");
			slideInFooter();
		}
	}
});

const previewFrame = document.getElementById("preview_frame");
const backgroundOpacity = document.getElementById("background_opacity");
const blurBorder = document.getElementById("blur_border");
const background = new BackgroundImageInjector(previewFrame, "", 0, 4, backgroundOpacity.value, blurBorder.value);
["frame_right", "frame_bottom", "frame_right_bottom"].forEach((elementId) => document.getElementById(elementId).addEventListener("mousedown", (event) => {

	function onPreviewResize(event) {
		if(resizeFrag[0]) previewFrame.style.width = `${frameSize[0] - mousePos[0] + event.screenX}px`;
		if(resizeFrag[1]) previewFrame.style.height = `${frameSize[1] - mousePos[1] + event.screenY}px`;
		drawPreviewElementSample();
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
		if(currentPosition == 2) imagePrevious.classList.add("button_disabled");
		imageNext.classList.remove("button_disabled");
		background.setImage(imageSelector.children.item(currentPosition - 1).firstElementChild.src);
	}
});

imageNext.addEventListener("click", () => {
	const currentPosition = Number(imagePositionNow.innerText);
	if(currentPosition <= imageSelector.childElementCount - 2) {
		imagePositionNow.innerText = currentPosition + 1;
		if(currentPosition == imageSelector.childElementCount - 2) imageNext.classList.add("button_disabled");
		imagePrevious.classList.remove("button_disabled");
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
		if(expandAlign.item(i).checked) background.setImageAlign(i);
		break;
	}
}));

backgroundOpacity.addEventListener("change", () => background.setOpacity(backgroundOpacity.value));

blurBorder.addEventListener("change", () => background.setBlur(blurBorder.value));

/**
 * 画像の保存枚数
 * @type {number}
 */
let savedImageCount = 0;
saveButton.addEventListener("click", () => {
	saveButton.classList.add("button_disabled");
	let imageAlignNumber;
	for(let i = 0; i < expandAlign.length; i++) {
		if(expandAlign.item(i).checked) imageAlignNumber = i;
		break;
	}
	const data = {
		imageCount: 0,
		style: {
			justify_method: justifyMethodExpand.checked ? 1 : 0,
			image_align: imageAlignNumber,
			opacity: backgroundOpacity.value,
			border_blur: blurBorder.value
		}
	}
	Array.from(imageSelector.children).slice(1).forEach((imageDiv) => data[`image_${data.imageCount++}`] = imageDiv.firstElementChild.src);

	function saveImage() {
		chrome.storage.local.set(data, () => {
			savedImageCount = data.imageCount;
			alert("保存しました。");
			slideOutFooter();
		});
	}

	if(data.imageCount < savedImageCount) {
		const removeImageArray = [];
		for(let i = data.imageCount; i < savedImageCount; i++) removeImageArray.push(`image_${i}`);
		chrome.storage.local.remove(removeImageArray, saveImage);
	}
	else {
		saveImage();
	}
});

window.addEventListener("beforeunload", (event) => {
	if(!saveButton.classList.contains("button_disabled")) event.returnValue = "未保存の変更があります。続行するとこれらの変更は失われます。続けますか？";
});

chrome.storage.local.get(["imageCount", "style"], (result) => {
	function loadData() {
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
		background.setOpacity(result.style.opacity);
		blurBorder.value = result.style.border_blur;
		background.setBlur(result.style.border_blur);
		if(savedImageCount > 0) {
			const loadImageArray = [];
			for(let i = 0; i < savedImageCount; i++)  loadImageArray.push(`image_${i}`);
			chrome.storage.local.get(loadImageArray, (resultImages) => {
				for(let i = 0; i < savedImageCount; i++) addImage(resultImages[`image_${i}`], i == 0, false);
			});
		}
	}

	if(result.imageCount != undefined) {
		savedImageCount = result.imageCount;
		loadData();
	}
	else {
		chrome.storage.local.get("images", (resultImages) => {
			savedImageCount = 0;
			if(resultImages.images) {
				const imageData = {};
				resultImages.images.forEach((image) => imageData[`image_${savedImageCount++}`] = image);
				imageData.imageCount = savedImageCount;
				chrome.storage.local.remove("images", () => chrome.storage.local.set(imageData, loadData));
			}
			else loadData();
		});
	}
	savedImageCount = result.imageCount;
});

document.querySelectorAll(".modify").forEach((element) => element.addEventListener("click", () => slideInFooter()));