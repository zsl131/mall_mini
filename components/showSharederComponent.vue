<template>
	<view class="share-main-view" v-if="show">
		<view><image :src="shareder.headImgUrl" mode="aspectFit" class="head-img"/></view>
		<view class="content">好友<text>【{{shareder.name?shareder.name:shareder.nickname}}】</text>真心向您推荐</view>
	</view>
</template>

<script>
var that;
import config from "@/common/config.js";
import sharederTools from "@/common/sharederTools.js";
export default {
	props: {
	},
	data() {
		return {
			show: false,
			shareder: {}, //分享者
		};
	},
	created() {
		that = this;
	},
	methods: {
		loadShareder: function(id) {
			//console.log("---------->",id)
			const curCustom = uni.getStorageSync(config.CUR_CUSTOM);
			//console.log(curCustom, "----------")
			if(id) {
				//if(curCustom) {
				that.$request.get("customerService.loadOne",{id:id}).then((res)=> {
					//console.log(res)
					if(res.obj) { //获取到分享者就将其存入Session中
						let obj = res.obj;
						obj.timeout = 3600*2; //2小时
						const date = new Date();
						obj.startTime = parseInt(date.getTime()/1000);
						uni.setStorageSync(config.SHAREDER, obj);
						that.shareder = obj;
						that.show = true;
					}
				});
				//}
			} else {
				const obj = sharederTools.loadShare();
				//console.log("=============")
				if(obj) {that.shareder = obj; that.show = true;}
			}
			//console.log("--------", id)
		},
	}
}
</script>

<style>
.share-main-view {
	width:100%; height:40px; line-height: 40px; background:#e8e8e8;
	box-shadow: 0px 5px 5px #ddd;
	display: flex;
}
.share-main-view image {
	width: 30px; height:30px; border-radius: 30px; margin: 5px ;
}
.share-main-view .content {
	flex: 1; line-height: 40px;
}
.share-main-view .content text {
	color:#F00;
}

</style>
