<template>
	<view style="">
		------
	</view>
</template>
<script>
var that;
import config from "@/common/config.js";
export default{
	props: {
	},
	data() {
		return {
			custom: {},
			
			commissionList: [], //提成数量统计
			
			servicePhone: '4008080987', //客服电话
			cashMoney:0,
		}
	},
	created() {
		const custom = uni.getStorageSync(config.CUR_CUSTOM);
		//console.log(custom)
		this.custom = custom;
		that = this;
		that.loadData();
	},
	methods: {
		loadData: function() {
			that.$request.get("miniCustomCommissionRecordService.listOwn", {}).then((res)=> {
				//console.log(res);
			})
		},
	},
	components:{
	}
}
</script>
<style>
</style>