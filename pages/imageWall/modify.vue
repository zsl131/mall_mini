<template>
	<view>
		<graceHeader background="#373840">
			<!-- 搜索组件宽度自适应于外层 -->
			<view class="grace-header-body grace-nowrap">
				<!-- 返回按钮 -->
				<view class="icons grace-icons icon-arrow-left grace-white" @tap="gotoBack" style="font-size:44rpx;"></view>
				<view class="grace-flex1" style="text-align: left;">
					<view class="publish-btn" @tap="onPublish">发布</view>
				</view>
			</view>
		</graceHeader>
		<view class="image-main-view" v-if="image && image.id">
			<!-- <view class="publish-btn" @tap="onPublish">发布</view> -->
			<image v-if="image.fileType=='1'" :src="image.url" mode="widthFix"/>
			<video :id="image.id" v-if="image.fileType=='2'" :src="image.url" objectFit="cover" controls></video>
			<view class="title-view">
				<input class="title-input" placeholder-class="title-input-placeholder" @input="onInput" maxlength="40" placeholder="请输入标题..."/>
			</view>
		</view>
	</view>
</template>

<script>
var that;
import graceHeader from '@/graceUI/components/graceHeader.vue';
export default {
	data() {
		return {
			id: 0,
			image:{},
			title: '',
		}
	},
	onLoad(options) {
		that = this;
		that.id = options.id;
		//console.log(options)
		that.loadData();
	},
	methods: {
		loadData: function() {
			that.$request.get("miniImageWallService.loadOne", {id: that.id}).then((res)=> {
				console.log(res)
				that.image = res.image;
			});
		},
		onInput: function(e) {
			//console.log(e.detail.value)
			that.title = e.detail.value;
		},
		onPublish: function() {
			const title = that.title;
			if(!title) {
				uni.showToast({
					title: '请输入标题', icon:'none'
				})
			} else {
				console.log(that.title)	
				that.$request.get("miniImageWallService.modify", {id: that.id, title: that.title}).then((res)=> {
					uni.showToast({
						title: '发布成功', icon:'none',
					});
					uni.switchTab({
						url:"./index"
					})
				});
			}
		},
		gotoBack: function() {
			uni.navigateBack();
		}
	},
	components: {
		graceHeader
	}
}
</script>

<style>
.image-main-view {
	height:calc(100vh - 60px); width:100vw;
	display:flex;
	justify-content:center;
	
	display: table-cell;
    vertical-align:middle;
	background:#373840;
}
.image-main-view image {
	width:100%;
}
.image-main-view video {
	width:100%;
}
.title-view {
	width:100%; padding: 0px 20px; position: fixed; bottom: 00px; z-index: 10; background:#000000;opacity:0.2;
}
.title-input {
	width: 80%; padding:10px; text-align:center; font-size: 16px;
	color:#FFFFFF; text-shadow: #000 1px 0 0, #000 0 1px 0, #000 -1px 0 0, #000 0 -1px 0; color:#FFF;
}
.title-view .title-input-placeholder {
	/* text-shadow: #000 1px 0 0, #000 0 1px 0, #000 -1px 0 0, #000 0 -1px 0; color:#aaa; */
}

/* .publish-btn {
	position: fixed; top: 10px; right: 10px;
	height: 30px; line-height: 30px; padding:0px 12px; background:#ff7800; color:#FFF; border-radius: 5px;
} */
.publish-btn {
	text-align: center; width: 50px;
	height: 30px; line-height: 30px; padding:0px 12px; background:#ff7800; color:#FFF; border-radius: 5px;
}
</style>
