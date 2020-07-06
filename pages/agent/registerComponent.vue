<template>
	<view class="register-main">
		
		<view class="content-main">
			<view class="input-remark">请输入你获取的邀请码</view>
			<view>
				<input class="input" :value="code" placeholder-class="input-holder" @input="inputCode" placeholder="输入获取的邀请码"/>
			</view>
			<view>
				<view class="submit-btn" @tap="submitCode">提交</view>
			</view>
			<view class="info">还可选择</view>
			<view class="other-view">
				<view>
					<button open-type="contact" size="mini"
					style="border:none;padding:0px;"
					type="default" plain="true" bindcontact="handleContact">联系客服</button>
				</view>
				<view @click="showTopic">代理须知</view>
			</view>
			<view class="line-view"></view>
			
			<view class="remark-view">
				<view>·目前满山晴代理免费招募；</view>
				<view>·需要有邀请码才可申请哦；</view>
				<view>·可以拔打：4008080987咨询的哦。</view>
			</view>
		</view>
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
			code:'', //
		}
	},
	created() {
		const custom = uni.getStorageSync(config.CUR_CUSTOM);
		//console.log(custom)
		this.custom = custom;
		that = this;
	},
	methods: {
		inputCode: function(e) {
			//console.log(e.target.value);
			that.code = e.target.value.toUpperCase();
		},
		showTopic: function() {
			uni.navigateTo({ url:"/pages/topic/show?type=sn&sn=AGENT-NOTICE" })
		},
		submitCode: function() {
			const code = that.code;
			if(!code || code.length<4) {
				uni.showToast({
					title: "请认真输入邀请码", icon:"none"
				})
			} else {
				//这里提交邀请码
				that.$request.get("miniAgentService.bindCode", {code:code.toUpperCase()}).then((res)=> {
					const flag = res.flag;
					const msg = res.message;
					uni.showToast({title: msg, icon:"none"});
					if(flag=='1') {
						uni.redirectTo({
							url: "./center"
						})
					}
				})
			}
		},
	},
	components:{
	}
}
</script>
<style>
.register-main {
	width:calc(100% - 20px); padding: 10px;
	background:#f5f5f5; min-height: calc(100vh - 20px);
}
.content-main {
	width:100%; min-height: 300px; background:#FFFFFF; border: 1px #dfdfdf solid; border-radius: 10px;
	box-shadow: 0px 0px 5px #ddd;
}
.input-remark {
	width:100%; text-align: center; font-size: 16px; color:#999; margin-top: 20px;
}
.input {
	width: 60%; margin-left:20%; height: 40px; border:1px #ddd solid; background:#F5f5f5; border-radius:5px; margin-top: 20px;
	text-align: center; padding: 0px 8px; font-size: 22px; letter-spacing: 8px;
}
.input-holder {
	font-size: 14px; letter-spacing: 2px;
}
.submit-btn {
	width: 50%; margin-left: 25%; height: 40px; border-radius: 30px; background:#00BA62; color:#FFF; font-size: 16px;
	line-height: 40px; text-align: center; margin-top: 10px;
}
.line-view {
	border-top: 1px #e8e8e8 solid; width: 90%; margin-left: 5%; font-size:1px; margin-top: 10px;
}
.info {
	font-size:12px; color:#777; width:100%; text-align: center; margin: 5px 0px;
}
.other-view {
	display: flex;
}
.other-view view {
	flex: 1;
}
.other-view view:first-child {
	text-align: right; padding-right: 5px; 
}
.other-view view:last-child {
	padding-left: 5px; border-left: 1px #ddd solid; font-size: 13px;
	height: 18px; margin-top: 5px;
}
.remark-view {
	width: calc(100% - 30px); padding: 15px; color:#999; font-size: 14px; line-height: 22px;
}
</style>