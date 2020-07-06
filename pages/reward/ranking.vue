<template>
	<view>
		<scroll-view style="height: 100vh" scroll-y="true" @scrolltolower="onPage">
			<view class="header-main">
				<view class="image-view">
					<image :src="custom.headImgUrl" mode="widthFix"></image>
				</view>
				<view class="header-content" v-if="ownRanking && ownRanking.id">
					<view class="header-content-info">月份：<text>{{month}}</text></view>
					<view class="header-content-info">销售：<text>{{ownRanking.specsCount}}</text>件产品</view>
					<view class="header-content-info">佣金：<text>{{ownRanking.commissionMoney}}</text>元</view>
				</view>
				<view class="header-order-no" v-if="ownRanking && ownRanking.id">
					<text class="little-remark">第</text>
					<text class="big-remark">{{ownRanking.orderNo}}</text>
					<text class="little-remark">名</text>
				</view>
				<view class="header-content-null" v-if="!ownRanking || !ownRanking.id">
					您{{month}}月份榜上无名。
				</view>
			</view>
			
			<view class="ranking-main-view">
				<view class="no-ranking" v-if="!rankingList || rankingList.length<=0">
					{{month}}月份数据不存在或未更新
				</view>
				<view class="single-ranking" v-for="(item, index) in rankingList" :key="index" v-if="rankingList && rankingList.length>0">
					<view class="ranking-order-no">{{item.orderNo}}</view>
					<view class="ranking-nickname">{{item.customNickname}}</view>
					<view class="ranking-content">
						<view><text class="remark">销售</text><text class="value">{{item.specsCount}}</text><text class="remark">件</text></view>
						<view><text class="remark">佣金</text><text class="value">{{item.commissionMoney}}</text><text class="remark">元</text></view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
var that;
import config from "@/common/config.js";
export default {
	data() {
		return {
			custom: {},
			
			page: 0,
			size: 15,
			canPage: true,
			
			ownRanking: {},
			rankingList: [],
			month:'', //月份
		}
	},
	onLoad() {
		that = this;
		const custom = uni.getStorageSync(config.CUR_CUSTOM);
		that.custom = custom;
		//console.log(custom)
		that.loadData();
	},
	methods: {
		loadData: function(append) {
			if(that.canPage) {
				const month = ''; //测试时使用指定月份，正式情况下不能传值
				that.$request.get("miniSaleRankingService.list", {month: month, page: that.page, size: that.size, sort: 'orderNo_a'}).then((res)=> {
					if(append) {
						that.rankingList = that.rankingList.concat(res.rankingList);
					} else {
						that.rankingList = res.rankingList;
					}
					if(res.rankingList.length<that.size) {that.canPage = false;}
					that.page = that.page + 1;
					that.ownRanking = res.ownRanking;
					that.month = res.month;
					//console.log(res)
				});
			} else {
				uni.showToast({
					title: "没有更多了", icon: 'none'
				})
			}
		},
		onPage: function() {
			that.loadData(true);
		}
	}
}
</script>

<style>
.header-main {
	width:100%; height: 60px; display: flex; border-top: 1px #3bb468 solid;
	background: #f8f8f8; border-bottom: 1px #ddd solid;
}
.image-view {
	width: 60px;
}
.image-view image {
	width: 40px; height: 40px; border-radius: 40px; margin: 10px;
}
.header-content {
	flex: 1;
}
.header-order-no {
	width: 80px; line-height: 60px; text-align: center;
}
.little-remark {
	font-size: 9px; color:#999;
}
.big-remark {
	font-size: 18px; color:#ff7f00; padding: 0px 4px;
}
.header-content-info {
	margin-left: 10px; margin-top: 3.5px; color:#999;
}
.header-content-info text {
	color:#ff7f00;
}
.header-content-null {
	flex: 1; width:100%; text-align: center; line-height: 60px; color:#999;
}

.no-ranking {
	width:100%; text-align: center; padding-top: 40px; color:#aaa;
}

.ranking-main-view {
	width: calc(100% - 20px); padding: 10px;
}
.single-ranking {
	border-bottom: 1px #f0f0f0 solid; height: 50px; display: flex;
}

.ranking-order-no {
	width: 40px; line-height: 50px; color:#555; font-size: 14px;
}
.ranking-nickname {
	flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
	line-height: 50px; color:#888; font-size: 12px;
}
.ranking-content {
	flex: 1;
}
.ranking-content view {
	line-height: 20px;
}
.ranking-content .remark {
	color:#999; font-size: 8px;
}
.ranking-content .value {
	color:#ff7f00; font-size: 14px; padding: 0px 2px;
}
</style>
