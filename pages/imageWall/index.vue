<template>
	<view>
		<graceHeader background="#34CD6D">
			<!-- 搜索组件宽度自适应于外层 -->
			<view class="grace-header-body grace-nowrap">
				<view class="opt-btns-view" v-if="((type=='1' || type=='2') && !uploading)">
					<view @tap="addFile('1')" class="flex1 upload-picture-btn">+ 图片</view>
					<view @tap="addFile('2')" class="flex1 upload-video-btn">+ 视频</view>
				</view>
			</view>
		</graceHeader>
		<scroll-view scroll-y="true" refresher-enabled="true" @scrolltolower="onPage" class="main-view" >
			<view v-for="(image, index) in imageList" :key="index" class="single-image-view">
				<view class="single-image-view-content">
				<image v-if="image.fileType=='1'" :src="image.url" mode="widthFix"/>
				<video :id="image.id" v-if="image.fileType=='2'" :src="image.url" objectFit="cover" controls></video>
				<view class="single-image-content">
					<view class="head-party">
						<view class="head-img"><image :src="image.headImgUrl" mode="aspectFit"/></view>
						<view class="head-title">
							<view class="nickname">{{image.customNickname}}</view>
							<view class="title">{{image.title}}</view>
						</view>
					</view>
					<view class="heart-party" @tap="onHeart(image.id)">
						<image src="../../static/heart-red.png" mode="aspectFit"/>
						<view class="heart-count">{{image.goodCount}}</view>
					</view>
				</view>
				</view>
			</view>
			<view class="more-view">
				<view v-if="canPage">加载中...</view>
				<view v-if="!canPage">这就是底线</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
var that;
import urlConfig from "@/common/config.js";
import common from "@/common/common.js";
import graceHeader from '@/graceUI/components/graceHeader.vue';
export default {
	data() {
		return {
			type: '',
			imageList:[],
			
			precent: 0, 
			uploading: false,
			noFinished: {}, //未完成的对象
			
			page: 0, 
			canPage: true,
			size: 15,
		}
	},
	onLoad() {
		that = this;
		that.loadData(false);
	},
	methods: {
		onPage: function(e) {
			//console.log("--------", e)
			that.loadData(true);
		},
		loadData: function(isAppend) {
			if(that.canPage) {
				that.$request.get("miniImageWallService.listShow", {page: that.page, size: that.size}).then((res) => {
					that.type = res.type;
					if(isAppend) {
						that.imageList = that.imageList.concat(res.imageList);
					} else {
						that.imageList = res.imageList;
					}
					const noFinishedList = res.noFinished;
					if(noFinishedList!=null && noFinishedList.length>0) {
						that.noFinished = noFinishedList[0];
						uni.navigateTo({
							url: "./modify?id="+that.noFinished.id
						})
					}
					//console.log(res);
					if(res.imageList.length<that.size) {
						that.canPage = false;
					} else {
						that.page = that.page + 1;
					}
				})
			}
		},
		rebuildData: function(id, count) {
			that.imageList.map((item)=> {
				if(item.id===id) {item.goodCount = item.goodCount+count;}
			})
		},
		onHeart: function(id) {
			//console.log(id)
			that.$request.get("miniImageWallService.plusGoodCount", {id: id, count:1}).then((res)=> {
				//console.log(res);
				uni.showToast({
					title: res.message, icon:'none'
				});
				that.rebuildData(id, 1);
			});
		},
		addFile: function(flag) {
			//console.log("-------")
			if(flag=='1') { //图片
				uni.chooseImage({
					sourceType: ["camera", "album"],
					sizeType: "compressed",
					count:1,
				    success: (res) => {
				        const tempFilePaths = res.tempFilePaths;
						//console.log(tempFilePaths);
						tempFilePaths.map((path)=>{
							that.uploadFile(path);
						})
				    }
				});
			} else if(flag=='2') { //视频
				uni.chooseVideo({
					success: (res) => {
						const path = res.tempFilePath;
						//console.log(path);
						that.uploadFile(path);
					}
				})
			}
		},
		uploadFile: function(filePath) {
			const user = common.getLoginUser(); //登录用户ID
			const uploadUrl = urlConfig.baseUrl+"/api/app/upload/normal";
			const uploadTask = uni.uploadFile({
				url: uploadUrl, //仅为示例，非真实的接口地址
				filePath: filePath,
				name: 'files',
				formData: {
					'customId': user.id,
				},
				success:(uploadRes) => {
					//console.log(uploadRes)
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
					let pages = this.getCurrentPages();
					let page = pages[pages.length - 1];
					page.onLoad()
				}
			})
		},
	},
	components: {graceHeader}
}
</script>

<style>
.main-view {
	width:100%; background:#ecedf2; height: 100vh;
}
.single-image-view {
	margin:18px 10px;
}
.single-image-view-content {
	width: 100%;
}
.single-image-view-content image, .single-image-view-content video {
	width:100%; border-radius: 10px 10px 0px 0px; margin:0px;
}
.single-image-content {
	background:#FFF; border-radius: 0px 0px 10px 10px;
	box-shadow: 6px 6px 6px #ddd; margin-top: -5px;
	min-height: 50px; display: flex;
}
.head-party {
	flex: 1; display: flex;
}
.head-img {
	width: 60px; height: 60px;
}
.head-img image {
	width:35px; height:35px; border-radius: 35px; margin:12px;
	box-shadow: 3px 3px 5px #ddd; border:1px #ddd solid;
}
.head-title {
	flex: 1;
}
.head-title .nickname {
	font-size: 12px; color:#888; margin-top: 12px;
}
.head-title .title {
	font-size: 12px; color:#333; line-height: 25px; height: 25px; overflow: hidden; overflow-wrap: break-word;
}
.heart-party {
	width:40px; text-align: center;
}
.heart-party image {
	width: 20px; height: 20px; margin-top:12px;
}
.heart-party .heart-count {
	width:100%; text-align: center; color:#666;
}

.text-content-view {
	position: fixed; bottom: 0px; left: 0px; width:100vw;
}
.opt-btns-view {
	display: flex; margin-left: 10px; height: 30px; padding: 0px 10px; border-radius: 20px; margin-top: 6px;
	color:#FFF;
	background:#ff7800; 
}
.opt-btns-view view {
	flex: 1; height: 16px; line-height: 16px; margin-top: 7px;
}
.upload-picture-btn {
	/* text-align: left; padding-left:10px;
	font-size: 14px; text-shadow: #000 1px 0 0, #000 0 1px 0, #000 -1px 0 0, #000 0 -1px 0; color:#FFF;
	letter-spacing: 2px; */
	/* background:# */
	padding-right: 7px; border-right: 1px #f7a154 solid;
}
.show-custom {
	text-align: center;
}
.upload-video-btn {
	/* text-align: right; padding-right: 10px; 
	font-size: 14px; text-shadow: #000 1px 0 0, #000 0 1px 0, #000 -1px 0 0, #000 0 -1px 0; color:#FFF;
	letter-spacing: 2px; */
	padding-left: 7px;
}

.more-view view {
	width: 100%; text-align: center; color:#aaa; padding-bottom: 15px;
}

</style>
