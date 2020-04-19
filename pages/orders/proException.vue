<template>
	<view>
		<extendComponent msg="相关提示"></extendComponent>
		<view class="single-order-pro-view">
			<view class="single-order-pro">
				<view class="pro-img"><image mode="aspectFit" :src="pro.proImg"/></view>
				<view class="pro-content">
					<view class="pro-con-title">{{pro.proTitle}}</view>
					<view class="pro-con-specs">{{pro.specsName}}</view>
					<view class="pro-con-fund" v-if="pro.fund>0"><text>公益捐款{{pro.fund}}元</text></view>
				</view>
				<view class="pro-price">
					<view class="pro-price-val">￥ <text>{{pro.price}}</text></view>
					<view class="pro-price-amount">x <text>{{pro.amount}}</text></view>
				</view>
			</view>
		</view>
		<view class="exception-info">
			<view class="exc-label"><text class="red">*</text>联系电话：</view>
			<view class="exc-value">
				<input @input="inputPhone" :disabled="oldExp?true:false" :value="oldExp?oldExp.phone:''" maxlength="11" placeholder="输入联系电话,请不要填错了哦"/>
			</view>
			
			<view class="exc-label" style="margin-top: 12px;"><text class="red">*</text>售后说明：</view>
			<view class="exc-value">
				<textarea :disabled="oldExp?true:false" :value="oldExp?oldExp.content:''" @input="inputMessage" maxlength="200" placeholder="输入售后说明"></textarea>
			</view>
			
			<view class="exc-label" style="margin-top: 12px;"><text class="red">*</text>上传凭证：</view>
			<view class="exc-value image-view-list">
				<view class="single-image" v-for="(img, index) in imgs" :key="index" @tap="removeImg(img)">
					<image :src="img" mode="aspectFit"/>
				</view>
				<view class="add-images-btn " @tap="addImage" v-if="!oldExp">
					<view class="zsl-icons icon-xinzeng"></view>
					<view>最多6张</view>
				</view>
			</view>
		</view>
		<view class="submit-btn-view" @tap="onSubmit" v-if="!oldExp && canSubmit">
			确定提交
		</view>
		<view v-if="oldExp" class="exp-status zsl-alter-warn">
			<text :class="'status_'+oldExp.status">{{oldExp.status=='0'?"处理中":"处理完成"}}</text>
		</view>
	</view>
</template>

<script>
var that;
import extendComponent from "../my/extendComponent.vue";
import urlConfig from "@/common/config.js";
export default {
	data() {
		return {
			id:0,
			pro:{},
			message: '',
			imgs:[], //照片信息
			maxLength: 6, //最多照片数
			phone: '',
			canSubmit: true,
			oldExp:null, //
		}
	},
	onLoad(options) {
		//console.log(options);
		that = this;
		that.id = options.id;
		that.loadData();
	},
	methods: {
		loadData: function() {
			that.$request.get("miniOrdersProductService.loadPro",{id: that.id}).then((res)=> {
				//console.log(res)
				that.pro = res.product;
				that.oldExp = res.oaSale;
				that.genImgs();
			})
		},
		genImgs: function() {
			const imgs = that.oldExp?that.oldExp.imgs:'';
			//console.log(imgs)
			const array = imgs.split(",");
			let newImgs = [];
			array.map((item)=> {if(item) {newImgs.push(item);}})
			that.imgs = newImgs;
		},
		addImage: function() {
			//console.log("-------")
			const maxLength = that.maxLength;
			if(that.imgs.length>=maxLength) {
				uni.showToast({
					title: '最多6张照片', icon:'none'
				})
			} else {
				uni.chooseImage({
					sourceType: ["camera", "album"],
					sizeType: "compressed",
					count:maxLength,
				    success: (res) => {
						if(that.imgs.length<maxLength) { //超过长度就不上传
							const tempFilePaths = res.tempFilePaths;
							//console.log(tempFilePaths);
							tempFilePaths.map((path)=>{
								that.uploadFile(path);
							})
						}
				    }
				});
			}
		},
		uploadFile: function(filePath) {
			//const user = common.getLoginUser(); //登录用户ID
			const uploadUrl = urlConfig.baseUrl+"/api/app/upload/productException";
			const uploadTask = uni.uploadFile({
				url: uploadUrl, //仅为示例，非真实的接口地址
				filePath: filePath,
				name: 'files',
				formData: {
					//'customId': user.id,
				},
				success:(uploadRes) => {
					//console.log(uploadRes)
					const obj = JSON.parse(uploadRes.data).data[0];
					//console.log(obj)
					that.imgs = that.imgs.concat(obj);
				}
			});
			uploadTask.onProgressUpdate((res)=> {
				that.uploading = true;
				const precent = res.progress;
				that.precent = precent;
				if(precent>=100) {
					that.uploading = false;
					uni.showToast({
						title: "上传成功", icon:"none"
					})
				}
			})
		},
		inputMessage: function(e) {
			that.message = e.detail.value;
		},
		inputPhone: function(e) {
			that.phone = e.detail.value;
		},
		removeImg: function(img) {
			if(!that.oldExp) {
				uni.showModal({
					title: "删除提示",
					content: '是否删除此照片凭证？',
					success(result) {
						if(result.confirm) {
							that.$request.get("miniOrdersProductService.removeImg",{url: img}).then((res)=> {
								if(res) {
									uni.showToast({title: '删除成功', icon:'none'})
									that.rebuildImg(img);
								}
							})
						}
					}
				})
			}
		},
		rebuildImg: function(img) {
			const imgs = that.imgs;
			let newImg = [];
			imgs.map((item)=> {
				//console.log("------------"+(item!==img))
				if(item!==img) {newImg.push(item)}});
			
			//console.log(newImg)
			that.imgs = newImg;
		},
		onSubmit: function() {
			//console.log("------------submit")
			const msg = that.message;
			const imgs = that.imgs;
			const phone = that.phone;
			if(!phone) {
				uni.showToast({ title: '请输入联系电话', icon: 'none' })
			} else if (!msg) {
				uni.showToast({ title: '请输入售后说明', icon: 'none' })
			} else if(imgs.length<=0) {
				uni.showToast({ title: '请上传凭证', icon: 'none' })
			} else {
				that.canSubmit = false;
				let imgCon = '';
				imgs.map((item, index)=> {imgCon += (item+(index<(imgs.length-1)?",":''))})
				that.$request.get("miniOrdersProductService.add",
				{msg:msg, phone: phone, imgs: imgCon, id: that.id}, {method:'post'}).then((res)=> {
					//console.log(res);
					if(res.flag=='1') {
						uni.showToast({
							title: res.message,icon:'none',
							success() {
								uni.redirectTo({
									url:"/pages/orders/proException?id="+that.id
								})
							}
						})
					} else {
						uni.showToast({
							title: res.message,icon:'none',
							success() {
								that.canSubmit = true;
							}
						})
					}
				})
			}
		}
	},
	components: {extendComponent}
}
</script>

<style>
.exp-status {
	width:calc(100% - 40px); float:left; text-align: center; margin-left: 20px; height: 35px; line-height: 35px;
}	
.exp-status text.status-1 {
	
}

.single-order-pro-view {
	margin-top: 7px; 
}

.pro-exception {
	text-align: right; 
}
.pro-exception .exp-btn {
	border:1px #e5e5e5 solid; width: auto; width:60px; text-align: center; 
	padding: 5px 10px; border-radius: 5px; background:#fafafa; color:#666; margin-right:15px;
}
.single-order-pro {
	display: flex; 
}
.single-order-pro .pro-img {
	width:80px; padding:4px;
}
.single-order-pro .pro-img image {width:80px; height:60px; border:1px #e5e5e5 solid; border-radius: 4px;}
.single-order-pro .pro-content {
	flex: 1; height: 70px; padding-left: 5px;
}
.single-order-pro .pro-content .pro-con-title {
	color:#555; line-height: 19px; font-size:12; 
	width:100%; margin-top: 4px;
	text-overflow: ellipsis;
}
.single-order-pro .pro-content .pro-con-specs {
	color:#aaa; margin-top: 3px;
}
.single-order-pro .pro-content .pro-con-fund text {
	background:#f8dcd1; color:#DE5A29; font-size: 8px; padding:1px 4px; border-radius: 4px;
}

.single-order-pro .pro-price {
	width: auto; text-align: right; padding-right: 8px; padding-left: 5px;
}
.single-order-pro .pro-price .pro-price-val {
	font-size: 12px; color:#aaa;
}
.single-order-pro .pro-price .pro-price-val text {
	font-size:14px; color:#888;
}
.single-order-pro .pro-price .pro-price-amount {
	color:#aaa; font-size:10px;
}
.single-order-pro .pro-price .pro-price-amount text {
	font-size:12px; padding-left: 3px;
}

.exception-info {
	width:calc(100% - 20px); padding:10px;
}
.red {
	color:#F00; padding:0px 4px;
}
.exc-label {
	color:#888; padding-bottom: 5px;
}
.exc-value textarea {
	border:1px #e4e4e4 solid; border-radius: 5px; padding: 5px; line-height: 22px; width:calc(100% - 10px); height: 65px;
}
.exc-value input {
	border:1px #e4e4e4 solid; border-radius: 5px; padding: 5px; line-height: 22px; width:calc(100% - 10px);
}

.add-images-btn {
	border:1px #e4e4e4 dotted; border-radius: 5px; height: 60px; width:60px; text-align: center;
	float:left;
}
.add-images-btn view:first-child {
	margin-top: 15px;
}
.add-images-btn view {
	width:100%; text-align: center; color:#999;
}

.submit-btn-view {
	position: fixed; bottom: 10px; width:calc(100% - 40px); left: 20px; height: 30px; line-height: 30px;
	background:#00B26A; color:#FFF; text-align: center; border-radius: 5px;
}

.image-view-list {
	display: inline; float:left;
}

.single-image {
	width:60px; border-radius: 5px;  height: 60px; margin-right: 8px; margin-bottom: 8px;
	border:1px #e4e4e4 solid; float:left;
}
.single-image image {
	width:60px; height: 60px; border-radius: 5px; 
}
</style>
