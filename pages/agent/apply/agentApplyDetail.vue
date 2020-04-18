<template>
	<view>
		<view v-if="applyObj.status=='1'">
			<agentCenterComponent :agent="applyObj"></agentCenterComponent>
		</view>
		<view class="agent-main-body" v-if="applyObj.status!='1'">
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
				
				<!-- <button type="primary" style="margin: 10px;" size="mini" @tap="bindNotice">点击 开启审核状态通知</button> -->
			</view>
		</view>
	</view>
</template>
<script>
var that;
import agentCenterComponent from '../agentCenterComponent.vue';
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
		}
	},
	created: function(){
		that = this;
		//console.log(that.applyObj)
		that.levelId = that.applyObj.levelId;
		//that.loadData(false);
	},
	methods: {
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
	},
	components: {
		agentCenterComponent
	}
}
</script>
<style scoped>
.agent-main-body {
	width:calc(100% - 20px); padding: 10px;
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

.more-rate {
	width:100%; text-align: center; padding: 10px 0px;
}
.more-rate text {
	color:#aaa; 
}
</style>