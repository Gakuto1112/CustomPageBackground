export class BackgroundImageInjector {
	constructor(elementToInject, imageSrc, justifyMethod, imageAlign, opacity, blur) {
		this.elementToInject = elementToInject;
		this.justifyMethod = justifyMethod;
		this.blur = blur;
		this.backgroundArea = document.createElement("div");
		this.backgroundArea.classList.add("background_image_injector_background_area");
		this.background = document.createElement("img");
		this.background.src = imageSrc;
		this.background.classList.add("background_image_injector_background");
		switch(this.justifyMethod) {
			case 0:
				this.background.style.top = "50%";
				this.background.style.left = "50%";
				this.background.style.transform = "translate(-50%, -50%)";
				break;
			case 1:
				this.background.style.top = Math.floor(imageAlign / 3) * 50 + "%";
				this.background.style.left = imageAlign % 3 * 50 + "%";
				this.background.style.transform = "translate(" + -1 * imageAlign % 3 * 50 + "%, "  + -1 * Math.floor(imageAlign / 3) * 50 + "%)";
				break;
		}
		this.background.style.opacity = opacity;
		this.backgroundArea.appendChild(this.background);
		this.backgroundBorderBlur = document.createElement("div");
		this.backgroundBorderBlur.classList.add("background_image_injector_background_blur");
		this.backgroundArea.appendChild(this.backgroundBorderBlur);
		let colorFromBackground;
		if(this.elementToInject == "window") {
			this.backgroundArea.style.position = "fixed";
			window.addEventListener("resize", () => this.#resize(document.documentElement.clientWidth, document.documentElement.clientHeight));
			colorFromBackground = window.getComputedStyle(document.body).backgroundColor;
			if(colorFromBackground != "rgba(0, 0, 0, 0)") this.backgroundColor = colorFromBackground;
			else this.backgroundColor = "white";
			this.backgroundBorderBlur.style.boxShadow = "0px 0px " + this.blur + "px " + this.blur + "px " + this.backgroundColor + " inset";
			const backgroundColorObserver = new MutationObserver(() => {
				colorFromBackground = window.getComputedStyle(document.body).backgroundColor;
				if(colorFromBackground != "rgba(0, 0, 0, 0)") this.backgroundColor = colorFromBackground;
				else this.backgroundColor = "white";
			});
			backgroundColorObserver.observe(document.body, {
				attributes: true,
				attributeFilter: ["style"]
			});
			document.body.firstElementChild.before(this.backgroundArea);
			this.background.addEventListener("load", () => this.#resize(document.documentElement.clientWidth, document.documentElement.clientHeight), {
				once: true
			});
		}
		else {
			this.backgroundArea.style.position = "absolute";
			colorFromBackground = window.getComputedStyle(elementToInject).backgroundColor;
			if(colorFromBackground != "rgba(0, 0, 0, 0)") this.backgroundColor = colorFromBackground;
			else this.backgroundColor = "white";
			this.backgroundBorderBlur.style.boxShadow = "0px 0px " + this.blur + "px " + this.blur + "px " + this.backgroundColor + " inset";
			const observer = new MutationObserver(() => {
				this.#resize(this.elementToInject.clientWidth, this.elementToInject.clientHeight);
				colorFromBackground = window.getComputedStyle(elementToInject).backgroundColor;
				if(colorFromBackground != "rgba(0, 0, 0, 0)") this.backgroundColor = colorFromBackground;
				else this.backgroundColor = "white";
			});
			observer.observe(this.elementToInject, {
				attributes: true,
				attributeFilter: ["style"]
			});
			this.elementToInject.firstElementChild.before(this.backgroundArea);
			this.background.addEventListener("load", () => this.#resize(this.elementToInject.clientWidth, this.elementToInject.clientHeight), {
				once: true
			});
		}
	}

	setImage(imageSrc) {
		//画像を設定する。
		this.background.src = imageSrc;
		this.#resizeCall();
	}

	clearImage() {
		//画像を消去する。
		this.background.src = "";
	}

	setJustifyMethod(justifyMethod) {
		this.justifyMethod = justifyMethod;
		this.#resizeCall();
	}

	setImageAlign(imageAlign) {
		switch(this.justifyMethod) {
			case 0:
				this.background.style.top = "50%";
				this.background.style.left = "50%";
				this.background.style.transform = "translate(-50%, -50%)";
				break;
			case 1:
				this.background.style.top = Math.floor(imageAlign / 3) * 50 + "%";
				this.background.style.left = imageAlign % 3 * 50 + "%";
				this.background.style.transform = "translate(" + -1 * imageAlign % 3 * 50 + "%, "  + -1 * Math.floor(imageAlign / 3) * 50 + "%)";
				break;
		}
	}

	setOpacity(opacity) {
		this.background.style.opacity = opacity;
	}

	setBlur(blur) {
		this.blur = blur;
		this.backgroundBorderBlur.style.boxShadow = "0px 0px " + this.blur + "px " + this.blur + "px " + this.backgroundColor + " inset";
	}

	#resizeCall() {
		//resize(width, height)の呼び出し
		if(this.elementToInject == "window") this.#resize(document.documentElement.clientWidth, document.documentElement.clientHeight);
		else this.#resize(this.elementToInject.clientWidth, this.elementToInject.clientHeight);
	}

	#resize(width, height) {
		this.backgroundArea.style.width = width + "px";
		this.backgroundArea.style.height = height + "px";
		const imageRatio = this.background.naturalWidth / this.background.naturalHeight;
		const parentRatio = width / height;
		switch(this.justifyMethod) {
			case 0:
				if(imageRatio >= parentRatio) {
					this.background.style.width = width + "px";
					this.background.style.height = "";
					this.backgroundBorderBlur.style.width = width + "px";
					this.backgroundBorderBlur.style.height = width / imageRatio + "px";
				}
				else {
					this.background.style.height = height + "px";
					this.background.style.width = "";
					this.backgroundBorderBlur.style.height = height + "px";
					this.backgroundBorderBlur.style.width = height * imageRatio + "px";
				}
				break;
			case 1:
				if(imageRatio >= parentRatio) {
					this.background.style.height = height + "px";
					this.background.style.width = "";
					this.backgroundBorderBlur.style.height = height + "px";
					this.backgroundBorderBlur.style.width = "100%";
				}
				else {
					this.background.style.width = width + "px";
					this.background.style.height = "";
					this.backgroundBorderBlur.style.width = width + "px";
					this.backgroundBorderBlur.style.height = "100%";
				}
				break;
		}
	}
}