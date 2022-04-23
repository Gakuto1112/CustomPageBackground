const imageSelector = document.getElementById("image_selector");
function addImage(imageSrc) {
	//image_selectorに画像追加
	const imageDivElement = document.createElement("div");
	imageDivElement.classList.add("image_div");
	imageDivElement.addEventListener("click", () => imageDivElement.remove());
	imageDivElement.addEventListener("mouseover", () => {
		imageElement.classList.add("remove_hover");
		xMark.innerText = "x";
		xMark.classList.add("character_mark", "x_mark");
		imageDivElement.appendChild(xMark);
	});
	imageDivElement.addEventListener("mouseout", () => {
		imageElement.classList.remove("remove_hover");
		xMark.remove();
	});
	const imageElement = document.createElement("img");
	imageElement.src = imageSrc;
	const xMark = document.createElement("p");
	imageDivElement.appendChild(imageElement);
	imageSelector.appendChild(imageDivElement);
}

function drawPreviewElementSample() {
	//プレビュー枠のサンプルを描画する。
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
			reader.addEventListener("load", (event) => addImage(event.target.result));
			reader.readAsDataURL(image);
		});
	});
	fileInputElement.click();
});

let previewFrameResizeEvent;
const previewFrame = document.getElementById("preview_frame");
const backgroundOpacity = document.getElementById("background_opacity");
const blurBorder = document.getElementById("blur_border");
const background = new BackgroundImageInjector(previewFrame, "", 0, backgroundOpacity.value, blurBorder.value);
const justifyMethodExpand = document.getElementById("justify_method_expand");
if(justifyMethodExpand.checked) background.setJustifyMethod(1);
const frameRight = document.getElementById("frame_right");
let mouseX, frameWidth;
frameRight.addEventListener("mousedown", (event) => {
	frameWidth = previewFrame.clientWidth;
	mouseX = event.screenX;
	previewFrameResizeEvent = (event) => {
		previewFrame.style.width = frameWidth - mouseX + event.screenX + "px";
		drawPreviewElementSample();
	};
	frameRight.addEventListener("mousemove", previewFrameResizeEvent);
});
frameRight.addEventListener("mouseup", () => frameRight.removeEventListener("mousemove", previewFrameResizeEvent));
frameRight.addEventListener("mouseout", () => frameRight.removeEventListener("mousemove", previewFrameResizeEvent));

const frameBottom = document.getElementById("frame_bottom");
let mouseY, frameHeight;
frameBottom.addEventListener("mousedown", (event) => {
	frameHeight = previewFrame.clientHeight;
	mouseY = event.screenY;
	previewFrameResizeEvent = (event) => {
		previewFrame.style.height = frameHeight - mouseY + event.screenY + "px";
		drawPreviewElementSample();
	}
	frameBottom.addEventListener("mousemove", previewFrameResizeEvent);
});
frameBottom.addEventListener("mouseup", () => frameBottom.removeEventListener("mousemove", previewFrameResizeEvent));
frameBottom.addEventListener("mouseout", () => frameBottom.removeEventListener("mousemove", previewFrameResizeEvent));

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
justifyMethodWhole.addEventListener("change", () => {
	if(justifyMethodWhole.checked) background.setJustifyMethod(0);
});
justifyMethodExpand.addEventListener("change", () => {
	if(justifyMethodExpand.checked) background.setJustifyMethod(1);
});

backgroundOpacity.addEventListener("change", () => background.setOpacity(backgroundOpacity.value));

blurBorder.addEventListener("change", () => background.setBlur(blurBorder.value));

chrome.storage.local.get(["images", "style", "apply_sites"], (result) => {
	result.images.forEach((image) => addImage(image));
	switch(result.style.justify_method) {
		case 0:
			justifyMethodWhole.checked = true;
			break;
		case 1:
			justifyMethodExpand.checked = true;
			break;
	}
	backgroundOpacity.value = result.style.opacity;
	blurBorder.value = result.style.border_blur;
	document.getElementById("apply_site_list").value = result.apply_sites.join("\n");
});
drawPreviewElementSample();