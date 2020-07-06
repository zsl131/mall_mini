<template>
	<view>
		<scroll-view style="height: 100vh" scroll-y="true" @scrolltolower="onPage">
			<!-- <view class="zsl-header-main zsl-bg-pink ">
				<view class="icons grace-icons icon-arrow-left grace-white" @tap="goback"></view>
				<view class="zsl-header-body zsl-color-white">
					佣金奖励金
				</view>
			</view> -->
			<view class="header-main">
				<view class="remark zsl-color-white" @tap="showTopic('REWARD-INFO')">
				佣金奖励金是指：为感谢各位代理的辛勤付出和大力推广，
				平台向满足条件的代理在原本佣金的基础上多发放的奖金。
				<view class="readmore-btn">查看详情</view>
				</view>
			</view>
			<view class="card-view">
				<view class="content">
					<view class="surplus-money">￥{{rebuildMoney(agentReward.totalSurplusMoney)}} 元</view>
					<view class="money-remark">还可领取奖金金额</view>
				</view>
				<!-- <view class="operate">
					<view>领取</view>
				</view> -->
			</view>
			
			<view class="reward-main">
				<view class="single-reward">
					<view class="reward-money">￥{{rebuildMoney(agentReward.totalExtraMoney)}} 元</view>
					<view class="reward-remark">所获奖金总额</view>
				</view>
				<view class="single-reward">
					<view class="reward-money">￥{{rebuildMoney(agentReward.totalReceiptMoney)}} 元</view>
					<view class="reward-remark">已领奖金总额</view>
				</view>
			</view>
			
			<view class="SegmentedControlIn">
				<segmentedControl :items="cates" :current="type" @change="onTypeChange"
					bgColor="#f0f0f0" color="#F37B1D"></segmentedControl>
			</view>
			
			<view v-if="type=='0'">
				<rewardListComponent :rewardList="rewardList" @receiptMoney="receiptMoney"></rewardListComponent>
			</view>
			<view v-if="type=='1'">
				<recordListComponent :recordList="recordList"/>
			</view>
		</scroll-view>
	</view>
</template>

<script>
var that;
import segmentedControl from '@/components/segmentedControl.vue';
import rewardListComponent from './rewardListComponent.vue';
import recordListComponent from './recordListComponent.vue';
export default {
	data() {
		return {
			cates : ["奖金记录", "领取记录"],
			type: 0,
			
			agentReward: {},
			rewardList: [],
			rule: {},
			
			page: 0,
			size: 15,
			canPage: true,
			
			recordList: [], //领取记录列表
			rPage: 0, //记录页面
			rSize: 15, //记录每页条数
			rCanPage: true, //记录是否可分页
		}
	},
	onLoad() {
		that = this;
		that.loadData(false);
	},
	methods: {
		loadData: function(append) {
			if(that.canPage) {
				that.$request.get("miniRewardService.query", {page: that.page, size: that.size, sort:'produceMonth_d'}).then((res)=> {
					//console.log(res);
					if(append) {
						that.rewardList = that.rewardList.concat(res.rewardList);
					} else {
						that.rewardList = res.rewardList;
					}
					
					if(res.rewardList.length<that.size) {that.canPage = false;}
					
					that.agentReward = res.agentReward;
					that.rule = res.rule;
					that.page = that.page + 1;
				})
			} else {
				uni.showToast({
					title: "没有更多了", icon:'none'
				})
			}
		},
		loadRecord: function(append) {
			if(that.rCanPage) {
				that.$request.get("miniRewardService.listRecord", {
					page: that.rPage, size: that.rSize
				}).then((res)=> {
					//console.log(res)
					if(append) {
						that.recordList = that.recordList.concat(res.recordList);
					} else {
						that.recordList = res.recordList;
					}
					
					if(res.recordList.length<that.rSize) {that.rCanPage = false;}
					
					that.rPage = that.rPage + 1;
				})
			} else {
				uni.showToast({ title: "没有更多了", icon:'none' })
			}
		},
		onTypeChange: function(e) {
			//console.log(e);
			that.type = e;
			// that.page = 0;
			// that.canPage = true;
			// that.append = false;
			//that.loadData();
			if(e==0) {
				that.loadData(false);
			} else if(e==1) {
				that.loadRecord(false);
			}
		},
		onPage: function() {
			const type = that.type;
			if(type==0) {
				that.loadData(true);
			} else {that.loadRecord(true);}
		},
		rebuildMoney: function(val) {
			// return val.toFixed(2);
			return Math.floor(val*100) / 100;
		},
		receiptMoney: function(reward) {
			console.log(reward)
		},
		rebuildStatus: function(status) {
			if(status=='0') {return '未完成'}
			else {return '已完成'}
		},
		showTopic: function(sn) {
			uni.navigateTo({
				url: '../topic/show?type=sn&sn='+sn
			})
		},
		goback: function() {
			uni.navigateBack({})
		}
	},
	components: {segmentedControl,rewardListComponent,recordListComponent}
}
</script>

<style>
.header-main {
	height: 100px; background: linear-gradient(#34cd6d, #0ef062);
}
.remark {
	font-size: 12px; line-height: 18px; text-indent: 2em; padding: 0px 20px; position: relative; font-size: 14px;
}
.readmore-btn {
	position: absolute; width: 70px; height: 24px; line-height: 24px; background:#59e78e; border-radius: 5px; text-align: center;
	text-indent: 0em; right: 20px; bottom: -10px;
}
.card-view {
	width: 84%; position: absolute; left: 8%; background:#FFF; height: 70px; top:65px;
	box-shadow: 0px 0px 5px 1px #aaa; border-radius: 10px; display: flex;
}
.card-view .content {
	flex: 1;
}
.card-view .operate {
	width:60px; padding-right: 8px;
}
.card-view .operate view {
	width: 60px; height: 28px; line-height: 28px; text-align:center; background:#ff6b4d; color:#FFFFFF;
	border-radius: 5px; margin-top: 20px;
}

.surplus-money {
	font-size:22px; font-weight: bold; color:#ff6b4d; width:100%; text-align: center; padding-top: 10px;
}
.money-remark {
	font-size: 10px; color:#888; width:100%; text-align: center; padding-top: 10px;
}

.reward-main {
	width:100%; display: flex; margin-top: 50px; border-bottom: 3px #f0f0f0 solid; padding-bottom: 8px;
}
.reward-main view.single-reward {
	flex: 1; height: 60px; 
}
.reward-main view.single-reward:first-child {
	border-right: 1px #ddd solid;
}
.single-reward view {
	width:100%; text-align: center; margin-top: 8px;
}
.reward-money {
	font-size: 20px; color:#5a99d5;
}
.reward-remark {
	color:#888; font-size: 10px;
}



.SegmentedControlIn {
	padding: 10px 10px;
}
.grace-icons {
	width:40px; height: 40px; text-align: center; line-height: 40px; font-size: 30px;
}
</style>
