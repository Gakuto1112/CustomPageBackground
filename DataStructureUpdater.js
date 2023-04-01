/**
 * データ形式の更新の必要性の有無を確認する。
 * @returns {Promise<number>} データ形式の更新が必要かどうか：0. < 1.2.0, 1. 1.2.0, 2. 1.2.1
 */
async function check() {
	const result = await chrome.storage.local.get(["image_count", "site_config"]);
	return result.image_count == undefined ? 0 : (result.site_config == undefined ? 1 : 2);
}

/**
 * v1.2.0以前の旧式のデータ形式を新しい形式に修正する。
 * @returns {Promise<undefined>}
 */
export async function update() {
	const dataType = await check();
	if(dataType <= 1) {
		const data = {
			site_config: {
				general: {
					hide_side_panel: false
				},
				google: {
					hide_seasonal_illust: false
				}
			}
		};
		if(dataType == 0) {
			const images = await chrome.storage.local.get("images");
			await chrome.storage.local.remove("images");
			data.image_count = 0;
			if(images.images.length > 0) images.images.forEach((image) => data[`image_${data.image_count++}`] = image);
		}
		await chrome.storage.local.set(data);
	}
}