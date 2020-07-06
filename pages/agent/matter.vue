<template>
	<view class="main-view">
		<view class="single-data" v-for="(item, index) in list" :key="index">
			<view class="data"><text class="label">店名：</text>{{item.shopName}}</view>
			<view class="data"><text class="label">电话：</text>{{item.phone}}</view>
			<view class="data"><text class="label">邮箱：</text>{{item.email}}</view>
			<view class="data"><text class="label">备注：</text>{{item.remark}}</view>
			<view class="operate">
				<view class="current-status"><text class="label">状态：</text>
					{{item.status=='0'?"待审":"审核通过"}}
				</view>
				<view class="remove-opt" @tap="deleteObj(item.id)">删除</view>
			</view>
		</view>
		<view class="add-opt">
			<button type="warn" @tap="addMatterOpt">申请物料</button>
		</view>
	</view>
</template>

<script>
var that;
export default {
	data() {
		return {
			list:[], //申请记录
			formData:{}, //
		}
	},
	onLoad() {
		that = this;
		that.loadData();
	},
	methods: {
		loadData: function() {
			that.$request.get("miniMatterService.index", {}).then((res)=> {
				//console.log(res);
				that.list = res.list;
				if(that.list.length<=0) {
					that.addMatterOpt();
				}
			})
		},
		addMatterOpt: function() {
			uni.navigateTo({
				url: "./addMatter"
			})
		},
		deleteObj: function(id) {
			uni.showModal({
				title: "系统提示",
				content: "确定删除此申请吗？",
				success(result) {
					if(result.confirm) {
						that.$request.get("miniMatterService.delete", {id:id}).then((res)=> {
							uni.showToast({
								title: res.message, icon: 'none'
							})
							if(res.flag=='1') {
								that.rebuildData(id);
							}
						})
					}
				}
			})
		},
		rebuildData: function(id) {
			const list = that.list;
			let newList = [];
			list.map((item)=> {if(item.id!=id) {newList.push(item);}})
			that.list = newList;
		}
	}
}
</script>

<style>
.main-view {
	width: calc(100% - 20px); padding: 10px;
}
.single-data {
	width: calc(100% - 20px); padding: 10px; border:1px #ddd solid; border-radius: 10px; box-shadow: 0px 0px 6px #ddd;
	margin-bottom: 15px;
}
.single-data .data {
	line-height: 25px; font-size: 12px;
}
.single-data .data .label {
	color:#999;
}
.operate {
	display: flex; border-top: 1px #ddd solid; font-size: 14px; margin-top: 10px;
}
.operate view {
	text-align: center; flex: 1; line-height: 40px; margin-top: 10px;
}
.operate view:first-child {
	border-right: 1px #ddd solid;
}
</style>
