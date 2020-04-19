<template>
	<view style="padding: 0px 20rpx;">
		<!-- <graceImmersedStatusbar bgColor="#34CD6D"></graceImmersedStatusbar> -->
		<view class="grace-list" style="padding-top: 30rpx;" @tap="onBindPhone">
			<!-- <view class="grace-h4 grace-margin-top" style="padding:20rpx 0;">个人中心</view> -->
			<view class="grace-list-items" >
					<view class="grace-list-image ucenter-face grace-relative">
						<image class="grace-list-image ucenter-face-image" :src="custom.headImgUrl" mode="widthFix"></image>
					</view>
					<view class="grace-list-body">
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
						<text class="grace-list-title-text">我的优惠券</text>
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
			<view class="grace-list-items" @tap="gotoFun('kf')">
				<text class="grace-list-icon grace-icons icon-kf3 grace-red"></text>
				<view class="grace-list-body">
					<view class="grace-list-title">
						<text class="grace-list-title-text">联系客服</text>
					</view>
				</view>
				<view>{{servicePhone}}</view>
				<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
			</view>
			
			<!-- <view class="grace-list-items">
				<text class="grace-list-icon grace-icons icon-set grace-yellow"></text>
				<view class="grace-list-body grace-border-b">
					<view class="grace-list-title">
						<text class="grace-list-title-text">账户设置</text>
					</view>
				</view>
				<view>400</view>
				<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
			</view> -->
			
		</view>
		<view class="ucenter-line"></view>
		<graceDialog :show="showDialog" title="手机绑定">
			<view slot="content">
				<bindPhoneComponent @closeShow="closeShow" @bindPhone="bindPhone"></bindPhoneComponent>
			</view>
		</graceDialog>
		<graceBottomDialog :show="showBottomDialog" v-on:closeDialog="closeBottomShow">
			<view class="grace-space-between" slot="btns">
				<button class="grace-dialog-buttons" style="color:#00B26A;" @tap="bindPhoneShow">绑定手机</button>
				<button class="grace-dialog-buttons" style="color:#00B26A;" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">获取微信手机</button>
			</view>
		</graceBottomDialog>
	</view>
</template>
<script>
var that;
import gracePage from "@/graceUI/components/gracePage.vue";
import graceDialog from '@/graceUI/components/graceDialog.vue';
import graceBottomDialog from '@/graceUI/components/graceBottomDialog.vue';
import bindPhoneComponent from './bindPhoneComponent.vue';
import boxBannerComponent from '@/components/boxBannerComponent.vue';
import config from "@/common/config.js";
export default{
	data() {
		return {
			custom: {},
			phone: '',
			items: [
				[80, '', '动态'],
				[100, '', '好友'],
				[50, '', '私信'],
				['￥199', '', '余额']
			],
			showDialog: false,
			showBottomDialog:false,
			
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
			else if(fun==='agent') {uni.navigateTo({ url: "../agent/apply/apply" })}
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
		bindPhone: function(phone) {
			//console.log("--------"+phone)
			uni.showToast({
				title: "成功绑定："+phone, icon:'none'
			})
			const custom = uni.getStorageSync(config.CUR_CUSTOM);
			custom.phone = phone;
			that.phone = phone;
			uni.setStorageSync(config.CUR_CUSTOM, custom);
			that.showDialog = false;
		},
		onBindPhone: function() {
			/* that.showDialog = true; */
			const custom = uni.getStorageSync(config.CUR_CUSTOM);
			if(custom.phone) {
				uni.showToast({
					title: "您已绑定手机："+custom.phone, icon:'none'
				})
			} else {
				that.showBottomDialog = true;
			}
		},
		closeShow: function() {
			that.showDialog = false;
		},
		bindPhoneShow: function() {
			that.showDialog = true;
			that.showBottomDialog = false;
		},
		closeBottomShow: function() {
			that.showBottomDialog = false;
		},
		phoneBindResult: function(res) {
			if(res.phone) {
				that.bindPhone(res.phone);
				that.showBottomDialog = false;
			} else {
				uni.showToast({
					title: res.message, icon:'none'
				})
			}
		},
		onGetPhoneNumber: function(e) {
			if("getPhoneNumber:ok"!=e.detail.errMsg) {
				uni.showToast({
					title: "微信授权失败"
				})
			} else {
				uni.checkSession({
					success() {
						//console.log("=========");
						that.$request.get("miniAuthService.getPhone", {code: '', encryptedData:e.detail.encryptedData, iv: e.detail.iv}).then((res)=> {
							//console.log(res);
							that.phoneBindResult(res);
						})
					},
					fail() {
						uni.login({
						  provider: 'weixin',
						  success: function (loginRes) {
							  const code = loginRes.code;
							  // console.log(code);
							  that.$request.get("miniAuthService.getPhone", {code: code, encryptedData:e.detail.encryptedData, iv: e.detail.iv}).then((res)=> {
							  	//console.log(res);
								that.phoneBindResult(res);
							  })
						  },
						});
					}
				})
				
			}
		}, 
	},
	components:{
		boxBannerComponent,gracePage,graceDialog,bindPhoneComponent,graceBottomDialog
	}
}
</script>
<style>
.ucenter-face{width:100rpx !important; height:100rpx !important;}
.ucenter-face-image{width:100rpx !important; height:100rpx !important;}
.ucenter-line{height:12rpx; background-color:#F4F5F6; margin:16rpx 0;}

.grace-dialog-buttons {height:45px; line-height:45px; background:none;border:none;border:0px;}
</style>