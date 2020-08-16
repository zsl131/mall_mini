<template>
	<view>
		<gracePage headerBG="#f8f8f8" :customHeader="false" style="min-height: 100vh; background:#f8f8f8;">
			<view slot="gBody" class="grace-body" style="background:#f8f8f8;">
				
				<view class="SegmentedControlIn" style="margin-top: 10px;">
					<segmentedControl :items="cates" :current="type" @change="onTypeChange"
						bgColor="#f0f0f0" color="#F37B1D"></segmentedControl>
				</view>
				
				<!-- 购物车为空 -->
				<view v-if="orders.length < 1" style="margin-top:100px;">
					<emptyCompent optMsg="去剁手" message="居然一个订单都没有~" @onClick="gotoIndex"></emptyCompent>
				</view>
				<view class="orders-view">
					<view class="single-orders-view" v-for="(order, index1) in orders" :key="index1">
						<view class="order-title" @tap="gotoShow(order.orders.id)">
							<view class="order-create">{{order.orders.createTime}}</view>
							<view :class="[getStatusCls(order.orders.status), 'order-status']">{{getStatus(order.orders.status)}}</view>
						</view>
						<view class="single-order-pro" @tap="gotoShow(order.orders.id)" v-for="(pro, index2) in order.productList" :key="index2">
							<view class="pro-img"><image mode="aspectFit" :src="pro.proImg"/></view>
							<view class="pro-content">
								<view class="pro-con-title">{{pro.proTitle}}</view>
								<view class="pro-con-specs">{{pro.specsName}}</view>
								<view class="pro-con-fund" v-if="pro.fund>0"><text>公益捐款{{pro.fund}}元</text></view>
							</view>
							<view class="pro-price">
								<view class="pro-price-val">￥ <text>{{pro.price}}</text></view>
								<view class="pro-price-amount">x <text>{{pro.amount}}</text></view>
							</view>
						</view>
						<view class="orders-amount-view">
							<text class="amount">共{{order.orders.totalCount}}件商品</text>
							<text class="money">合计：￥<text>{{order.orders.totalMoney}}</text></text>
						</view>
						<view v-if="order.orders.remark" class="orders-remark-view">
							PS:{{order.orders.remark}}
						</view>
						<view class="orders-opts">
							<button size="mini" @tap="onOpt('-10', order.orders.ordersNo, order.orders.id)" type="default" v-if="order.orders.status=='0' || order.orders.status=='-1'" class="orders-opt">删除</button>
							<button size="mini" @tap="onOpt('0', order.orders.ordersNo, order.orders.id)" type="warn" v-if="order.orders.status=='0'" class="orders-opt">付款</button>
							<button size="mini" @tap="onOpt('1', order.orders.ordersNo, order.orders.id)" v-if="order.orders.status=='1'" class="orders-opt">提醒发货</button>
							<!-- 申请中和申请通过的都不能再申请 -->
							<button size="mini" @tap="onOpt('-5', order.orders.ordersNo, order.orders.id)" v-if="order.orders.status=='1' && (order.orders.refundFlag!='2'&&order.orders.refundFlag!='1') " class="orders-opt">申请退款</button>
							<button size="mini" @tap="onOpt('-1', order.orders.ordersNo, order.orders.id)" type="default" v-if="order.orders.status=='2'" class="orders-opt">物流信息</button>
							<button size="mini" @tap="onOpt('2', order.orders.ordersNo, order.orders.id)" type="primary" v-if="order.orders.status=='2'" class="orders-opt">确认收货</button>
							<button size="mini" @tap="onOpt('3', order.orders.ordersNo, order.orders.id)" type="default" v-if="order.orders.status=='3'" class="orders-opt">评价</button>
							<view v-if="order.orders.status=='4'" class="orders-opt opt-gopay">订单已完成</view>
						</view>
						<view v-if="order.orders.refundFlag=='1'" class="orders-refund">已申请退款，等待审核</view>
						<view v-if="order.orders.refundFlag=='-1'" class="orders-refund">退款申请被驳回：{{order.orders.refundVerifyReason}}</view>
					</view>
				</view>
				<view class="grace-margin-top grace-text-center">
					<text class="grace-text zsl-loadmore-text">{{bottomMsg}}</text>
				</view>
				<graceLoading :loadingType="loadingType"></graceLoading>
			</view>
		</gracePage>
		
		<graceDialog :show="showComment" title="点评">
			<view slot="content">
				<commentComponent :ordersNo="commentOrdersNo" @cancel="onCancel" @ok="onOk"/>
			</view>
		</graceDialog>
		
		<graceDialog :show="showRefund" title="退款申请">
			<view slot="content">
				<refundComponent :reasonList="reasonList" :ordersNo="ordersNo" @cancel="onCancelRefund" @ok="onOkRefund"/>
			</view>
		</graceDialog>
	</view>
</template>

<script>
var that;
import gracePage from "@/graceUI/components/gracePage.vue";
import graceLoading from '@/graceUI/components/graceLoading.vue';
import segmentedControl from '@/components/segmentedControl.vue';
import emptyCompent from "@/components/emptyComponent.vue";
import graceDialog from '@/graceUI/components/graceDialog.vue';
import commentComponent from "./commentComponent.vue";
import refundComponent from "./refundComponent.vue";
import payTools from '@/common/payTools.js';
import common from "@/common/common.js";
export default {
	data() {
		return {
			cates : ["全部", "待付款", "待发货", "待确认", "待评价"],
			type: 0,
			page: 0,
			orders: [], //订单列表
			ordersNo:'',
			pageSize: 10,
			bottomMsg: '上划加载更多 ^_^',
			canPage: true,
			loadingType: '3',
			append: true,
			showComment: false,
			showRefund: false,
			commentOrdersNo:0,
			
			commented:[], //已经点评的订单
			reasonList: [], //原因列表
		}
	},
	onLoad(options) {
		that = this;
		let type = options.type;
		if(!type) {type = 0;}
		that.type = type;
		that.loadData();
	},
	onReachBottom: function() {
		//避免多次触发
		//console.log("----->", this.loadingType)
		if (this.loadingType == 1 || this.loadingType == 2){return ;}
		this.loadMoreFunc();
	},
	methods: {
		buildStatus:function(type) {
			let status = '';
			if(type=='1') {status = '0';}
			else if(type=='2') {status='1';}
			else if(type=='3') {status='2';}
			else if(type=='4') {status='3';}
			return status;
		},
		onCancel: function() {
			//console.log("---")
			this.showComment = false;
		},
		onCancelRefund: function() {this.showRefund = false;},
		onOkRefund: function(ordersNo, reason) {
			console.log(ordersNo, reason)
			uni.showModal({
				title: "系统提示",
				content:"确定申请退款吗？申请后需要等待客服审核！",
				mask: true,
				success: function(res) {
					if(res.confirm) {
						that.onCancelRefund(); //先关闭窗口
						payTools.refundOrders(ordersNo, reason).then((res)=> {
							common.reloadPage("../orders/listOrders"); //刷新当前页面
						})
					}
				}
			})
		},
		onOk: function(value) {
			let commented = that.commented;
			commented.push(value);
			that.commented = commented;
			//console.log(value)
			that.showComment = false;
		},
		loadData: function() {
			if(that.canPage) {
				that.$request.get("miniOrdersService.listOrders", {page: that.page, status: that.buildStatus(that.type), 
				size: that.pageSize}).then((res)=> {
					//console.log(res);
					const data = res.data;
					if(that.append) {
						that.orders = that.orders.concat(data);
					} else {that.orders = data;}
					// that.productList = that.productList.concat(data);
					//that.rebuildData(data);
					if(data.length>=that.pageSize) {that.canPage = true;}
					else {that.canPage = false; that.bottomMsg = "我也是有底线的";}
					that.page = that.page + 1;
					that.append = true;
				})
			}
		},
		loadMoreFunc: function(e) {
			//console.log(e);
			that.loadData();
		},
		onTypeChange: function(e) {
			that.type = e;
			that.page = 0;
			that.canPage = true;
			that.append = false;
			that.loadData();
		},
		gotoIndex: function() {
			uni.switchTab({
				url:"../index/index"
			})
		},
		getStatusCls: function(status) {
			let cls = 'status-default'; //默认值，即未付款
			if(status=='1') {cls = 'status-payed';} //已付款
			else if(status=='2') {cls = 'status-sended';} //已发货
			else if(status=='3') {cls = 'status-reply';} //需评价
			else if(status=='4') {cls = "status-end"; } //已完成
			else if(status=='-1') {cls = "status-canceled";} //闭关
			else if(status=='-2') {cls = "status-saled";} //有售后
			else if(status=='-10') {cls = "status-saled";} //已删除
			return cls;
		},
		getStatus: function(status) {
			let res = "未付款";
			if(status=='1') {res = '已付款';}
			else if(status=='2') {res = '已发货';}
			else if(status=='3') {res = '待评价';}
			else if(status=='4') {res = '已完成';}
			else if(status=='-1') {res = "已关闭";}
			else if(status=='-2') {res = "有售后";}
			else if(status=='-10') {res = "已删除";}
			return res;
		},
		onOpt: function(status, ordersNo, id) {
			//console.log("------status:"+status)
			//common.reloadPage();
			if(status=='0') { //支付
				payTools.payByOrdersNo(ordersNo).then((res)=> {
					//console.log(res);
					common.reloadPage('../orders/listOrders');
				})
			} else if(status=='1') { //崔单
				payTools.noticeOrders(ordersNo);
			} else if(status=='-1') { //查物流
				uni.navigateTo({
					url:"./showExpress?id="+id
				})
			} else if(status=='2') { //确认收货
				uni.showModal({
					title: "系统提示",
					content:"是否已确认收货？",
					success: function(res) {
						if(res.confirm) {
							payTools.confirmOrders(ordersNo).then((res)=> {
								common.reloadPage("../orders/listOrders"); //刷新当前页面
							})
						}
					}
				})
			} else if(status=='-5') { //申请退款
				that.$request.get("refundReasonService.listNoPage", {}).then((res)=> {
					//console.log(res);
					// const reasonList = res.reasonList;
					let reasonList = ["请选择退款原因"];
					res.reasonList.map((item)=> {reasonList.push(item.reason)});
					that.reasonList = reasonList;
					that.showRefund = true;
					that.ordersNo = ordersNo;
					//console.log(reasonList);
				})
			} else if(status=='-10') { //删除订单
				uni.showModal({
					title: "系统提示",
					content:"是否要删除此订单？",
					mask: true,
					success: function(res) {
						if(res.confirm) {
							payTools.removeOrders(ordersNo).then((res)=> {
								common.reloadPage("../orders/listOrders"); //刷新当前页面
							})
						}
					}
				})
			} else if(status=='3') { //评价
				if(that.commented.includes(ordersNo)) {
					uni.showToast({
						title: '不可重复点评', icon:'none'
					})
				} else {
					that.commentOrdersNo = ordersNo;
					that.showComment = true;
				}
			}
		},
		
		gotoShow: function(id) {
			uni.navigateTo({
				url:"./show?id="+id
			})
		}
	},
	components: {
		gracePage,
		graceLoading,
		segmentedControl,
		emptyCompent,
		graceDialog,
		commentComponent,refundComponent,
	}
}
</script>

<style>
.orders-view {
	width:100%;
}
.single-orders-view {
	width:100%; background:#ffffff; margin-top:12px; border-radius: 5px;
}

.order-title {
	width:100%; height: 35px; line-height: 35px; display: flex;
}
.order-title .order-create {
	flex: 1; text-align: left; padding-left: 10px; color:#777;
}
.order-title .order-status {
	width: 50px; text-align: right; padding-right: 8px;
}
.order-title .status-default {
	color:#F00;
}
.order-title .status-payed {
	 color:#F37B1D;
}
.order-title .status-sended {
	color:#1F9609;
}
.order-title .status-end {
	color:#333333;
}
.order-title .status-canceled {
	color:#888888;
}
.order-title .status-saled {
	color:#E17F00;
}

.single-order-pro {
	display: flex; margin-top: 7px; padding-bottom: 12px;
}
.single-order-pro .pro-img {
	width:80px; padding:4px;
}
.single-order-pro .pro-img image {width:80px; height:60px; border:1px #e5e5e5 solid; border-radius: 4px;}
.single-order-pro .pro-content {
	flex: 1; height: 70px; padding-left: 5px;
}
.single-order-pro .pro-content .pro-con-title {
	color:#555; line-height: 19px; font-size:12; 
	width:100%; margin-top: 4px;
	text-overflow: ellipsis;
}
.single-order-pro .pro-content .pro-con-specs {
	color:#aaa; margin-top: 3px;
}
.single-order-pro .pro-content .pro-con-fund text {
	background:#f8dcd1; color:#DE5A29; font-size: 8px; padding:1px 4px; border-radius: 4px;
}

.single-order-pro .pro-price {
	width: auto; text-align: right; padding-right: 8px; padding-left: 5px;
}
.single-order-pro .pro-price .pro-price-val {
	font-size: 12px; color:#aaa;
}
.single-order-pro .pro-price .pro-price-val text {
	font-size:14px; color:#888;
}
.single-order-pro .pro-price .pro-price-amount {
	color:#aaa; font-size:10px;
}
.single-order-pro .pro-price .pro-price-amount text {
	font-size:12px; padding-left: 3px;
}

.orders-amount-view {
	width:100%; text-align: right; 
}
.orders-amount-view text {
	padding-left: 5px; font-size:12px; color:#555;
}
.orders-amount-view text.money text {
	font-size: 14px; margin-right: 12px;
}

.orders-opts {
	width: 100%; text-align: right; padding: 10px 0px;
}
.orders-opts .orders-opt {
	height: 28px; line-height: 28px; text-align: center; width:auto; padding:0px 12px; margin-right:15px;
	
}
.orders-remark-view {
	padding: 5px 10px; color:#777;
}
.orders-refund {
	padding: 5px 10px; text-align: right; color:#F00; 
}

</style>
