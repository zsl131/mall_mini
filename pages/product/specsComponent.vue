<template>
	<scroll-view scroll-y="true" class="specs-main-container" :style="{'height': height+'px', 'overflow':'auto'}">
	<view class="grace-select-tags" >
		<view v-if="!items || items.length<=0" class="amount-exception">
			此产品库存不足，暂时无法选购
		</view>
		<view class="grace-select-tag-single" 
		:style="{width : itemWidth, fontSize:fontSize}" 
		@tap.stop="graceSelectChange(index)" v-for="(item, index) in items" :key="index" 
		:class="[item.id===curId? 'selected-item':'']">
			<view><text class="select-name">{{item.name}}</text><text class="select-price">￥ {{item.price}}</text><text class="select-ori-price">（原价：{{item.oriPrice}}）</text></view>
			<view><text class="select-remark">{{item.remark}}</text>
				<text class="specs-amount">库存【{{rebuildAmount(item.amount)}}】</text>
			</view>
		</view>
		<view class="bottom-opts grace-nowrap">
			<view class="single-opt join-shop grace-flex1" @tap="onOpt('basket')">加入购物车</view>
			<view class="single-opt buy-now grace-flex1" @tap="onOpt('buy')">立即购买</view>
		</view>
	</view>
	</scroll-view>
</template>
<script>
export default {
	props: {
		itemWidth : {type: String, default:"200rpx"},
		type : { type: String, default: ""},
		selectedColor : { type: String, default: "#3688FF"},
		fontSize : { type: String, default: "26rpx"},
		items : { type: Array, default : function(){return []}},
		curId: {type: Number, default: 0},
	},
	created : function(){
		//console.log("------------>")
		//console.log(this.curId);
		this.data = this.items;
		// this.curId = this.defaultId;
		//console.log(this.items);
	},
	data() {
		return {
			data : [],
			height: 100,
			// curId: 0,
		}
	},
	methods:{
		graceSelectChange : function(index){
			for (var i = 0; i < this.items.length; i++){this.items[i].checked = false;}
			this.curId = this.items[index].id;
			this.$emit("change", this.items[index]);
		},
		initData: function(specsList) {
			//console.log(specsList);
			const maxSize = 4, singleHeight = 100;
			let height = 0;
			if(specsList.length<=0) { height = singleHeight+15;} 
			else if (specsList.length<=3) {height = singleHeight * specsList.length + 20;}
			else {height = singleHeight * maxSize;}
			//height += 45;
			this.height = height;
			//console.log("------->height:: "+height)
			//console.log(specsList)
		},
		onOpt: function(action) {
			if(this.checkData()) {
				//console.log("-------------")
				this.$emit("onOpt", action);
			}
		},
		rebuildAmount: function(amount) {
			if(amount<0) {amount = 0;}
			return amount;
		},
		checkData: function() {
			const curId = this.curId;
			if(!curId) {
				uni.showToast({
					title: "请选择规格", icon:"none"
				});
				return false;
			} else {return true;}
		},
	}
}
</script>
<style scoped>
.specs-main-container {
	 overflow: auto; 
}
.grace-select-tags{display:flex; flex-direction:row; flex-wrap:wrap; 
	background:#FFF; position: relative; bottom: 0px; padding-bottom: 60px;
}
.grace-select-tag-single{line-height:60rpx; margin:5px 10rpx; font-size:24rpx; border-radius:8rpx; background:#F6F7F8;}
.grace-select-tag-single view {
	margin-bottom:0px; margin: 8px;
}
.grace-checked{color:#FFFFFF;}
.select-name {color:#333; font-size: 16px; }
.select-remark {color:#aaa; font-size: 12px;}
.select-price {color:#FF0036; font-size: 16px; padding-left: 5px;}
.select-ori-price {color:#aaa; font-size: 12px; padding-left: 5px; text-decoration: line-through;}

.bottom-opts {
	width:100%; height:40px; text-align: center; padding-bottom: 10rpx; position: absolute; bottom: 10px;
}
.single-opt {
	height: 40px; line-height: 40px; border-radius: 20px; text-align: center; font-size: 14px; font-weight: normal;
}
.join-shop {
	margin: 0px 5px 0px 10px; background:#F37B1D;color:#FFF;
}
.buy-now {
	margin: 0px 10px 0px 5px; background:#259B24;color:#FFF;
}

.specs-amount {
	padding-left: 12px; color:#999;
}

.selected-item {background:#e76b61;}
.selected-item .select-name {color:#FFF;}
.selected-item .select-remark {color:#ffb2ac;}
.selected-item .select-price {color:#FF0;}
.selected-item .select-ori-price {color:#ffb2ac;}
.selected-item .specs-amount { color:#FF0; }
.amount-exception {color:#F00; width: 100%; text-align: center; line-height: 45px; font-size: 36rpx;}
</style>