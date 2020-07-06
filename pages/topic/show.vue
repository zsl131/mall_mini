<template>
	<view>
	<view v-if="topic && topic.id" class="topic-main">
		<view class="topic-title">{{topic.title}}</view>
		<view class="topic-date">{{topic.updateTime}}</view>
		<view class="topic-content" v-html="content"></view>
	</view>
	<view v-if="!topic || !topic.id" style="padding-top: 30px;">
		<emptyComponent message="没有发现你查询的内容"></emptyComponent>
	</view>
	</view>
</template>

<script>
var that;
import emptyComponent from '@/components/emptyComponent.vue';
export default {
	data() {
		return {
			type: '', //类型，id、sn即可以通过这两个属性获取对象
			id: 0, //id
			sn: '', //
			topic: {}, //文章信息
			content: '', //文章内容
		}
	},
	onLoad(options) {
		that = this;
		that.type = options.type;
		that.id = options.id;
		that.sn = options.sn;
		//console.log(options)
		that.loadData();
	},
	methods: {
		loadData: function() {
			that.$request.get("miniTopicService.show", {type: that.type, id: that.id, sn: that.sn})
			.then((res)=> {
				//console.log(res);
				that.topic = res.topic;
				that.rebuildContent(that.topic.content);
			});
		},
		rebuildContent: function(con) { //重新设置html内容
			const oldStr = '<img id="xxx"';
			while(con.indexOf(oldStr)>=0) {
				con = con.replace(oldStr, '<img style="max-width:100%;" ');
			}
			that.content = con;
		},
	},
	components: {emptyComponent}
}
</script>

<style>
.topic-main {
	padding: 10px; width: calc(100% - 20px);
}
.topic-title {
	color:#555; font-size: 16px;
}
.topic-date {
	color:#aaa; font-size: 10px; border-bottom: 1px #e8e8e8 solid; width:100%; padding-bottom: 10px; margin-top: 10px;
}
.topic-content {
	line-height: 30px; color:#666; font-size: 16px; font-weight: normal; padding: 10px 0px 20px 0px;
}
</style>
