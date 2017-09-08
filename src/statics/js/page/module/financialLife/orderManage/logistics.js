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
			$(document).on('click', '#cancelBtn', function() {
				top.layer.closeAll();
			});
			form.verify({
				sjOrderNumber: function(value) {
					if (value.length < 1) {
						return '运单号不能为空';
					}
				}
			});
			form.on('submit(channelSubmit)', function(data) {
				$('#channelSubmit').on('click', function() {
					return false;
				});
				self.editLogisticsInfo(data.field);
			});
		},
		loadPage: function() {
			var self = this;
			common.ajax({
				type: "get",
				url: `${webUrl}/goodsOrder/queryLogisticsInfo.html`,
				data: {
					id: self.id
				},
				success: function(data) {
					console.log(data);
					if (data.result) {
						if (!data.myAddr || !data.myRealname || !data.myPhone) {
							top.layer.closeAll();

							top.layer.msg('用户尚未添加完整收货信息', {
								icon: 5,
								time: 800
							});
							return false;
						}
						top.layer.msg('数据加载中', {
							icon: 16,
							time: 200,
							shade: 0.01
						}, function() {
							artTemplate('detailTpl', 'content', data);
							setTimeout(function() {
								form.render('select');
								if (data.remainTime)
									self.getCountDown(data.remainTime);
							}, 50);
						});

					} else {
						top.layer.closeAll();
						top.layer.msg(data.msg, {
							icon: 5,
							time: 800
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
		getCountDown: function(timestamp) {
			var self = this;
			self.htmlCountDown(timestamp);
			setInterval(function() {
				self.htmlCountDown(timestamp);
			}, 1000);
		},
		htmlCountDown: function(timestamp) {
			var nowTime = new Date();
			var endTime = new Date(timestamp * 1000);
			var t = endTime.getTime() - nowTime.getTime();
			var day = Math.floor(t / 1000 / 60 / 60 / 24);
			var hour = Math.floor(t / 1000 / 60 / 60 % 24);
			var min = Math.floor(t / 1000 / 60 % 60);
			var sec = Math.floor(t / 1000 % 60);

			if (hour < 10) {
				hour = "0" + hour;
			}
			if (min < 10) {
				min = "0" + min;
			}
			if (sec < 10) {
				sec = "0" + sec;
			}
			var countDownTime = `<span class="txt-red">*</span> 当前订单将于<span class="txt-red">${day}</span>天<span class="txt-red">${hour}</span>小时<span class="txt-red">${min}</span>分<span class="txt-red">${sec}</span>秒自动确认收货`;
			$("#countDown").html(countDownTime);
		},
		editLogisticsInfo: function(data) {
			var self = this;
			common.ajax({
				type: "get",
				url: `${webUrl}/goodsOrder/updateOrderStatus.html?id=${self.id}`,
				data: data,
				success: function(data) {
					console.log(data);
					if (data.result) {
						top.layer.msg('操作成功', {
							icon: 1,
							time: 500
						}, function() {
							top.layer.closeAll();
							common.setItem('flag', true);
							$('#channelSubmit').off('click');
						});

					} else {
						top.layer.msg("操作失败", {
							icon: 5,
							time: 500
						});
						$('#channelSubmit').off('click');
					}
				},
				error: function() {
					top.layer.msg("网络请求失败", {
						icon: 5,
						time: 500
					});
					$('#channelSubmit').off('click');
				}
			});
		}
	};
	var app = new App();
});