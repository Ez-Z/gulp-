layui.config({
	base: '/statics/js/common/',
}).use(['jquery', 'form', 'element', 'layer', 'common', 'artTemplate'], function(exports) {
	var $ = layui.jquery,
		layer = layui.layer,
		element = layui.element(),
		common = layui.common,
		artTemplate = layui.artTemplate,
		webUrl = common.urlConfig('webUrl'),
		form = layui.form();


	var App = function() {
		this.init(); //页面初始化
		this.listen(); //添加监听
	};
	App.prototype = {
		init: function() {
			var self = this;
			self.id = common.getUrlParam('id');
			self.loadPage();
		},
		listen: function() {
			let self = this;
			$(document).on('click', '#changeBtn', function() {
				$('#logisticsInfo').hide();
				$('#editLogisticsInfo').show();
			});
			$(document).on('click', '#sendBtn', function() {
				self.editLogisticsInfo();
			});
		},
		loadPage: function() {
			var self = this;
			common.ajax({
				type: "get",
				url: `${webUrl}/goodsOrder/queryGoodsOrderDetail.html`,
				data: {
					id: self.id
				},
				success: function(data) {
					console.log(data);
					if (data.result) {
						top.layer.msg('数据加载中', {
							icon: 16,
							time: 200,
							shade: 0.01
						}, function() {
							artTemplate('detailTpl', 'content', data);
							//加载模板处理
							// var html = template('detailTpl', data);
							// $("#content").html(html);
						});

					} else {
						top.layer.msg("数据加载失败", {
							icon: 5,
							time: 500
						});
					}
				},
				error: function() {
					top.layer.msg("网络请求失败", {
						icon: 5,
						time: 500
					});
				}
			});
		},
		editLogisticsInfo: function() {
			var self = this;
			if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test($('#myPhone').val()))) {
				top.layer.msg('请填写正确手机号', {
					icon: 5,
					time: 800
				});
				return false;
			}
			if ($('#myRealname').val() == '' || $('#myPhone').val() == '' || $('#myAddr').val() == '') {
				top.layer.msg('请填写完整的收货信息', {
					icon: 5,
					time: 800
				});
				return false;
			}

			common.ajax({
				type: "get",
				url: `${webUrl}/goodsOrder/updateLogisticsInfo.html`,
				data: {
					id: self.id,
					myRealname: $('#myRealname').val(),
					myPhone: $('#myPhone').val(),
					myAddr: $('#myAddr').val()
				},
				success: function(data) {
					console.log(data);
					if (data.result) {
						top.layer.msg('操作成功', {
							icon: 1,
							time: 500
						}, function() {
							self.loadPage();
						});

					} else {
						top.layer.msg("操作失败", {
							icon: 5,
							time: 500
						});
					}
				},
				error: function() {
					top.layer.msg("网络请求失败", {
						icon: 5,
						time: 500
					});
				}
			});
		}
	};
	var app = new App();
});