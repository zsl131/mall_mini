<template>
	<view style="padding: 0px 20rpx;">
		<!-- <graceImmersedStatusbar bgColor="#34CD6D"></graceImmersedStatusbar> -->
		<view class="grace-list" style="padding-top: 30rpx;">
			<!-- <view class="grace-h4 grace-margin-top" style="padding:20rpx 0;">个人中心</view> -->
			<view class="grace-list-items" >
					<view class="grace-list-image ucenter-face grace-relative">
						<button plain="true" style="width:100rpx; padding:0px;height:100rpx; border:none;"
						open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo"> 
						<image class="grace-list-image ucenter-face-image" :src="custom.headImgUrl" mode="widthFix"></image>
						</button>
					</view>
					<view class="grace-list-body" @tap="onBindPhone">
						<view class="grace-list-title"><text class="grace-list-title-text">{{custom.nickname}}</text></view>
						<view class="grace-list-body-desc">Tel: {{phone?phone:"未绑定"}}</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
			</view>
		</view>

		
		<view class="ucenter-line"></view>
		<view>
			<boxBannerComponent :items="countList" @onClick="onClick"></boxBannerComponent>
		</view> 
		
		<view class="ucenter-line"></view>
		<view class="grace-list grace-margin-top">
			<view class="grace-list-items" @tap="gotoFun('orders')">
				<text class="grace-list-icon grace-icons icon-shoppingcard grace-green"></text>
				<view class="grace-list-body grace-border-b">
					<view class="grace-list-title">
						<text class="grace-list-title-text">我的订单</text>
					</view>
				</view>
				<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
			</view>
			<view class="grace-list-items" @tap="gotoFun('agent')">
				<text class="grace-list-icon zsl-icons icon-dailishang2 grace-blue-sky"></text>
				<view class="grace-list-body grace-border-b">
					<view class="grace-list-title">
						<text class="grace-list-title-text">代理中心</text>
					</view>
				</view>
				<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
			</view>
			<view class="grace-list-items" @tap="gotoFun('coupon')">
				<text class="grace-list-icon zsl-icons icon-coupon grace-red"></text>
				<view class="grace-list-body grace-border-b">
					<view class="grace-list-title">
						<text class="grace-list-title-text">我的抵价券</text>
					</view>
				</view>
				<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
			</view>
			<view class="grace-list-items" @tap="gotoFun('address')">
				<text class="grace-list-icon grace-icons icon-address grace-blue"></text>
				<view class="grace-list-body grace-border-b">
					<view class="grace-list-title">
						<text class="grace-list-title-text">收货地址</text>
					</view>
				</view>
				<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
			</view>
			
			<view class="grace-list-items" @tap="gotoFun('favorite')">
				<text class="grace-list-icon grace-icons icon-shoucang grace-blue-sky"></text>
				<view class="grace-list-body">
					<view class="grace-list-title">
						<text class="grace-list-title-text">我的收藏</text>
					</view>
				</view>
				<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
			</view>
		</view>
		<view class="ucenter-line"></view>
		<view class="grace-list grace-margin-top">
			<!-- <view class="grace-list-items grace-border-b" @tap="gotoFun('kf2')">
				<text class="grace-list-icon grace-icons icon-kf1 grace-blue"></text>
				<view class="grace-list-body">
					<view class="grace-list-title">
						<text class="grace-list-title-text">联系客服</text>
					</view>
				</view>
				<view><button open-type="contact" size="mini" 
				style="border:none;padding:0px;font-size:28rpx;padding-left:30px;"
				type="default" plain="true" bindcontact="handleContact">点击在线客服</button></view>
				<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
			</view> -->
			
			<view class="grace-list-items grace-border-b" @tap="gotoFun('kf2')">
				<text class="grace-list-icon grace-icons icon-kf1 grace-blue"></text>
				<view class="grace-list-body">
					<view class="grace-list-title">
						<text class="grace-list-title-text">联系客服</text>
					</view>
				</view>
				<view><extendComponent content="点击在线客服"/></view>
				<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
			</view>
			
			<view class="grace-list-items" @tap="gotoFun('kf')">
				<text class="grace-list-icon grace-icons icon-kf3 grace-red"></text>
				<view class="grace-list-body">
					<view class="grace-list-title">
						<text class="grace-list-title-text">客服电话</text>
					</view>
				</view>
				<view>{{servicePhone}}</view>
				<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
			</view>
			
		</view>
		<view class="ucenter-line"></view>
		<!-- <graceDialog :show="showDialog" title="手机绑定">
			<view slot="content">
				<bindPhoneComponent @closeShow="closeShow" @bindPhone="bindPhone"></bindPhoneComponent>
			</view>
		</graceDialog>
		<graceBottomDialog :show="showBottomDialog" v-on:closeDialog="closeBottomShow">
			<view class="grace-space-between" slot="btns">
				<button class="grace-dialog-buttons" style="color:#00B26A;" @tap="bindPhoneShow">绑定手机</button>
				<button class="grace-dialog-buttons" style="color:#00B26A;" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">获取微信手机</button>
			</view>
		</graceBottomDialog> -->
		
		<bindPhoneComponent ref="bindPhone" @bindPhoneSuc="bindPhoneSuc"></bindPhoneComponent>
	</view>
</template>
<script>
var that;
import gracePage from "@/graceUI/components/gracePage.vue";
import graceDialog from '@/graceUI/components/graceDialog.vue';
import graceBottomDialog from '@/graceUI/components/graceBottomDialog.vue';
import bindPhoneComponent from '@/components/bindPhoneComponent.vue';
import boxBannerComponent from '@/components/boxBannerComponent.vue';
import extendComponent from "./extendComponent.vue";
import config from "@/common/config.js";
export default{
	data() {
		return {
			custom: {},
			phone: '',
			
			countList: [], //订单数量统计
			
			servicePhone: '4008080987', //客服电话
		}
	},
	onLoad() {
		const custom = uni.getStorageSync(config.CUR_CUSTOM);
		//console.log(custom)
		this.custom = custom;
		this.phone = custom.phone;
		that = this;
		that.loadData();
	},
	methods: {
		loadData: function() {
			that.$request.get("miniCustomerService.me", {}).then((res)=> {
				//console.log(res);
				that.custom = res.customer;
				that.countList = res.countList;
				that.phone = that.custom.phone;
				uni.setStorageSync(config.CUR_CUSTOM, res.customer);
			})
		},
		gotoFun: function(fun) {
			if(fun==='address') {uni.navigateTo({ url: "./address" })}
			else if(fun==='agent') {uni.navigateTo({ url: "../agent/center" })}
			else if(fun==='favorite') {uni.navigateTo({ url: "./favorite" })}
			else if(fun==='coupon') {uni.navigateTo({ url: "./coupon" })}
			else if(fun==='kf') {uni.makePhoneCall({ phoneNumber: this.servicePhone })}
			else if(fun=='orders') {uni.navigateTo({ url: "../orders/listOrders" })}
		},
		onClick: function(obj) {
			//console.log(obj)
			uni.navigateTo({
				url:"../orders/listOrders?type="+(parseInt(obj.type)+1)
			})
		},
		bindPhoneSuc: function(phone) {
			//console.log(phone)
			const custom = uni.getStorageSync(config.CUR_CUSTOM);
			custom.phone = phone;
			that.phone = phone;
			uni.setStorageSync(config.CUR_CUSTOM, custom);
		},
		onBindPhone: function() {
			// that.showDialog = true; 
			const custom = uni.getStorageSync(config.CUR_CUSTOM);
			if(custom.phone) {
				uni.showToast({
					title: "您已绑定手机："+custom.phone, icon:'none'
				})
			} else {
				//that.showBottomDialog = true;
				that.$refs.bindPhone.openDialog();
			}
		},
		
		wxGetUserInfo: function() {
			//console.log("---------")
			const that = this;
			uni.login({
			  provider: 'weixin',
			  success: function (loginRes) {
				uni.getUserInfo({
				  provider: 'weixin',
				  success: function (infoRes) {
					that.$request.get("miniAuthService.reloadUser", {code: loginRes.code, encryptedData:infoRes.encryptedData, 
					iv: infoRes.iv}).then((res) => {
						//console.log(res)
						uni.setStorageSync(config.CUR_CUSTOM, res.customer);
						uni.showToast({
							icon:"success",
							title: res.message,
						})
					})
				  }
				});
			  }
			});
		},
	},
	components:{
		boxBannerComponent,gracePage,graceDialog,bindPhoneComponent,graceBottomDialog,
		extendComponent,
	}
}
</script>
<style>
.ucenter-face{width:100rpx !important; height:100rpx !important;}
.ucenter-face-image{width:100rpx !important; height:100rpx !important;}
.ucenter-line{height:12rpx; background-color:#F4F5F6; margin:16rpx 0;}

.grace-dialog-buttons {height:45px; line-height:45px; background:none;border:none;border:0px;}
</style>