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
				const imageElement = document.createElement("img");
				imageElement.src = event.target.result;
				document.getElementById("image_selector").appendChild(imageElement);
			});
			reader.readAsDataURL(image);
		});
	});
	fileInputElement.click();
});