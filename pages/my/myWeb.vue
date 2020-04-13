<template>
	<view>
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
var that;
export default {
	data() {
		return {
			src: ''
		}
	},
	onLoad(options) {
		let src = options.src;
		//console.log(src)
		src = decodeURI(src);
		//console.log(src);
		that = this;
		this.src = src;
	},
	methods: {
		
	}
}
</script>

<style>

</style>
