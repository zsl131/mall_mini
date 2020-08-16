<template>
	<scroll-view style="height: 100vh" scroll-y="true" @scrolltolower="onPage">
		<view class="SegmentedControlIn">
			<segmentedControl :items="cates" :current="type" @change="onTypeChange"
				bgColor="#f0f0f0" color="#F37B1D"></segmentedControl>
		</view>
		<view class="zsl-alter" v-if="status=='0'"><text>“未付款”：</text>即您推荐的顾客已经下单，但还没有付款。</view>
		<view class="zsl-alter" v-if="status=='1'"><text>“已付款”：</text>即您推荐的顾客已经下单，也已经付款，但还没有确认收货，所以还不产生佣金。</view>
		<view class="zsl-alter" v-if="status=='2'"><text>“可提现”：</text>即您推荐的顾客已经确认收货，可以发起提现。</view>
		<view class="zsl-alter" v-if="status=='3'"><text>“结算中”：</text>即您已经发起了提现，但系统正在审核，还未向您转账。</view>
		<view class="zsl-alter" v-if="status=='4'"><text>“已到账”：</text>即系统已审核通过您的提现申请，并已向您转账，具体是否到账请自行查账。</view>
		
		<view class="record-main-view" v-if="recordList.length>0">
			<view class="single-record" @click="onClick(item)" v-for="(item, index) in recordList" :key="index">
				<view class="record-info">
					<view class="custom-info">
						<text class="nickname">{{item.customNickname}}</text>
						<text class="create-time">{{item.createTime}}</text>
					</view>
					<view class="pro-title">{{item.proTitle}}【{{item.specsName}}】</view>
					<view class="saler-name">销售：{{item.salerName}}</view>
				</view>
				<view class="record-money">
					<view><text>可提</text>{{item.money}}<text>元</text></view>
					<view class="record-status">
						<text v-if="item.status=='-2'" class="status-cancel">已退款</text>
						<text v-if="item.status=='-1'" class="status-cancel">已取消</text>
						<text v-if="item.status=='0'" class="status-nopay">未付款</text>
						<text v-if="item.status=='1'" class="status-pay">已付款</text>
						<text v-if="item.status=='2'" class="status-cash">待提现</text>
						<text v-if="item.status=='3'" class="status-running">结算中</text>
						<text v-if="item.status=='4'" class="status-end">已转款</text>
						
						<text v-if="item.saleFlag=='1'" class="status-cash">-有售后</text>
						<text v-if="item.saleFlag=='2'" class="status-cash">-有售后，不可提</text>
					</view>
				</view>
			</view>
			<view class="more-rate">
				<text v-if="canPage">正在加载...</text>
				<text v-if="!canPage">这就是底线</text>
			</view>
		</view>
		<view v-if="recordList.length<=0">
			<emptyCompent message="没有匹配的数据哦"></emptyCompent>
		</view>
	</scroll-view>
</template>

<script>
var that;
import segmentedControl from '@/components/segmentedControl.vue';
import emptyCompent from "@/components/emptyComponent.vue"
export default {
	data() {
		return {
			type: '', 
			status: '', //状态
			cates : ["全部", "未付款", "已付款", "可提现", "结算中", "已到账"],
			page: 0, 
			size: 15,
			canPage: true,
			
			recordList:[],
		}
	},
	onLoad(options) {
		//console.log(options)
		that = this;
		that.type = options.status;
		that.genStatus();
		that.loadData();
		uni.showToast({
			title: "点击数据项可查看物流信息", icon:"none"
		})
	},
	methods: {
		genStatus: function() {
			const type = that.type;
			let status = '';
			if(type=='1') {status = '0';}
			else if(type=='2') {status = '1';}
			else if(type=='3') {status = '2';}
			else if(type=='4') {status = '3';}
			else if(type=='5') {status = '4';}
			that.status = status;//
			return status;
		},
		loadData: function(append) {
			if(that.canPage) {
				//console.log(that.status)
				that.$request.get("miniCustomCommissionRecordService.list",{
					status: that.status, page: that.page, size: that.size}).
					then((res)=> {
					//console.log(res)
					if(append) {
						that.recordList = that.recordList.concat(res.data);
					} else {
						that.recordList = res.data;
					}
					// console.log(res.size<that.size)
					if(res.data.length<that.size) {
						//that.init();
						that.canPage = false;
					} else {
						that.page = that.page + 1; 
					}
				});
			} else {
				uni.showToast({
					title: "没有更多数据啦", icon:"none"
				})
			}
		},
		init: function() {
			that.page = 0; that.canPage = true;
		},
		onTypeChange: function(e) {
			//console.log(e)
			that.type = e;
			that.genStatus();
			that.page = 0;
			that.canPage = true;
			that.append = false;
			that.loadData();
		},
		onPage: function() {
			// console.log("--------")
			that.loadData(true);
		},
		onClick: function(item) {
			//console.log(item)
			uni.navigateTo({
				url: "../orders/showExpress?id="+item.ordersId
				// url: "./detail?ordersId="+item.ordersId
			})
		},
	},
	components: {
		segmentedControl,emptyCompent
	}
}
</script>

<style>
.zsl-alter text {
	color:#555; font-weight: bold;
}
.record-main-view {
	padding: 10px;
}
.single-record {
	display: flex; border-bottom: 1px #e8e8e8 solid; padding: 8px 0px;
}
.record-info {
	flex: 1; color:#888; padding-right: 8px;
}
.custom-info {
}
.custom-info .nickname {
	color:#444; padding-right: 6px;
}
.custom-info .create-time {
	color:#aaa;
}

.saler-name {
	color:#666;
}

.record-money {
	width: 60px; font-size: 16px; color:#f96900; font-weight: bold;
}
.record-money text {
	color:#999; font-size: 10px; padding: 0px 3px; font-weight: normal;
}

.more-rate {
	width:100%; text-align: center; padding: 10px 0px;
}
.more-rate text {
	color:#aaa; 
}

.record-status {
	color:#999; padding-top: 4px; font-size:8px;
}
.record-status .status-cancel {
	color:#aaa;
}
.record-status .status-nopay {
	color:#F00;
}
.record-status .status-pay {
	color:#DE5A29;
}
.record-status .status-cash {
	color:#00B3FF;
}
.record-status .status-running {
	color:#1F9609;
}
.record-status .status-end {
	color:#007AFF;
}
</style>

<text v-if="item.status=='-1'" class="status-cancel">已取消</text>
<text v-if="item.status=='0'" class="status-nopay">未付款</text>
<text v-if="item.status=='1'" class="status-pay">已付款</text>
<text v-if="item.status=='2'" class="status-cash">可提现</text>
<text v-if="item.status=='3'" class="status-running">结算中</text>
<text v-if="item.status=='4'" class="status-end">已转款</text>