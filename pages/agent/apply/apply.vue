<template>
	<view>
		<showSharederComponent ref="sharedComponent"></showSharederComponent>
		<extendComponent msg="相关提示"></extendComponent>
		<view class="grace-body" v-if="!applyObj">
			<agentApplyForm ref="applyForm"/>
		</view>
		<view v-if="applyObj">
			<agentApplyDetail v-if="(applyObj.status=='1' || applyObj.status=='0')" :levelList="levelList" :applyObj="applyObj" :verifyList="verifyList" :paperList="paperList"/>
			<view class="grace-body">
				<agentApplyForm v-if="applyObj.status=='2'" :defaultIndexVal="defaultIndexVal" :curObj="applyObj" :verifyList="verifyList" :paperList="paperList"/>
			</view>
		</view>
	</view>
</template>

<script>
var that = this;
/* import agentApplyDetail from "@/pages/agent/apply/detail.vue"; */
import agentApplyDetail from "./agentApplyDetail.vue";
import agentApplyForm from "./agentApplyForm.vue";
import extendComponent from "../../my/extendComponent.vue"
import showSharederComponent from "@/components/showSharederComponent.vue"
export default {
	data() {
		return {
			applyObj: null,
			verifyList:[],
			paperList:[],
			defaultIndexVal: [0,0,0],
			levelList: [],
		}
	},
	onLoad: function() {
		that = this;
		this.$refs.sharedComponent.loadShareder(0);
		that.loadData();
	},
	methods: {
		
		loadData: function() {
			that.$request.get("miniAgentService.loadOne", {}).then((res)=> {
				//console.log(res);
				that.applyObj = res.obj; //表示已经申请过
				if(res.obj && res.obj.addressIndex) {
					that.buildDefaultIndex(res.obj.addressIndex);
				}
				that.verifyList = res.verifyList;
				that.paperList = res.paperList;
				that.levelList = res.levelList;
			})
		},
		buildDefaultIndex: function(addressIndex) {
			const array = addressIndex.split("-");
			if(array) {
				let vals = [];
				array.map((item,index)=>vals[index]=parseInt(item));
				that.defaultIndexVal = vals;
			}
		},
		
	},
	components: {
		agentApplyDetail,
		agentApplyForm,
		showSharederComponent,
		extendComponent
	}
}
</script>

<style>
	/* .grace-idcard-desc{background:#FFFFFF; color:#666666; line-height:1.8em; padding:20rpx; border-radius:10rpx;}
	.grace-idcard-text{line-height:1.8em; margin-top:30rpx; color:#666666;}
	.grace-idcard-items{background:#FFFFFF; padding:30rpx 50rpx; margin-top:25rpx; border-radius:10rpx;}
	.grace-idcard-items .img image{width:100%;} */
</style>
