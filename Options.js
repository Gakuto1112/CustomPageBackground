function drawPreviewElementSample() {
	//プレビュー枠のサンプルを描画する。
	const canvas = document.getElementById("preview_elements_sample");
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	const context = canvas.getContext("2d");
	context.strokeStyle = "black";
	context.lineWidth = 1;
	context.fillStyle = "white";
	context.fillRect(20, 20, 200, 20);
	context.strokeRect(20, 21, 200, 18);
	context.fillStyle = "royalblue";
	context.fillRect(221, 20, 40, 20);
	for(let i = 0; i < (canvas.clientHeight - 60) / 70; i++) {
		context.fillStyle = "mediumblue";
		context.fillRect(20, i * 70 + 60, 150, 10);
		context.fillStyle = "dimgray";
		for(let j = 0; j < 3; j++) context.fillRect(20, i * 70 + j * 10 + 80, 120, 5);
	}
}

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
			reader.addEventListener("load", (event) => {
				const imageDivElement = document.createElement("div");
				imageDivElement.classList.add("image_div");
				imageDivElement.style.width = 
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
				imageElement.src = event.target.result;
				const xMark = document.createElement("p");
				imageDivElement.appendChild(imageElement);
				document.getElementById("image_selector").appendChild(imageDivElement);
			});
			reader.readAsDataURL(image);
		});
	});
	fileInputElement.click();
});

drawPreviewElementSample();