<template>
	<view class="main-view">
		<form @submit="onSubmit">
			<view class="single-form">
				<view class="form-label">店铺名称</view>
				<view class="form-input">
					<input placeholder="输入店铺名称" name="shopName" v-model="formData.shopName"/>
				</view>
			</view>
			
			<view class="single-form">
				<view class="form-label">联系电话</view>
				<view class="form-input">
					<input placeholder="输入联系电话" maxlength="11" name="phone" v-model="formData.phone"/>
				</view>
			</view>
			
			<view class="single-form">
				<view class="form-label">电子邮件</view>
				<view class="form-input">
					<input placeholder="电子邮件,用于接收图片资料" name="email" v-model="formData.email"/>
				</view>
			</view>
			
			<view class="single-form">
				<view class="form-label">备注信息</view>
				<view class="form-input">
					<input placeholder="如需要展示在图片上的内容" name="remark" v-model="formData.remark"/>
				</view>
			</view>
			
			<view class="single-form">
				<button form-type="submit" type="primary">提交</button>
			</view>
		</form>
	</view>
</template>

<script>
var that;
export default {
	data() {
		return {
			formData:{}, //
		}
	},
	onLoad() {
		that = this;
	},
	methods: {
		onSubmit: function(e) {
			//console.log(e)
			const data = e.detail.value;
			if(!data.shopName) {uni.showToast({ title: "请输入店铺名称", icon:"none" })}
			else if(!data.phone) {uni.showToast({ title: "请输入联系电话", icon:"none" })}
			else if(!data.email) {uni.showToast({ title: "请输入电子邮件", icon:"none" })}
			else {
				console.log(data);
				that.$request.get("miniMatterService.save", data).then((res)=> {
					//console.log(res);
					uni.redirectTo({
						url: "./matter"
					})
				})
			}
		},
	}
}
</script>

<style>
.main-view {
	width: calc(100% - 20px); padding: 10px;
}
.single-form {
	width:100%; margin-bottom: 12px;
}
.single-form .form-label {
	font-size: 14px; color:#333; padding-left: 5px;
}
.single-form .form-input {
	width: 100%;
}
.single-form .form-input input {
	border-bottom: 1px #e7e7e7 solid; height: 35px; line-height: 35px; padding: 0px 5px;
	font-size: 14px; color:#333;
}
</style>
