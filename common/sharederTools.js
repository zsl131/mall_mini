import request from "./request.js";
import config from "./config.js";

/**
 * 检查有无分享者
 * @param {Object} options 获取分享内容的参数
 */
function checkShare(options) {
	try {
		if(options) { //如果有参数
			const sharederId = options.sharederId;
			if(sharederId) { //如果有分享者ID
				request.get("customerService.loadOne",{id:sharederId}).then((res)=> {
					if(res.obj) { //获取到分享者就将其存入Session中
						let obj = res.obj;
						obj.timeout = 3600*2; //2小时
						const date = new Date();
						obj.startTime = parseInt(date.getTime()/1000);
						uni.setStorageSync(config.SHAREDER, obj);
						console.log(res)
					}
				});
			}
		}
	} catch(e) {}
}

/**
 * 获取分享者用户
 *  - 如果没有则返回null
 */
function loadShare() {
	let obj = uni.getStorageSync(config.SHAREDER);
	if(obj && obj.timeout) {
		const timeout = obj.timeout;
		const startTime = obj.startTime; //开始时间
		const date = new Date();
		const curTime = parseInt(date.getTime()/1000); //当前时间，秒
		if(curTime-startTime<timeout) { //在有效期内
			obj.startTime = curTime; obj.timeout = 3600*1;
			uni.setStorageSync(config.SHAREDER, obj);
			return obj;
		} else {return null;}
	} else {return null;}
}

export default {
	checkShare: checkShare,
	loadShare: loadShare,
}