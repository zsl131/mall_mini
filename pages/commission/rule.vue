<template>
	<view>
		<view class="zsl-remark" v-if="(levelList && levelList.length>0)">注意：各级代理按照以下标准进行销售提成，此标准会根据整体经营情况进行适当调整，请各代理注意查阅。</view>
		<view class="show-level-main-view" v-if="(levelList && levelList.length>0)">
			<view class="show-level-name">
				<view v-for="(level, index) in levelList" @tap="onChangeLevel(level.id)" :key="index" :class="levelId==level.id?'active':''">{{level.name}}</view>
			</view>
			<scroll-view class="show-rate-list" scroll-y="true" @scrolltolower="onPage">
				<view class="single-rate" v-for="(rate,index) in rateList" :key="index">{{rate.proTitle}}[{{rate.specsName}}] : <text class="amount">{{rate.rate}}</text> 元/{{rate.unitName}}</view>
				<view class="more-rate">
					<text v-if="canPage">正在加载...</text>
					<text v-if="!canPage">这就是底线</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
var that;
import segmentedControl from '@/components/segmentedControl.vue';
import emptyCompent from "@/components/emptyComponent.vue"
import config from "@/common/config.js";
export default {
	data() {
		return {
			levelId: '', 
			status: '', //状态
			page: 0, 
			size: 15,
			canPage: true,
			
			rateList:[],
			levelList: [], //
		}
	},
	onLoad(options) {
		//console.log(options)
		//const custom = uni.getStorageSync(config.CUR_CUSTOM);
		//this.levelId = custom.levelId;
		//console.log(custom)
		that = this;
		that.type = options.status;
		that.loadData();
	},
	methods: {
		loadData: function(append) {
			if(that.canPage) {
				that.$request.get("miniAgentLevelSpecsRateService.query",{
					levelId: that.levelId, page: that.page, size: that.size}).
					then((res)=> {
					//console.log(res)
					that.levelList = res.levelList;
					that.levelId = res.levelId;
					if(append) {
						that.rateList = that.rateList.concat(res.rateList);
					} else {
						that.rateList = res.rateList;
					}
					// console.log(res.size<that.size)
					if(res.rateList.length<that.size) {
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
		onChangeLevel: function(levelId) {
			
			that.levelId = levelId;
			that.page = 0; that.canPage = true;
			that.loadData(false);
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
.show-level-main-view {
	width:100%; border:1px #ddd solid; margin-top:12px; color:#888;
}
.show-level-name {
	display: flex; 
}
.show-level-name view {
	flex:1; background:#f4f4f4; color:#888; text-align:center; height: 35px; line-height: 35px;
}
.show-level-name view.active {
	background:#ff7800; color:#FFF;
}


.show-rate-list {
	height: calc(100vh - 120px);
}
.single-rate {
	line-height: 25px; padding: 8px 8px; border-bottom: 1px #ddd dotted; font-size:14px;
}
.single-rate .amount {
	font-size: 14px; color:#F00; font-weight: bold;
}

.more-rate {
	width:100%; text-align: center; padding: 10px 0px;
}
.more-rate text {
	color:#aaa; 
}
</style>
