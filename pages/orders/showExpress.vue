<template>
	<view class="main-view">
		<view class="normal-block address-view" v-if="express">
			<text>收货地址：</text>{{express.addressCon}}
		</view>
		<view class="normal-block express-company" v-if="!detail.type && express">
			{{express.expName}}【{{express.expNo}}】
			<view><text>说明:</text>暂无任何物流信息</view>
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
			express:{},
			detail: {},
			recommendList: {}
		}
	},
	onLoad(options) {
		that = this;
		this.id = options.id;
		that.loadData();
	},
	methods: {
		loadData: function() {
			that.$request.get("ordersExpressService.queryDetail", {id: that.id}).then((res)=> {
				console.log(res);
				that.express = res.express;
				that.detail = res.detail;
				that.recommendList = res.recommendList;
			})
		}
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
</style>
