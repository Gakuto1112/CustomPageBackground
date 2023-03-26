/**
 * データ形式の更新の必要性の有無を確認する。
 * @returns {Promise<boolean>} データ形式の更新が必要かどうか。
 */
function check() {
	return new Promise((resolve) => {
		chrome.storage.local.get("image_count", (imageCount) => resolve(imageCount.image_count == undefined));
	});
}

/**
 * v1.2.0以前の旧式のデータ形式を新しい形式に修正する。
 * @returns {Promise<>}
 */
export function update() {
	return new Promise((resolve) => {
		check().then((updateNeeded) => {
			if(updateNeeded) {
				chrome.storage.local.get("images", (images) => {
					chrome.storage.local.remove("images", () => {
						const imageData = {
							image_count: 0
						};
						if(images.images.length > 0) images.images.forEach((image) => imageData[`image_${imageData.image_count++}`] = image);
						chrome.storage.local.set(imageData, resolve);
					});
				});
			}
			else resolve();
		});
	});
}