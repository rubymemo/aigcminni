// export const host = 'http://101.126.93.249/api';
export const host = 'https://huatu.solart.pro/api';
// const host = 'https://huatu.solart.pro/api/hh';


export const httpsRequestResult = (httpRes : { statusCode : number; data : any }, noshowerr ?: boolean) : any | null => {
	if (httpRes.statusCode === 200) {
		const data = httpRes.data;
		if (Number(data.code) !== 2000) {
			if (!noshowerr) {
				uni.showToast({
					icon: 'none',
					title: data.msg
				})
			}
			return null;
		} else {
			// 成功
			return data.data || {};
		}
	} else {
		uni.showToast({
			icon: 'none',
			title: '系统错误，请联系管理员'
		})
	}
	return null
}

export const httpsRequest = async (url : string, params : Record<string, any>, method ?: 'POST' | 'GET' | 'DELETE' | 'PUT', noheader ?: boolean, noshowerr ?: boolean) => {
	const token = uni.getStorageSync('token');
	const header = noheader ? undefined : {
		Authorization: token
	}
	const res = await uni.request({
		url: host + url,
		method: method || 'POST',
		data: params,
		header: header
	});
	const data = httpsRequestResult(res, noshowerr);
	return data;
}

export const genImgURl = (type : string, filename : string) => {
	return `${host}/hh/comfyui_api/view?type=${type}&filename=${filename}`;
}

export function getDay(day) {
	//Date()返回当日的日期和时间。
	const days = new Date();
	//getTime()返回 1970 年 1 月 1 日至今的毫秒数。
	const gettimes = days.getTime() + 1000 * 60 * 60 * 24 * day;
	//setTime()以毫秒设置 Date 对象。
	days.setTime(gettimes);
	const year = days.getFullYear();
	let month: string | number = days.getMonth() + 1;
	if (month < 10) {
		month = "0" + month;
	}
	let today : string | number = days.getDate();
	if (today < 10) {
		today = "0" + today;
	}
	return year + "-" + month + "-" + today;

}

export function uploadImg(params: {
	success: (urlPrams: string) => void
}) {
	const token = uni.getStorageSync('token');
	const header = {
		Authorization: token
	}
	uni.chooseMedia({
		count: 1,
		mediaType: ['image'],
		sourceType: ['album', 'camera'],
		camera: 'back',
		success: (chooseImageRes) => {
			const tempFilePaths = chooseImageRes.tempFiles;
			uni.uploadFile({
				header,
				url: `${host}/hh/comfyui_api_v2/uploadImage`,
				filePath: tempFilePaths[0].tempFilePath,
				name: 'image',
				success: (uploadFileRes) => {
					const uploadData = JSON.parse(uploadFileRes.data);
					if (Number(uploadData.code) === 2000) {
						params.success(uploadData.data);
					} else {
						uni.showToast({
							icon: 'none', title: '上传失败，请联系客户或稍后重试'
						})
					}
				},
				fail: () => {
					uni.showToast({
						icon: 'none', title: '上传失败，请联系客户或稍后重试'
					})
				}
			});
		}
	});
}