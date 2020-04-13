import request from "./request.js";

function payByOrdersNo(ordersNo) {
	return new Promise((resolve, reject)=> {
		request.get("miniOrdersService.prepay", {ordersNo: ordersNo}).then((result)=> {
			if(result.flag=='1') { //
				const dto = result.dto;
				if(dto.flag!='1') { //生成统一订单出错
					const errMsg = dto.unifiedOrder.errCodeDes;
					uni.showModal({
						title: "支付通知",
						content: "结果信息："+errMsg
					})
					reject(errMsg);
				} else {
					uni.requestPayment({
						'nonceStr':dto.nonceStr,
						'timeStamp': dto.timeStamp,
						'package': dto.packageStr,
						'signType': dto.signType,
						'paySign': dto.paySign,
						'success':function(res){
							showInfo(res);
							paySuccess(ordersNo); //支付成功
							resolve(res);
						},
						'fail':function(res){
							showInfo(res);
							reject(res);
						},
						'complete':function(res){
						}
					})
				}
				
			} else {
				uni.showModal({
					title: "支付通知",
					content: "生成微信订单失败"
				})
				reject("生成微信订单失败");
			}
		})
	});
	
}

///支付成功调用
function paySuccess(ordersNo) {
	request.get("miniOrdersService.payRes", {ordersNo: ordersNo, flag: "1"}).then((res)=> {
		
	})
}

function showInfo(data) {
	const msg = data.errMsg;
	//console.log(msg)
	uni.showModal({
		title: '支付结果',
		content:((msg=='requestPayment:ok')?"支付成功":"支付失败")
	})
}


/**
 * 崔单
 * @param {Object} ordersNo 订单号
 */
function noticeOrders(ordersNo) {
	request.get("miniOrdersService.noticeOrders", {ordersNo: ordersNo}).then((res)=> {
		if(res) {
			uni.showToast({
				title: res.message
			})
		}
	})
}

/**
 * 确认收货
 * @param {Object} ordersNo 订单号
 */
function confirmOrders(ordersNo) {
	return new Promise((resolve, reject)=> {
		request.get("miniOrdersService.confirmOrders", {ordersNo: ordersNo}).then((res)=> {
			if(res) {
				uni.showToast({
					title: res.message
				})
				resolve(res.message);
			} else {reject(res.message)}
		})
	})
}

export default {
	payByOrdersNo: payByOrdersNo,
	noticeOrders: noticeOrders,
	confirmOrders: confirmOrders,
}