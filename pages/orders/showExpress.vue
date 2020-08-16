<template>
	<view class="main-view">
		<view class="normal-block address-view" v-if="orders && orders.id">
			<text>收货地址：</text>{{orders.addressCon}}
		</view>
		<view class="normal-block express-company express-select" v-if="expressList && expressList.length>0">
			<picker @change="bindPickerChange" :value="expressIndex" :range="expressArray">
				当前选择：<text class="current-express">{{express.expName}}【{{express.expNo}}】</text>
				<text class="change-express">点击可切换</text>
			</picker>
		</view>
		<view class="normal-block express-company" v-if="!detail.type && express">
			{{express.expName}}【{{express.expNo}}】
			<view><text>说明:</text>暂无任何物流信息</view>
		</view>
		<view class="normal-block express-company red" v-if="orders.status=='-10' || orders.status=='-1' || orders.status=='0'">
			此订单已关闭或未付款
		</view>
		<view class="normal-block express-company red" v-if="orders.status=='1'">
			此订单还没有发货，请耐心等待...
		</view>
		<view class="normal-block express-company" v-if="detail && detail.type">
			{{detail.expName}}【{{detail.number}}】
			<view><text>PHONE:</text>{{detail.expPhone}}（<text>SITE:</text>{{detail.expSite}}）</view>
		</view>
		<view class="normal-block detail-view" v-if="detail.detailList.length>0">
			<view v-for="(d, index) in detail.detailList" class="single-detail-view" :key="index">
				<view class="time">{{d.time}}</view>
				<view class="status">{{d.status}}</view>
			</view>
		</view>
		
		<view class="recommend-line">
			<text>猜你喜欢</text>
		</view>
		
		<view class="recommend-pro-view">
			<ProductListComponent disableTitle="true" titleIcon="icon-shuiguopingguo" titleName="精品推荐" :proList="recommendList"/>
		</view>
	</view>
</template>

<script>
var that;
import ProductListComponent from "../index/ProductListComponent.vue";
export default {
	data() {
		return {
			id: 0,
			orders:{}, //
			express:null,
			expressList: [],
			detail: {},
			recommendList: {},
			expressIndex: 0,
			expressArray:[], //
			
		}
	},
	onLoad(options) {
		that = this;
		this.id = options.id;
		that.loadData("");
	},
	methods: {
		loadData: function(expNo) {
			that.$request.get("ordersExpressService.queryDetail", {id: that.id,expNo:expNo}).then((res)=> {
				//console.log(res);
				that.orders = res.orders;
				that.express = res.express;
				that.detail = res.detail;
				that.recommendList = res.recommendList;
				that.expressList = res.expressList;
				that.rebuildArray();
			})
		},
		rebuildArray: function() {
			let array = []; let index = 0; let indexFlag = 0;
			this.expressList.map((item)=> {
				array.push(item.expName+"-"+item.expNo);
				if(that.express && that.express.expNo==item.expNo) {index = indexFlag;}
				indexFlag++;
			});
			this.expressArray = array;
			this.expressIndex = index;
		},
		bindPickerChange: function(e) {
			let index = e.target.value;
			//console.log('picker发送选择改变，携带值为', index);
			this.expressIndex = index;
			let expNo = this.expressList[index].expNo;
			//console.log(expNo);
			this.loadData(expNo);
		},
	},
	components: {ProductListComponent}
}
</script>

<style>
.main-view {
	width:calc(100vw - 20px); padding: 10px; background:#f8f8f8; min-height: 100vh;
}
.normal-block {
	background:#FFFFFF; border-radius: 6px;margin-bottom: 10px; padding: 10px;
}
.address-view {
	 line-height: 20px;
	color:#999;
}
.address-view text {
	color:#444;
}
.express-company {
	line-height: 20px; color:#888; 
}
.express-company text {
	font-size:8px; color:#aaa;
}

.detail-view {
	color:#555;
}

.single-detail-view {
	border-left: 1px #ddd solid; padding:8px 0px;
}
.single-detail-view .time {
	color:#666; margin-left: 10px;
}
.single-detail-view .status {
	color:#666; margin-left: 10px; line-height: 20px;
}

.recommend-line {
	width:100%; border-top: 2px #DE5A29 solid; margin-top: 25px; position: relative;
}
.recommend-line text {
	width: 70px; background:#DE5A29; height: 24px; line-height: 24px; text-align: center; position: absolute;
	top: -12px; left: 50%; margin-left: -35px; color:#FFF; border-radius: 8px;
}
.recommend-pro-view {
	width:100%; background:#FFFFFF; min-height: 100px; border-radius:10px; margin-top: 25px;
}

.express-select {
	border-top:1px #e8e8e8 solid; border-bottom: 1px #e8e8e8 solid;
}
text.current-express {
	color:#555; font-size: 24rpx; font-weight: bold;
}
.red {
	color:#F00;
}
.change-express {
	text-align: right; margin-left: 10px;
}
</style>
