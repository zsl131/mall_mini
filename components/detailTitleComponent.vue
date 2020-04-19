<template>
	<view class="detail-main-content" :style="{background:background}">
		<view class="detail-line"></view>
		<view class="detail-title" :style="{background:background}">{{title}}</view>
	</view>
</template>

<script>
	export default {
		props: {
			title:{
				type : String,
				default : "详情"
			},
			background: {
				type: String, 
				default: '#F8F8F8'
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style>
.detail-main-content {
	width:100%; height: 30px; text-align: center; position: relative;
}
.detail-line {
	position: absolute; border-top: 1px #DFDFDF solid; font-size: 1px; line-height: 1px; width: 60%; left: 20%; top: 15px;
}
.detail-title {
	position: absolute; font-size: 12px; width: 40%; left:30%; top:0px; height: 30px; line-height: 30px; overflow: hidden; color:#8E8E8E;
}
</style>
