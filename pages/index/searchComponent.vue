<template>
	<!-- 头部导航及搜索条 -->
	<graceHeader background="#34CD6D">
		<view class="grace-header-body">
			<!-- 返回按钮 -->
			<view class="icons grace-icons icon-img grace-white" @tap="showImageWall"></view>
			<!-- 中间内容 -->
			<!-- <view class="grace-header-content-noflex">
				<graceSearch @tap="gotoSearch()"></graceSearch>
			</view> -->
			<view class="zsl-search">
				<view class="zsl-search-in grace-nowrap">
					<view class="grace-icons icon-search zsl-search-icon"></view>
					<view class="input grace-flex1"><input type="search" placeholder="关键字" @tap="gotoSearch"/></view>
				</view>
			</view>
			<!-- 用户按钮 -->
			<button class="icons grace-icons icon-share grace-white share-button" plain="true" open-type="share"></button>
		</view>
	</graceHeader>
</template>

<script>
let that;
import graceHeader from '@/graceUI/components/graceHeader.vue';
import graceSearch from '@/graceUI/components/graceSearch.vue';
export default {
	props: {
	},
	data() {
		return {
		}
	},
	created: function(){
		that = this;
	},
	methods: {
		gotoSearch: function() {
			uni.navigateTo({
				url:"../search/search"
			})
		},
		showImageWall: function() {
			uni.switchTab({
				url:"../imageWall/index"
			})
		},
		showUser: function() {
			uni.switchTab({
				url:"../my/my"
			})
		}
	},
	components: {
		graceHeader,graceSearch
	}
}
</script>
<style scoped>
.zsl-search {
	background:#FFF; border-radius: 15px;
}
.zsl-search-in {
}
.zsl-search-icon {width: 18px; height: 20px; line-height: 24px; padding-left: 18rpx;}
.share-button {
	border:0px; border:none; background:none; border-radius:unset; padding:0px;
}
</style>