<template>
	<view>
		<textarea placeholder="点评内容..." @input="onInput"></textarea>
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
		ordersNo: {
			type: String,
			default: ""
		}
	},
	created() {
		that = this;
	},
	data() {
		return {
			content: ''
		}
	},
	methods: {
		onCancel: function() {
			this.$emit("cancel");
		},
		onOk: function() {
			const con = this.content;
			if(!con) {
				uni.showToast({
					title: "请输入点评内容", icon: 'none'
				})
			} else {
				that.$request.get("miniOrdersCommentService.comment", {content: con, ordersNo: that.ordersNo})
				this.$emit("ok", this.ordersNo);
			}
		},
		onInput: function(e) {
			// console.log(e)
			const con = e.detail.value;
			that.content = con;
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
.textarea-placeholder {
	color:#aaa; font-size: 10px;
}
</style>
