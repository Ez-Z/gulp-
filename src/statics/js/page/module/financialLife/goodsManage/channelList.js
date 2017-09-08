layui.config({
	base: '/statics/js/common/' //layui自定义layui组件目录
});
layui.use(['jquery', 'form', 'common', 'artTemplate','loadList'], function() {
	var $ = layui.jquery,
		layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
		layer = layui.layer, //获取当前窗口的layer对象
		common = layui.common,
		form = layui.form(),
		loadList = layui.loadList,
		currentPage = 1,//当前页
		parame = {};//参数

	var artTemplate = layui.artTemplate();
	var webUrl = common.urlConfig('webUrl');

	var App = function() {
		this.init(); //页面初始化
		this.listen();
	};

	App.prototype = {
		init: function() {
			let self = this;
			self.pageSize = 10;
			self.listFun({});
		},
		listen: function() {
			let self = this;
			$(document).on("click", ".cateBtn", function() {
				let $this = $(this);
				self.cateBtnClick($this);
			});
			form.on('submit(searchSubmit)', function(data) {
				self.listFun({parame:data.field});
				return false;
			});
			form.on('switch(status)', function(data) {
				self.statusSwichFun(data.elem.getAttribute('data-id'));
			});
		},
		cateBtnClick: function($this) {
			let self = this;
			var id = $this.data('id'),
				type = $this.data("type"),
				status = $this.data("status");
			top.layer.open({
				type: 2,
				title: "渠道配置",
				area: ['920px', '600px'],
				fixed: true, //不固定
				maxmin: false,
				content: `/module/financialLife/goodsManage/channelEdit.html?type=${type}&id=${id ? id :''}`,
				end: function() {
					if(common.getItem('flag')){
						self.listFun();
						common.delItem('flag')
					}
					
				}
			});
			
		},
		listFun: function(opt) {
			var self = this;
			if(!opt && typeof opt !== 'object'){
				opt = {};
			}
			var param = arguments[1],
				curPage = opt.currentPage,
				parame = opt.parame;
			loadList({
				url: '/channelConfig/channelList.html',
				pageSize: self.pageSize,
				currentPage: curPage,
				parame: parame
			},param);
		},
		statusSwichFun: function(id) {
			var self = this;
			common.ajax({
				type: "get",
				url: `${webUrl}/channelConfig/setChannelStatus.html`,
				data: {id:id},
				success: function(data) {
					if (data.result) {
						layer.msg('操作成功', {
							icon: 1,
							time: 500,
							shade: 0.01
						});
					} else {
						layer.msg("操作失败", {
							icon: 5,
							time: 500
						});
					}
					setTimeout(function(){
						self.listFun({});
					},500)
				},
				error: function() {
					layer.msg("数据获取失败", {
						icon: 5,
						time: 500
					});
				}
			});
		},
	}

	var app = new App();
});