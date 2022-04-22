class BackgroundImageInjector {
	constructor(elementToInject, imageSrc, justifyMethod, opacity, blur) {
		this.elementToInject = elementToInject;
		this.justifyMethod = justifyMethod;
		this.blur = blur;
		this.backgroundArea = document.createElement("div");
		this.backgroundArea.classList.add("background_image_injector_background_area");
		this.background = document.createElement("img");
		this.background.src = imageSrc;
		this.background.classList.add("background_image_injector_background");
		this.background.style.opacity = opacity;
		this.backgroundArea.appendChild(this.background);
		if(this.elementToInject == "window") {
			this.backgroundArea.style.position = "fixed";
			window.addEventListener("resize", () => this.#resize(document.documentElement.clientWidth, document.documentElement.clientHeight));
			document.body.firstElementChild.before(this.backgroundArea);
		}
		else {
			this.backgroundArea.style.position = "absolute";
			const observer = new MutationObserver(() => this.#resize(this.elementToInject.clientWidth, this.elementToInject.clientHeight));
			observer.observe(this.elementToInject, {
				attributes: true,
				attributeFilter: ["style"]
			});
			this.elementToInject.firstElementChild.before(this.backgroundArea);
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

	setOpacity(opacity) {
		this.background.style.opacity = opacity;
	}

	setBlur(blur) {
		this.blur = blur;
		this.#resizeCall();
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
					this.background.style.height = height + "px";
					this.background.style.width = "";
				}
				else {
					this.background.style.width = width + "px";
					this.background.style.height = "";
				}
				break;
			case 1:
				if(imageRatio >= parentRatio) {
					this.background.style.width = width + "px";
					this.background.style.height = "";
				}
				else {
					this.background.style.height = height + "px";
					this.background.style.width = "";
				}
				break;
		}	
	}
}