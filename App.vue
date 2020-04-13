<script>
import tools from "@/common/tools.js";
import config from "@/common/config.js";
export default {
	onLaunch: function(options) {
		const agentId = options.query.agentId;
		const sceneId = options.scene;
		/* uni.showToast({
			title: sceneId+"[test]"+agentId, icon:'none'
		}) */
		console.log(agentId, sceneId)
		
		//console.log('App Launch', options);
		/* uni.showModal({
			title: '系统提示',
			content: JSON.stringify(options)
		}) */
		// tools.checkLogin(); //从request中进行检测
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
	},
	onUnload: function() {
		console.log("-- onUnload --")
		uni.removeStorageSync(config.SHAREDER); //退出时清楚分享者信息
	}
}
</script>
<style>
@import "./graceUI/graceIcons.css";
@import "./graceUI/graceUI.css";
@import './common.css';
@import "./style/myIcons.css";
@import './style/public.css';
</style>