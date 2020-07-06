<template>
	<view>
		<scroll-view v-if="list.length > 0" class="show-sub-list" scroll-y="true" @scrolltolower="onPage">
			<view class="single-sub" v-for="(sub,index) in list" :key="index">
				<view class="nickname">{{sub.nickname}}</view>
				<view class="createTime">{{sub.leaderTime}} 加入</view>
			</view>
			<view class="more-rate">
				<text v-if="canPage">正在加载...</text>
				<text v-if="!canPage">这就是底线</text>
			</view>
		</scroll-view>
		<view v-if="list.length < 1" style="margin-top:100px;">
			<emptyCompent optMsg="去邀约吧" message="我居然没有朋友~" @onClick="gotoCenter"></emptyCompent>
		</view>
	</view>
</template>

<script>
var that;
import emptyCompent from "@/components/emptyComponent.vue"
export default {
	data() {
		return {
			list: [], //
			page:0,
			size: 15,
			canPage: true,
		}
	},
	onLoad() {
		that = this;
		that.loadData();
	},
	methods: {
		loadData: function(append) {
			if(that.canPage) {
				that.$request.get("miniAgentService.listSub",{page: that.page, size: that.size}).
					then((res)=> {
					//console.log(res)
					if(append) {
						that.list = that.list.concat(res.data);
					} else {
						that.list = res.data;
					}
					// console.log(res.size<that.size)
					if(res.data.length<that.size) {
						//that.init();
						that.canPage = false;
					} else {
						that.page = that.page + 1; 
					}
					uni.setNavigationBarTitle({
						title: '我邀请的代理（'+res.size+'）'
					})
				});
			} else {
				uni.showToast({
					title: "没有更多数据啦", icon:"none"
				})
			}
		},
		onPage: function() {
			// console.log("--------")
			that.loadData(true);
		},
		gotoCenter: function() {
			uni.redirectTo({
				url: "./center"
			})
		}
	},
	components: {emptyCompent}
}
</script>

<style>
.show-sub-list {
	height: calc(100vh - 20px); width: calc(100% - 20px); padding: 10px;
}
.more-rate {
	width:100%; text-align: center; padding: 15px 0px; color:#999;
}

.single-sub {
	width:100%; border-bottom: 1px #e8e8e8 solid; margin-top: 6px; 
}
.single-sub view {
	width:100%; line-height: 24px;
}
.single-sub view.nickname {
	color:#666; font-size: 14px;
}
.single-sub view.createTime {
	color:#999; font-size: 12px;
}
</style>
