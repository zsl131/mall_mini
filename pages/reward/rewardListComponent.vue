<template>
	<view>
		<view class="reward-list-view" >
			<view class="reward-header">
				<view>月份</view>
				<view>已领</view>
				<view>剩余</view>
				<view>状态</view>
			</view>
			<view v-if="!rewardList || rewardList.length<=0">
				<emptyComponent message="数据未统计或不存在"/>
			</view>
			<view class="single-list-reward" v-for="(reward, index) in rewardList" v-if="rewardList && rewardList.length>0" :key="index">
				<view>
					<view>{{reward.produceMonth}}</view>
					<view><text class="small-remark">获奖</text><text class="zsl-color-red">{{rebuildMoney(reward.extraMoney)}}</text></view>
				</view>
				<view class="right-align">
					<view>
					<text>{{rebuildMoney(reward.receiptMoney)}}</text>
					<text class="small-remark">元</text>
					</view>
					<view>{{reward.receiptTimes}}<text class="small-remark">次</text></view>
				</view>
				<view class="right-align">
					<view>{{rebuildMoney(reward.surplusMoney)}}<text class="small-remark">元</text></view>
					<view>{{reward.surplusTimes}}<text class="small-remark">次</text></view>
				</view>
				<view style="text-align: center;">
					<text v-if="reward.status=='1'">已完成</text>
					<text v-if="reward.status=='0' && btnShow" @tap="receiptMoney(reward)" class="receipt-btn">领取</text>
					<!-- <text :class="[reward.status=='0'?'zsl-color-red':'zsl-color-blue']">{{rebuildStatus(reward.status)}}</text> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
let that;
import emptyComponent from '@/components/emptyComponent.vue';
export default {
	props: {
		rewardList: {
			type: Array,
			default: function() {return [];}
		}
	},
	data() {
		return {
			btnShow: true,
		}
	},
	created: function(){
		that = this;
	},
	methods: {
		receiptMoney: function(reward) {
			//console.log(reward);
			//that.$emit("receiptMoney", reward);
			that.btnShow = false;
			uni.showModal({
				title: '提示',
				content:'确定发起领取奖金吗？',
				success(res) {
					if(res.confirm) {
						that.$request.get("miniRewardService.applyReceipt", {month: reward.produceMonth}).then((result)=> {
							/* if(result.flag=='0') {
								uni.showToast({title: result.message, icon: 'none'})
							} else if(result.flag=='1') {
								uni.showModal({title: '提示', content: result.message});
							} */
							uni.showModal({title: '提示', content: result.message});
							that.btnShow = true;
						})
					} else {that.btnShow = true;}
				}
			})
		},
		rebuildMoney: function(val) {
			// return val.toFixed(2);
			return Math.floor(val*100) / 100;
		},
	},
	components: {
		emptyComponent
	}
}
</script>
<style scoped>
.reward-list-view {
	width: calc(100% - 20px); padding: 10px;
	background: #fafafa;
}

.reward-header {
	width:100%; height: 20px; line-height: 20px; display: flex;
}
.reward-header view {
	flex: 1; text-align: center; width:100%; border-right: 1px #e5e5e5 solid; color:#888;
}
.reward-header view:last-child {
	border-right: none;
}
.single-list-reward {
	display: flex; line-height: 20px; padding-top: 12px;
	border-bottom: 1px #ddd dotted;
}
.single-list-reward:last-child {
	border-bottom: none;
}
.single-list-reward view {
	flex: 1; width:100%; text-align:center;
}

.small-remark {
	font-size: 8px; color:#999;
}
.right-align view {text-align: right;}

.single-list-reward .receipt-btn {
	text-align:center; background:#ff6b4d; color:#FFFFFF;
	border-radius:5px; padding: 5px 8px;
}
</style>