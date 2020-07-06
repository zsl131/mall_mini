<template>
	<view>
		<showSharederComponent ref="sharedComponent"></showSharederComponent>
		<view class="login-header">
			
			<view class="grace-nowrap grace-flex-center">
				<view class="demo2">
					<view class="grace-icons icon-weixin"></view>
				</view>
				<view class="demo2">
					<view class="zsl-icons icon-arrow-right-wide"></view>
				</view>
				<view class="demo2">
					<image src="../../static/logo-72.png" mode="aspectFit"></image>
				</view>
			</view>
			
		</view>
		<view class="content">
			<view class="title">申请获取以下权限</view>
			<view class="remark">获得你的公开信息(昵称，头像、地区等)</view>
		</view>

		<button class='bottom' type='primary' open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">
			授权登录
		</button>
		<view class="cancel-view">
			<view class="cancel-btn" @tap="onCancel">取消授权</view>
		</view>
	</view>
</template>

<script>
import showSharederComponent from "@/components/showSharederComponent.vue";
import config from "@/common/config.js";
import common from "@/common/common.js";
import sharederTools from "@/common/sharederTools.js";
export default {
	data() {
		return {
			url: '/pages/index/index'
		}
	},
	onLoad(options) {
		/* uni.showModal({
			title:"提示",
			content:config.reqUrl
		}) */
		//const shareder = sharederTools.loadShare();
		//console.log(shareder)
		this.$refs.sharedComponent.loadShareder();
		if(options.url) {
			this.url = options.url;
		}
		const curCustom = uni.getStorageSync(config.CUR_CUSTOM);
		//console.log(curCustom);
		if(curCustom && curCustom.openid) { //如果存在openid，则中转到首页
			uni.redirectTo({ url: "../index/index" })
		}
		
		uni.getSetting({
			success(res) {
				//console.log(res)
				//console.log(res.authSetting["scope.userInfo"])
			}
		})
	},
	methods: {
		wxGetUserInfo: function() {
			const that = this;
			uni.login({
			  provider: 'weixin',
			  success: function (loginRes) {
				//console.log(loginRes);
				// 获取用户信息
				uni.getUserInfo({
				  provider: 'weixin',
				  success: function (infoRes) {
					//console.log('info：', infoRes);
					//let userInfo = infoRes.userInfo;
					//userInfo.code = loginRes.code;
					//console.log(infoRes);
					const shareder = sharederTools.loadShare();
					/* console.log(shareder);
					uni.showModal({
						title: "提示",
						content: JSON.stringify(shareder)
					}) */
					that.$request.get("miniAuthService.getUserInfo", {code: loginRes.code, encryptedData:infoRes.encryptedData, iv: infoRes.iv,
					leaderId: shareder?shareder.id:0, leaderNickname: shareder?shareder.nickname:'',
					leaderOpenid: shareder?shareder.openid:''}).then((res) => {
						//console.log(res)
						uni.setStorageSync(config.CUR_CUSTOM, res.custom);
						uni.showToast({
							icon:"success",
							title: "授权成功",
							success() {
								/* uni.switchTab({
									url:"../index/index"
								}) */
								common.gotoTargetPage(that.url);
							}
						})
					})
				  }
				});
			  }
			});
		},
		onCancel: function() {
			uni.switchTab({
				url:"../index/index"
			})
		},
	},
	components: {showSharederComponent}
}
</script>

<style>
page {
	padding: 0px 5%; width: 90%;
}

.demo2{width:200rpx;}

.login-header {
	height: 50%; border-bottom: 2px #ddd solid; text-align: center; display: block;
}
.login-header .icon-weixin {
	font-size:120rpx; margin: 80rpx 0px; color:#1f9609;
}
.login-header .zsl-icons {
	font-size:120rpx; margin: 80rpx 0px; color:#dddddd;
}
.login-header image {
	width:120rpx; height: 120rpx; margin: 80rpx 0px;
}
.content view.title {
	line-height: 50rpx; font-size: 40rpx; margin-top: 50px;
}
.content view.remark {
	color:#888888; padding: 20px 0px; font-size: 35rpx;
}
bottom.bottom {
	margin-top: 15px;
}
.cancel-view {
	width:100%; padding: 12px 0px; text-align: center;
}
.cancel-btn {
	font-size: 12px; color:#999;
}
</style>
