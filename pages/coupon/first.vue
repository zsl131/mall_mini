<template>
	<gracePage headerBG="#34CD6D" :customHeader="false">
	<view slot="gBody" class="grace-body" style="background:#34CD6D;min-height: 100vh;">
		<view class="coupon-title">领券消费更划算</view>
		<view class="first-coupon-list" v-if="couponList.length>0">
			<view class="waterfall-item" v-for="(item, index) in couponList" :key="index">
				<singleCouponComponent :coupon="item" @onClick="onClick"></singleCouponComponent>
			</view>
		</view>
		<view class="opt-main-view"><view class="opt-btn" @click="getCoupon()">一键领取<text>{{totalCoupon}}元</text>抵价券</view></view>
		<view class="opt-remark-view">
			点击上面按钮会生成“验证码”，根据提示将“验证码”发送到《满山晴》公众号即可领取抵价券。
		</view>
	</view>
	</gracePage>
</template>

<script>
var that;
import gracePage from "@/graceUI/components/gracePage.vue";
import singleCouponComponent from "./singleCouponComponent.vue";
export default {
	data() {
		return {
			couponList: [], //初关抵价券
			customCouponList: [], //客户已经领取的券
			totalCoupon:0, //
		}
	},
	onLoad() {
		that = this;
		that.loadData();
	},
	methods: {
		loadData: function() {
			that.$request.get("miniCouponService.first", {}).then((res)=> {
				// console.log(res)
				that.couponList = res.couponList;
				that.customCouponList = res.customCouponList;
				that.checkCoupon(that.couponList, that.customCouponList);
				that.buildTotal(that.couponList);
			});
		},
		checkCoupon: function(couponList, customCouponList) {
			//console.log("--------")
			if(customCouponList!=null && customCouponList.length>=couponList.length) {
				// 表示已经获取抵价券
				uni.showToast({
					title:"您已领券，跳转查看", icon:"none",
					success() {
						setTimeout(function() {
							uni.redirectTo({
								url: '/pages/my/coupon'
							})
						}, 2000);
					}
				})
				
			}
		},
		buildTotal: function(couponList) {
			let total = 0;
			couponList.map((item)=> {
				total += item.worth;
			})
			that.totalCoupon = total;
		},
		getCoupon: function() { //领取抵价券
			that.$request.get("miniPublicService.genBindCode", {}).then((res)=> {
				//console.log(res);
				const code = res.code;
				const con = '验证码【'+code+'】已复制，点击“确定”关注公众号直接粘贴即可领取抵价券[10分钟内有效]';
				uni.showModal({
					title: "提示",
					content: con,
					success: function(result) {
						if(result.confirm) {
							uni.setClipboardData({
								data: code
							});
							uni.navigateTo({
								//                                     https://mp.weixin.qq.com/s/eFhWaoqFBtiBUegLPonBtw
								url: '/pages/my/myWeb?src='+encodeURI("https://mp.weixin.qq.com/s/eFhWaoqFBtiBUegLPonBtw")
							})
						}
					}
				})
			})
		}
	},
	components: {
		gracePage, singleCouponComponent
	}
}
</script>

<style>
.first-coupon-list {
	padding: 10px 4px;
}
.coupon-title {
	width:100%; text-align: center; font-size: 48rpx; color:#FFFFFF; padding: 5px 0px 5px 0px; font-weight: bold;
}
.opt-main-view {
	width: 94%; padding: 10px 3%; 
}
.opt-btn {
	width: 100%; text-align: center; height: 40px; border-radius: 5px; line-height: 40px; background: #fd9704;
	color:#FFF; font-size: 30rpx;
}
.opt-remark-view {
	width:94%; padding: 10px 3%; color:#f8f8f8; text-indent: 2em; line-height: 22px;
}
.opt-btn text {
	font-weight: bold; padding: 0px 3px; font-size: 34rpx;
}
.waterfall-item {width:100%; padding: 5px 0px 5px 0px;}
</style>
