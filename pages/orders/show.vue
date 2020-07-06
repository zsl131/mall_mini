<template>
	<view class="show-main-view" v-if="orders && orders.id">
		<!-- <view class="recommend-extend-view" @tap="togoExtend">点击关注“满山晴”公众号，接收物流信息</view> -->
		<extendComponent msg="物流"></extendComponent>
		<view class="orders-address-view"><text class="label">收件人：</text>{{orders.addressCon}}</view>
		<view class="orders-view">
			<view class="single-orders-view">
				<view class="order-title">
					<view class="order-create">{{orders.createTime}}</view>
					<view :class="[getStatusCls(orders.status), 'order-status']">{{getStatus(orders.status)}}</view>
				</view>
				<view class="single-order-pro-view" v-for="(pro, index2) in proList" :key="index2">
					<view class="single-order-pro">
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
					<view class="pro-exception" v-if="orders.status=='2' || orders.status=='3'"><text class="exp-btn" @tap="onExcep(orders.ordersNo, pro.id)">申请售后</text></view>
				</view>
				<view class="orders-amount-view">
					<text class="amount">共{{orders.totalCount}}件商品</text>
					<text class="discount" v-if="orders.discountMoney && orders.discountMoney>0">，优惠：{{orders.discountMoney}} 元</text>
					<text class="money">，合计：￥<text v-if="orders.discountMoney && orders.discountMoney>0">{{orders.totalMoney-orders.discountMoney}}</text><text v-if="!orders.discountMoney || orders.discountMoney<=0">{{orders.totalMoney}}</text> 元</text>
				</view>
				<view v-if="orders.remark" class="orders-remark-view">
					PS:{{orders.remark}}
				</view>
				<view class="orders-opts">
					<button size="mini" @tap="onOpt('0', orders.ordersNo, orders.id)" type="warn" v-if="orders.status=='0'" class="orders-opt">付款</button>
					<button size="mini" @tap="onOpt('1', orders.ordersNo, orders.id)" v-if="orders.status=='1'" class="orders-opt">提醒发货</button>
					<button size="mini" @tap="onOpt('-1', orders.ordersNo, orders.id)" type="default" v-if="orders.status=='2'" class="orders-opt">物流信息</button>
					<button size="mini" @tap="onOpt('2', orders.ordersNo, orders.id)" type="primary" v-if="orders.status=='2'" class="orders-opt">确认收货</button>
					<button size="mini" @tap="onOpt('3', orders.ordersNo, orders.id)" type="default" v-if="orders.status=='3'" class="orders-opt">评价</button>
					<view v-if="orders.status=='4'" class="orders-opt opt-gopay">订单已完成</view>
				</view>
			</view>
		</view>
		
		<view class="recommend-line">
			<text>猜你喜欢</text>
		</view>
		
		<view class="recommend-pro-view">
			<ProductListComponent disableTitle="true" titleIcon="icon-shuiguopingguo" titleName="精品推荐" :proList="recommendList"/>
		</view>
		
		<graceDialog :show="showComment" title="点评">
			<view slot="content">
				<commentComponent :ordersNo="commentOrdersNo" @cancel="onCancel" @ok="onOk"/>
			</view>
		</graceDialog>
	</view>
</template>

<script>
var that;
import payTools from '@/common/payTools.js';
import common from "@/common/common.js";
import graceDialog from '@/graceUI/components/graceDialog.vue';
import commentComponent from "./commentComponent.vue";
import ProductListComponent from "../index/ProductListComponent.vue";
import extendComponent from "../my/extendComponent.vue"
export default {
	data() {
		return {
			id: 0,
			orders:{},
			proList:[],
			recommendList:[], //推荐产品
			
			showComment: false,
			commentOrdersNo:0,
			
			commented:[], //已经点评的订单
		}
	},
	onLoad(options) {
		//console.log(options);
		this.id = options.id;
		that = this;
		that.loadData();
	},
	methods: {
		loadData: function() {
			that.$request.get("miniOrdersService.loadOne", {id: that.id}).then((res)=> {
				//console.log(res);
				that.orders = res.orders;
				that.proList = res.proList;
				that.recommendList = res.recommendList;
			})
		},
		onExcep: function(ordersNo, proId) {
			console.log(ordersNo, proId)
			uni.navigateTo({
				url: "./proException?id="+proId
			})
		},
		onCancel: function() {
			//console.log("---")
			this.showComment = false;
		},
		onOk: function(value) {
			let commented = that.commented;
			commented.push(value);
			that.commented = commented;
			//console.log(value)
			that.showComment = false;
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
			if(status=='-2') { //售后
				
			} else if(status=='0') { //支付
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
								common.reloadPage("../orders/show?id="+id); //刷新当前页面
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
		
	},
	components: {
		ProductListComponent,
		graceDialog,commentComponent,
		extendComponent
	}
}
</script>

<style>
.show-main-view {
	min-height: calc(100vh - 20px); background:#f8f8f8; padding:10px;
}

.orders-address-view {
	background:#FFF; margin-bottom: 10px; border-radius:6px; padding: 10px; color:#999; line-height: 20px;
}
.orders-address-view text.label {
	color:#777;
}

.orders-view {
	width:100%;
}
.single-orders-view {
	width:100%; background:#ffffff; border-radius: 5px;
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
.single-order-pro-view {
	margin-top: 7px; padding-bottom: 12px;
}

.pro-exception {
	text-align: right; 
}
.pro-exception .exp-btn {
	border:1px #e5e5e5 solid; width: auto; width:60px; text-align: center; 
	padding: 5px 10px; border-radius: 5px; background:#fafafa; color:#666; margin-right:15px;
}
.single-order-pro {
	display: flex; 
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
.orders-amount-view text.discount {
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

.recommend-line {
	width:100%; border-top: 2px #DE5A29 solid; margin-top: 25px; position: relative;
}
.recommend-line text {
	width: 70px; background:#DE5A29; height: 24px; line-height: 24px; text-align: center; position: absolute;
	top: -12px; left: 50%; margin-left: -35px; color:#FFF; border-radius: 8px;
}

.recommend-pro-view {
	width:100%; background:#FFFFFF; min-height: 100px; border-radius:10px; margin-top: 25px;
}
.orders-remark-view {
	padding: 5px 10px; color:#777;
}

</style>
