<template>
	<view>
		<view class="reward-list-view" >
			<view class="reward-header">
				<view>月份</view>
				<view>金额</view>
				<view>状态</view>
			</view>
			<view v-if="!recordList || recordList.length<=0">
				<emptyComponent message="你还没有领取奖金呢"/>
			</view>
			<view class="single-list-reward" @tap="showDetail(record)" v-for="(record, index) in recordList" v-if="recordList && recordList.length>0" :key="index">
				<view>
					<view><text class="small-remark">属：</text>{{record.rewardProduceMonth}}</view>
					<view><text class="small-remark">领：</text>{{record.createMonth}}</view>
				</view>
				<view class="right-align">
					<view>
					<text>{{rebuildMoney(record.money)}}</text>
					<text class="small-remark">元</text>
					</view>
					<view><text class="small-remark">第</text>{{record.times}}<text class="small-remark">次</text></view>
				</view>
				<view style="text-align: center;">
					<text v-if="record.status=='1'" class="zsl-color-dark">已转款</text>
					<text v-if="record.status=='0'" class="zsl-color-red">待审核</text>
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
		recordList: {
			type: Array,
			default: function() {return [];}
		}
	},
	data() {
		return {
		}
	},
	created: function(){
		that = this;
	},
	methods: {
		showDetail: function(record) {
			// console.log(reward);
			const status = record.status;
			let content = '归属月份['+record.rewardProduceMonth+']，于['+record.createDay+']第['+record.times+']次申领['+that.rebuildMoney(record.money)+']元，';
			if(status=='0') {content += '待审核';}
			else if(status=='1') {content += '于['+record.payDay+']转款。';}
			uni.showModal({
				title: "提示",
				content: content,
			})
			//that.$emit("receiptMoney", reward);
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