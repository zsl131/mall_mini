<template>
	<view>
		<view v-if="!agent || agent.status!='1'">
			<registerComponent/>
		</view>
		<view style="" v-if="agent && agent.status=='1'">
			<view class="header-party">
				<!-- <view class="grace-h4 grace-margin-top" style="padding:20rpx 0;">个人中心</view> -->
				<view class="grace-list-items" >
						<view class="grace-list-image ucenter-face grace-relative">
							<image class="grace-list-image ucenter-face-image" :src="custom.headImgUrl" mode="widthFix"></image>
						</view>
						<view class="grace-list-body">
							<view class="grace-list-title"><text class="agent-name">{{agent.name?agent.name:agent.nickname}}</text></view>
							<!-- <view class="grace-list-body-desc agent-level">级别: V. {{agent.levelId?agent.levelName:"未分配级别"}}</view> -->
							<view class="grace-list-body-desc agent-level" v-if="!isGoldAgent()">
								{{agent.leaderName?('推荐人：'+agent.leaderName):("加入时间："+agent.createDay)}}
							</view>
							<view class="grace-list-body-desc agent-level" v-if="isGoldAgent()">我的专属邀请码：
								<text v-if="agent.ownCode" class="real-code">{{agent.ownCode}}</text>
								<text v-if="!agent.ownCode" class="no-code" @tap="buildCode">点击生成</text>
								<text v-if="agent.ownCode" class="copy-view" @tap="copyCode">复制</text>
							</view>
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
				<view class="grace-list-items grace-border-b" @tap="gotoFun('cash')">
					<text class="grace-list-icon zsl-icons icon-tixian1 grace-red"></text>
					<view class="grace-list-body ">
						<view class="grace-list-title">
							<text class="grace-list-title-text">发起提现</text>
						</view>
					</view>
					<view>{{cashMoney}} 元</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
				
				<view class="grace-list-items grace-border-b"  @tap="gotoFun('rewark')">
					<text class="grace-list-icon zsl-icons icon-fujinyinhang grace-yellow"></text>
					<view class="grace-list-body">
						<view class="grace-list-title">
							<text class="grace-list-title-text">佣金奖励金</text>
						</view>
					</view>
					<view>有惊喜哦</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
				
				<view class="grace-list-items" @tap="gotoFun('ranking')">
					<text class="grace-list-icon zsl-icons icon-paiming4 grace-blue"></text>
					<view class="grace-list-body">
						<view class="grace-list-title">
							<text class="grace-list-title-text">排行榜</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
			</view>
			<view class="ucenter-line"></view>
			
			<view class="grace-list grace-margin-top">
				<view class="grace-list-items" @tap="gotoFun('topic')">
					<text class="grace-list-icon zsl-icons icon-xuzhi grace-blue-sky"></text>
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">代理须知</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
				<view class="grace-list-items" @tap="gotoFun('rule')">
					<text class="grace-list-icon zsl-icons icon-tichengguize grace-red"></text>
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">佣金标准</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
				<view class="grace-list-items" @tap="gotoFun('detail')">
					<text class="grace-list-icon zsl-icons icon-mingxichaxun grace-blue"></text>
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">佣金明细</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
				
				<view v-if="isGoldAgent()" class="grace-list-items" @tap="gotoFun('sub')">
					<text class="grace-list-icon zsl-icons icon-xiaji grace-yellow"></text>
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">我邀请的代理</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
				
				<view class="grace-list-items" @tap="gotoFun('customer')">
					<text class="grace-list-icon zsl-icons icon-kehu grace-red"></text>
					<view class="grace-list-body">
						<view class="grace-list-title">
							<text class="grace-list-title-text">我的客户</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
			</view>
			<view class="ucenter-line"></view>
			<view class="grace-list grace-margin-top">
				
				<view class="grace-list-items grace-border-b" @tap="gotoFun('matter')">
					<text class="grace-list-icon zsl-icons icon-zuzhijiagou grace-red"></text>
					<view class="grace-list-body">
						<view class="grace-list-title">
							<text class="grace-list-title-text">申请物料</text>
						</view>
					</view>
					<view>申请实体店海报</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
				
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
			
			<bindPhoneComponent ref="bindPhone"></bindPhoneComponent>
		</view>
	</view>
</template>
<script>
var that;
import gracePage from "@/graceUI/components/gracePage.vue";
import commissionComponent from '@/components/commissionComponent.vue';
import registerComponent from "./registerComponent.vue";
import config from "@/common/config.js";
import extendComponent from '../my/extendComponent.vue';
import bindPhoneComponent from '@/components/bindPhoneComponent.vue';
import sharederTools from "@/common/sharederTools.js";
export default{
	data() {
		return {
			agent: {},
			custom: {},
			
			commissionList: [], //提成数量统计
			
			servicePhone: '4008080987', //客服电话
			cashMoney:0,
			
			showBottomDialog:false,
		}
	},
	onLoad() {
		const custom = uni.getStorageSync(config.CUR_CUSTOM);
		//console.log(custom)
		this.custom = custom;
		that = this;
		that.loadData();
	},
	methods: {
		isGoldAgent:function() { //是否是金牌代理
			const agent = this.agent;
			if(agent.levelId==3) {return true;} //如果代理等级ID为3，则为金牌代理，暂时写死
			else {return false;}
		},
		copyCode: function() {
			//console.log("----------")
			const code = that.agent.ownCode;
			uni.setClipboardData({
				data: code,
				success() {
					uni.showToast({
						title: '复制成功，可以直接粘贴发送给好友啦', icon:"none"
					})
				}
			})
		},
		buildCode: function() { //重新生成自己的邀请码
			that.$request.get("miniAgentService.buildCode", {}).then((res)=> {
				//console.log(res)
				that.agent.ownCode = res.code;
			});
		},
		loadData: function() {
			const shareder = sharederTools.loadShare();
			that.$request.get("miniCustomCommissionRecordService.listOwn", {shareId: shareder?shareder.id:0}).then((res)=> {
				//console.log(res);
				that.commissionList = res.commissionList;
				that.agent = res.agent;
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
			else if(fun==='topic') {uni.navigateTo({ url: "/pages/topic/show?type=sn&sn=AGENT-NOTICE" })}
			else if(fun==='kf') {uni.makePhoneCall({ phoneNumber: this.servicePhone })}
			else if(fun=='orders') {uni.navigateTo({ url: "../orders/listOrders" })}
			else if(fun=='rewark') {uni.navigateTo({ url: "/pages/reward/index" })}//rewark
			else if(fun=='ranking') {uni.navigateTo({ url: "/pages/reward/ranking" })} //排行榜
			else if(fun=='matter') {uni.navigateTo({ url: "/pages/agent/matter" })} //物料申请
			else if(fun=='sub') {uni.navigateTo({ url: "/pages/agent/sub" })} //下级代理
			else if(fun=='customer') {uni.navigateTo({ url: "/pages/agent/customer" })} //我的客户
		},
		onCash: function() {
			const custom = uni.getStorageSync(config.CUR_CUSTOM);
			if(!custom.phone) { //如果没有绑定手机
				uni.showToast({
					title: "请先绑定手机号码",icon:'none',
					success() {
						// that.showBottomDialog = true;
						that.$refs.bindPhone.openDialog();
					}
				})
			} else {
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
								url:"/pages/agent/center"
							})
						}
					}
				});
				
			});
		},
		onClick: function(obj) {
			//console.log(obj)
			uni.navigateTo({
				url:"/pages/commission/record?status="+(parseInt(obj.status)+1)
			})
		},
		
		/* closeDialog: function(value) {
			//console.log("-----"+value)
			that.showBottomDialog = false;
		} */
	},
	components:{
		commissionComponent,gracePage,bindPhoneComponent,registerComponent,extendComponent
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

.no-code {
	color:#d4d4d4;
}
.copy-view {
	background:#848484; color:#c6c6c6; padding: 2px 5px; border-radius: 4px;
}
</style>