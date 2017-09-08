layui.config({
	base: '/statics/js/common/' //layui自定义layui组件目录
});
layui.use(['jquery', 'form', 'common', 'loadList', 'WdatePicker'], function() {
	var $ = layui.jquery,
		layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
		layer = layui.layer, //获取当前窗口的layer对象
		common = layui.common,
		form = layui.form(),
		loadList = layui.loadList,
		WdatePicker = layui.WdatePicker,
		currentPage = 1, //当前页
		parame = {}; //参数
	var webUrl = common.urlConfig('webUrl');

	var App = function() {
		this.init(); //页面初始化
		this.listen();
	};

	App.prototype = {
		init: function() {
			let self = this;
			self.pageSize = 10;
			self.listFun();
			//日期插件
			WdatePicker('startTime', {
				maxDate: '#F{$dp.$D(\'endTime\')||\'2020-01-01\'}',
				dateFmt: 'yyyy-MM-dd HH:mm:ss'
			});
			WdatePicker('endTime', {
				minDate: '#F{$dp.$D(\'startTime\')||\'2020-01-01\'}',
				dateFmt: 'yyyy-MM-dd HH:mm:ss'
			});
		},
		listen: function() {
			let self = this;
			$(document).on("click", ".detailBtn", function() {
				let $this = $(this);
				self.detailBtnClick($this);
			});
			$(document).on("click", ".cateBtn", function() {
				let $this = $(this);
				self.cateBtnClick($this);
			});
			form.on('submit(searchSubmit)', function(data) {
				self.listFun({
					parame: data.field
				});
				return false;
			});
			$('.exportBtn').on('click', function() {
				let paramArray = [],
					data = self.searchKeywords;
				for (let key in data) {
					if (data[key] || data[key] === false || data[key] === 0) {
						paramArray.push(key + '=' + encodeURIComponent(data[key]));
					}
				}
				window.open(`${webUrl}/goodsOrder/exportGoodsOrderDetail.html${paramArray[0]?'?':''}${paramArray[0]?paramArray.join('&'):''}`);
			});
		},
		cateBtnClick: function($this) {
			let self = this;
			let id = $this.data('id'),
				type = $this.data('type');

			top.layer.open({
				type: 2,
				title: type == 'deliver' ? "发货" : "收货",
				area: ['600px', '450px'],
				fixed: false, //不固定
				maxmin: false,
				content: `/module/financialLife/orderManage/logistics.html?id=${id}&type=${type}`,
				end: function() {
					if (common.getItem('flag')) {
						self.listFun();
						common.delItem('flag')
					}
				}
			});

		},
		detailBtnClick: function($this) {
			let self = this;
			var id = $this.data('id');
			top.layer.open({
				type: 2,
				title: "订单详情",
				area: ['920px', '600px'],
				fixed: true, //不固定
				maxmin: false,
				content: `/module/financialLife/orderManage/detail.html?id=${id}`,
				end: function() {

				}
			});

		},
		listFun: function(opt) {
			var self = this;
			if (!opt && typeof opt !== 'object') {
				opt = {};
			}
			var param = arguments[1],
				curPage = opt.currentPage,
				parame = opt.parame;
			loadList({
				url: '/goodsOrder/goodsOrderList.html',
				pageSize: self.pageSize,
				currentPage: curPage,
				parame: parame
			}, param);
		},
	}

	var app = new App();
});