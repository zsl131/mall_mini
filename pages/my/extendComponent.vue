<template>
	<view>
		<text v-if="content" @tap="togoExtend">{{content}}</text>
		<view v-if="!custom.bindWx && !content" class="recommend-extend-view" @tap="togoExtend">
			点击关注“满山晴”公众号，接收{{msg}}信息
		</view>
	</view>
</template>
<script>
var that;
import config from "@/common/config.js";
export default{
	props:{
		msg : {
			type : String,
			default : "提示"
		},
		content: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			custom: {},
		}
	},
	created() {
		that = this;
		this.custom = uni.getStorageSync(config.CUR_CUSTOM);
	},
	methods:{
		togoExtend: function() { //跳转到关注公众号页面  
			that.$request.get("miniPublicService.genBindCode", {}).then((res)=> {
				//console.log(res);
				const code = res.code;
				const con = '验证码【'+code+'】已复制，点击“确定”关注公众号直接粘贴即可完成绑定[10分钟内有效]';
				uni.showModal({
					title: "提示",
					content: con,
					success: function(result) {
						if(result.confirm) {
							uni.setClipboardData({
								data: code
							});
							uni.navigateTo({
								//                                     https://mp.weixin.qq.com/s/eFhWaoqFBtiBUegLPonBtw
								url: '/pages/my/myWeb?src='+encodeURI("https://mp.weixin.qq.com/s/eFhWaoqFBtiBUegLPonBtw")
							})
						}
					}
				})
			})
		}
	}
}
</script>
<style scoped>
.recommend-extend-view {
	background:#f6d2c4; margin-bottom: 10px; border-radius: 6px; padding:10px;
	color:#bb4114;
}
</style>
