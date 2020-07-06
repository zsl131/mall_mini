<template>
	<view>
		<graceDialog :show="showDialog" title="手机绑定">
			<view slot="content">
				<view class="bind-main-view">
					<view class="content-view">
						<view><input type="number" placeholder="手机号码" maxlength="11" @input="inputPhone"/></view>
						<view class="code-view"><input maxlength="4" placeholder="验证码" @input="inputCode"/>
						<view :class="['code-btn', loading?'loading-code':'']" @tap="getCode">{{codeStr}}</view>
						</view>
					</view>
					
					<view class="grace-space-between" slot="btns">
						<view class="grace-dialog-buttons" @tap="closeShow">取消</view>
						<view class="grace-dialog-buttons" style="color:#00B26A;" @tap="submitBind">确定</view>
					</view>
				</view>
			</view>
		</graceDialog>
		<graceBottomDialog :show="showBottomDialog" v-on:closeDialog="closeBottomShow">
			<view class="grace-space-between" slot="btns">
				<button class="grace-dialog-buttons" style="color:#00B26A;" @tap="bindPhoneShow">绑定手机</button>
				<button class="grace-dialog-buttons" style="color:#00B26A;" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">获取微信手机</button>
			</view>
		</graceBottomDialog>
	</view>
	
</template>
<script>
var that;
import graceDialog from '@/graceUI/components/graceDialog.vue';
import graceBottomDialog from '@/graceUI/components/graceBottomDialog.vue';
import config from "@/common/config.js";
export default {
	props: {
		/* showBottomDialog: {
			type: Boolean,
			default: false
		} */
	},
	created : function(){
		that = this;
	},
	data() {
		return {
			loading: false,
			time: 60,
			codeStr: "获取",
			
			phone: '', //用户输入的手机号
			code: '',
			errorMsg: '',
			
			regPhone:'', //服务端返回的手机号码，防止获取验证码后又修改号码
			realCode: '', //真实发出去的验证码
			
			
			showDialog: false,
			showBottomDialog: false,
		}
	},
	methods:{
		getCode: function() {
			if(that.phone.length!=11) {
				uni.showToast({
					title: '请认真输入手机号码', icon:'none'
				})
			} else if(!that.loading) {
				that.loading = true;
				
				that.$request.get("smsService.sendCode", {phone: that.phone}).then((res)=> {
					if(res.flag=='1') {
						that.codeTimer();
						that.regPhone = res.phone;
						that.realCode = res.code;
					} else {
						that.loading = false;
						uni.showToast({
							title:res.message, icon:'none'
						})
					}
				});
			}
		},
		submitBind: function() {
			const phone = that.regPhone;
			const realCode = that.realCode;
			const code = that.code;
			if(!phone) {
				uni.showToast({
					title: "请先获取验证码", icon:'none'
				})
			} else if(code!=realCode) {
				uni.showToast({
					title: "验证码出错", icon:'none'
				})
			} else {
				that.$request.get("customerService.bindPhone", {phone: phone}).then((res)=> {
					//console.log(res)
					that.bindPhone(phone);
					/* uni.showToast({
						title: res.message, icon:"success"
					}) */
					// that.$emit('bindPhone', phone);
				});
			}
		},
		codeTimer: function() {
			const interval = setInterval(function() {
				//console.log("----------------"+that.time)
				that.time = that.time - 1;
				that.codeStr = that.time + ' s';
				if(that.time<=0) {
					clearInterval(interval);
					that.loading = false; that.codeStr = '重新获取';
				}
			}, 1000);
		},
		inputPhone: function(e) {
			//console.log(e.detail.value)
			that.phone = e.detail.value;
		},
		inputCode: function(e) {
			//console.log(e.target.value)
			that.code = e.detail.value;
		},
		/* closeShow: function() {
			that.$emit('closeShow');
		}, */
		
		openDialog: function() {
			that.showBottomDialog = true;
		},
		bindPhone: function(phone) {
			//console.log("--------"+phone)
			uni.showToast({
				title: "成功绑定："+phone, icon:'none'
			})
			const custom = uni.getStorageSync(config.CUR_CUSTOM);
			custom.phone = phone;
			that.phone = phone;
			uni.setStorageSync(config.CUR_CUSTOM, custom);
			that.showDialog = false;
			this.$emit('bindPhoneSuc', phone);
		},
		onBindPhone: function() {
			/* that.showDialog = true; */
			const custom = uni.getStorageSync(config.CUR_CUSTOM);
			if(custom.phone) {
				uni.showToast({
					title: "您已绑定手机："+custom.phone, icon:'none'
				})
			} else {
				that.showBottomDialog = true;
			}
		},
		closeShow: function() {
			that.showDialog = false;
		},
		bindPhoneShow: function() {
			that.showDialog = true;
			that.showBottomDialog = false;
			
			//this.$emit('closeDialog', false);
		},
		closeBottomShow: function() {
			that.showBottomDialog = false;
			//this.$emit('closeDialog', false);
		},
		phoneBindResult: function(res) {
			if(res.phone) {
				that.bindPhone(res.phone);
				that.showBottomDialog = false;
			} else {
				uni.showToast({
					title: res.message, icon:'none'
				})
			}
		},
		onGetPhoneNumber: function(e) {
			if("getPhoneNumber:ok"!=e.detail.errMsg) {
				uni.showToast({
					title: "微信授权失败", icon: "false"
				})
			} else {
				uni.checkSession({
					success() {
						//console.log("=========");
						that.$request.get("miniAuthService.getPhone", {code: '', encryptedData:e.detail.encryptedData, iv: e.detail.iv}).then((res)=> {
							//console.log(res);
							that.phoneBindResult(res);
						})
					},
					fail() {
						uni.login({
						  provider: 'weixin',
						  success: function (loginRes) {
							  const code = loginRes.code;
							  // console.log(code);
							  that.$request.get("miniAuthService.getPhone", {code: code, encryptedData:e.detail.encryptedData, iv: e.detail.iv}).then((res)=> {
							  	//console.log(res);
								that.phoneBindResult(res);
							  })
						  },
						});
					}
				})
				
			}
		}, 
	},
	components: {graceDialog,graceBottomDialog}
}
</script>
<style scoped>
.bind-main-view {
	width:100%; background: #ffffff;
}
.content-view {
	margin: 15px;
}
.code-view {
	display: flex;
}
.code-view input {
	flex:1;
}
.code-view .code-btn {
	width:80px;
}

input {
	height: 40px; border-bottom: 1px #e8e8e8 solid; font-size: 16px;
}
.code-btn {
	height:40px; line-height: 40px; text-align: center;
	border-bottom: 1px #e8e8e8 solid; border-left: 1px #e8e8e8 solid;
}
.loading-code {
	color:#39B55A;
}
</style>