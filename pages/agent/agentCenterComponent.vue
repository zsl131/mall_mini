<template>
	<view style="">
		<view class="header-party">
			<!-- <view class="grace-h4 grace-margin-top" style="padding:20rpx 0;">个人中心</view> -->
			<view class="grace-list-items" >
					<view class="grace-list-image ucenter-face grace-relative">
						<image class="grace-list-image ucenter-face-image" :src="custom.headImgUrl" mode="widthFix"></image>
					</view>
					<view class="grace-list-body">
						<view class="grace-list-title"><text class="agent-name">{{agent.name}}</text></view>
						<view class="grace-list-body-desc agent-level">级别: V. {{agent.levelId?agent.levelName:"未分配级别"}}</view>
					</view>
					<!-- <text class="grace-list-arrow-right grace-icons icon-arrow-right"></text> -->
			</view>
		</view>

		
		<view class="ucenter-line"></view>
		<view>
			<commissionComponent :items="commissionList" @onClick="onClick"></commissionComponent>
		</view> 
		
		<view class="ucenter-line"></view>
		<view class="grace-list grace-margin-top">
			<view class="grace-list-items" @tap="gotoFun('cash')">
				<text class="grace-list-icon zsl-icons icon-tixian1 grace-red"></text>
				<view class="grace-list-body">
					<view class="grace-list-title">
						<text class="grace-list-title-text">发起提现</text>
					</view>
				</view>
				<view>{{cashMoney}} 元</view>
				<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
			</view>
		</view>
		<view class="ucenter-line"></view>
		
		<view class="grace-list grace-margin-top">
			<view class="grace-list-items" @tap="gotoFun('rule')">
				<text class="grace-list-icon zsl-icons icon-tichengguize grace-red"></text>
				<view class="grace-list-body grace-border-b">
					<view class="grace-list-title">
						<text class="grace-list-title-text">提成标准</text>
					</view>
				</view>
				<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
			</view>
			<view class="grace-list-items" @tap="gotoFun('detail')">
				<text class="grace-list-icon zsl-icons icon-mingxichaxun grace-blue"></text>
				<view class="grace-list-body">
					<view class="grace-list-title">
						<text class="grace-list-title-text">提成明细</text>
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
		</view>
		<view class="ucenter-line"></view>
	</view>
</template>
<script>
var that;
import gracePage from "@/graceUI/components/gracePage.vue";
import graceDialog from '@/graceUI/components/graceDialog.vue';
import graceBottomDialog from '@/graceUI/components/graceBottomDialog.vue';
import commissionComponent from '@/components/commissionComponent.vue';
import config from "@/common/config.js";
export default{
	props: {
		agent: {
			type: Object,
			default: function() {return {};}
		}
	},
	data() {
		return {
			custom: {},
			
			commissionList: [], //提成数量统计
			
			servicePhone: '4008080987', //客服电话
			cashMoney:0,
		}
	},
	created() {
		const custom = uni.getStorageSync(config.CUR_CUSTOM);
		//console.log(custom)
		this.custom = custom;
		that = this;
		that.loadData();
	},
	methods: {
		loadData: function() {
			that.$request.get("miniCustomCommissionRecordService.listOwn", {}).then((res)=> {
				//console.log(res);
				that.commissionList = res.commissionList;
				that.buildCash();
			})
		},
		buildCash: function() {
			const data = that.commissionList;
			//console.log(data);
			data.map((item)=> {
				if(item.status=='2') { //可提现
					that.cashMoney = item.money;
				}
			});
		},
		gotoFun: function(fun) {
			//console.log(fun)
			if(fun==='rule') {uni.navigateTo({ url: "/pages/commission/rule" })}
			else if(fun==='detail') {uni.navigateTo({ url: "/pages/commission/record" })}
			else if(fun==='cash') {that.onCash(); }
			else if(fun==='coupon') {uni.navigateTo({ url: "./coupon" })}
			else if(fun==='kf') {uni.makePhoneCall({ phoneNumber: this.servicePhone })}
			else if(fun=='orders') {uni.navigateTo({ url: "../orders/listOrders" })}
		},
		onCash: function() {
			const money = that.cashMoney;
			if(money<=0) {
				uni.showToast({title: "没有可提现的资金", icon: 'none'})
			} else {
				uni.showModal({
					title: "系统提示",
					content: "确定发起提现【"+money+"】吗？此次提现结束前不可再次发起提现！",
					success(res) {
						if(res.confirm) {
							that.handleCash();
						}
					}
				})
			}
		},
		handleCash: function() {
			uni.showLoading({
				mask:true,title: "处理中..."
			})
			that.$request.get("miniCustomCommissionRecordService.onCashOut", {}).then((res)=> {
				uni.hideLoading();
				uni.showToast({
					title: res.message, icon: "none",
					success() {
						if(res.flag=='1') {
							uni.redirectTo({
								url:"/pages/agent/apply/apply"
							})
						}
					}
				});
				
			});
		},
		onClick: function(obj) {
			console.log(obj)
			uni.navigateTo({
				url:"/pages/commission/record?status="+(parseInt(obj.status)+1)
			})
		},
	},
	components:{
		commissionComponent,gracePage,graceDialog,graceBottomDialog
	}
}
</script>
<style>
	
.header-party {
	padding-top: 30rpx;background:#474342;width:calc(100vw - 20px); padding: 10px;
}

.ucenter-face{width:100rpx !important; height:100rpx !important;}
.ucenter-face-image{width:100rpx !important; height:100rpx !important;}
.ucenter-line{height:12rpx; background-color:#F4F5F6; margin:16rpx 0;}

.grace-dialog-buttons {height:45px; line-height:45px; background:none;border:none;border:0px;}

text.agent-name {
	color:#fdd783; font-size:14px;
}
.agent-level {
	color:#e17f00; font-size:12px; margin-top: 3px;
}
</style>