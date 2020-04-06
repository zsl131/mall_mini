<template>
	<view class="main-body">
		<view class="grace-gtbg-green grace-shadow title-name grace-white">
			<text class="name">我的等级：</text>
			<view class="status">
				<text v-if="applyObj.status==='0'" class="color-dark">等待审核</text>
				<text v-if="applyObj.status==='1'" class="color-green">{{applyObj.levelId?applyObj.levelName:"未分配级别"}}</text>
				<text v-if="applyObj.status==='2'" class="color-red">申请被驳回</text>
			</view>
		</view>
		<view class="zsl-card" v-if="applyObj.status!='1'">
			<view class="zsl-card-header"><span>已申请[<view class="name">{{applyObj.name}}</view>]</span>
				<view class="zsl-card-header-extra">
					<b v-if="applyObj.status==='0'" class="color-dark">等待审核</b>
					<b v-if="applyObj.status==='1'" class="color-green">审核通过</b>
					<b v-if="applyObj.status==='2'" class="color-red">申请被驳回</b>
				</view>
			</view>
			<view class="zsl-card-body">已申请，等待审核</view>
			
			<button type="primary" style="margin: 10px;" size="mini" @tap="bindNotice">点击 开启审核状态通知</button>
		</view>
		
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
export default {
	props: {
		applyObj: {
			type: Object,
			default: function() {return {};}
		},
		levelList: {
			type: Array,
			default: function() {return [];}
		}
	},
	data() {
		return {
			levelId: 0,
			page: 0,
			size: 5,
			
			canPage: true,
			rateList: [], //提成标准
		}
	},
	created: function(){
		that = this;
		//console.log(that.applyObj)
		that.levelId = that.applyObj.levelId;
		that.loadData(false);
	},
	methods: {
		loadData: function(isAppend) {
			if(that.canPage) {
				that.$request.get("agentLevelSpecsRateService.queryRate", {page: that.page, size: that.size, levelId: that.levelId}).then((res)=> {
					//console.log(res);
					if(res) {
						if(isAppend) {
							that.rateList = that.rateList.concat(res.rateList);
						} else {
							that.rateList = res.rateList;
						}
						that.page = that.page + 1;
						if(res.rateList.length<=0) {
							that.canPage = false;
						}
					} else {that.canPage = false;}
				})
			}
		},
		bindNotice: function() {
			const tempId = "a7uRVse33w7zjMik362eMXJCp8cu45vjpaVNQesish8";
			uni.requestSubscribeMessage({
				tmplIds: [tempId],
				success:(res)=> {
					//console.log(res)
					const status = res[tempId];
					if(status=='accept') {
						that.$request.get("customSubscribeService.accept", {tempId: tempId}).then((result)=> {
							//console.log(result);
							if(result) {uni.showToast({
								title: "订阅成功", icon:'none'
							})}
						})
					}
					//console.log(res['a7uRVse33w7zjMik362eMXJCp8cu45vjpaVNQesish8'])
				}
			});
		},
		onChangeLevel: function(levelId) {
			that.levelId = levelId;
			that.page = 0; that.canPage = true;
			that.loadData(false);
		},
		onPage: function() {
			// console.log("--------")
			that.loadData(true);
		},
	}
}
</script>
<style scoped>
.main-body {
	width:100%; padding-bottom: 15px;
}
.name {
	display: inline-block; font-size:14px;
}
.title-name {
	width:100%; text-align: center; height:40px; line-height: 40px; font-size: 22px; margin-top: 10px;
}
.title-name .name {
	
}
.title-name .status {
	display: inline-block; color:#FFF;
}
.title-name .status text {
	color:#FFF; font-size:14px;
}

.show-level-main-view {
	width:100%; border:1px #ddd solid; margin-top:12px;
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