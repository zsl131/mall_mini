<template>
	<view class="banner-view-main">
		<view class="single-banner-view" v-for="(item, index) in items" 
		@tap="onClick(item)" :key="index">
			<view class="value">{{item.amount}}</view>
			<view class="name">{{item.name}}</view>
		</view>
	</view>
</template>
<script>
export default{
	props:{
		items : {
			type : Array,
			default : function () {
				return new Array()
			}
		},
	},
	methods:{
		onClick:function (e) {
			// console.log(e)
			this.$emit('onClick', e);
		}
	}
}
</script>
<style scoped>
.banner-view-main {
	display: flex; background:#FFF;
}
.single-banner-view {
	flex: 1;
}
.single-banner-view view {
	width:100%; text-align: center; 
}
.single-banner-view view.value {
	color:#333; font-size:16px; padding-top:9px;
}
.single-banner-view view.name {
	color:#999; padding-bottom: 9px;
}
</style>
