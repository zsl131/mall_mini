<template>
	<view>
		<picker class="grace-form-picker" @change="changeReason" :value="index" :range="reasonList">
			<text class="grace-text">{{reasonList[index]}}</text>
			<text class="grace-icons icon-arrow-down" style="margin-left:5px;"></text>
		</picker>
		<view class="opts">
			<view class="opt cancel" @tap="onCancel">取消</view>
			<view class="opt ok" @tap="onOk">确定</view>
		</view>
	</view>
</template>

<script>
var that;
export default {
	props: {
		reasonList: {
			type: Array,
			default: function() {return [];}
		},
		ordersNo: {
			type: String,
			default: ''
		}
	},
	created() {
		that = this;
	},
	data() {
		return {
			index: 0
		}
	},
	methods: {
		onCancel: function() {
			this.$emit("cancel");
		},
		onOk: function() {
			const index = this.index;
			//console.log(this.reasonList[this.index]);
			if(index<=0) {
				uni.showToast({
					title: "请选择退款原因", icon: 'none'
				})
			} else {
				this.$emit("ok", this.ordersNo, this.reasonList[this.index]);
			}
		},
		changeReason: function(e) {
			//console.log(e)
			this.index = parseInt(e.detail.value);
			//console.log(con)
		},
	}
}
</script>

<style>
textarea {
	border:1px #e6e6e6 solid; margin: 10px; padding: 10px; border-radius: 6px; font-size: 14px; line-height: 22px;
	width:calc(100% - 40px);
}
.opts {
	width:100%; display: flex; height: 40px; line-height: 40px; text-align: center;
	border-top: 1px #e6e6e6 solid;
}
.opts view.cancel {
	flex: 1;
}
.opts view.ok {
	flex: 1; color:#1F9609; border-left: 1px #e6e6e6 solid;
}
.grace-form-picker {
	padding: 10px; height: 30px; line-height: 30px;
}
.grace-text {
	text-align: left; font-size: 32rpx;
}
</style>
