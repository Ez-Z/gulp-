layui.config({
	base: '/statics/js/common/' //layui自定义layui组件目录
});
layui.use(['jquery', 'form', 'common', 'jeDateFun', 'loadList'], function() {
	var $ = layui.jquery,
		layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
		layer = layui.layer, //获取当前窗口的layer对象
		common = layui.common,
		webUrl = common.urlConfig('webUrl'),
		loadList = layui.loadList,
		form = layui.form();
	var jeDateFun = layui.jeDateFun;

	var App = function() {
		this.init(); //页面初始化
		this.listen();
	};

	App.prototype = {
		init: function() {
			let self = this;
			self.searchKeywords;
			self.listFun({});
			self.loadChannelAndSort();
			//日期插件初始化
			self.start = {
				format: 'YYYY-MM-DD hh:mm:ss',
				minDate: '2014-06-16 23:59:59', //设定最小日期为当前日期
				choosefun: function(elem, val, date) { //选中日期后的回调, elem当前输入框ID, val当前选择的值, date当前完整的日期值
					self.end.minDate = date; //开始日选好后，重置结束日的最小日期
					$("#endTime").jeDate(self.end).click();
				}
			};
			self.end = {
				format: 'YYYY-MM-DD hh:mm:ss',
				maxDate: '2099-06-16 23:59:59', //最大日期
				choosefun: function(elem, val, date) {
					self.start.maxDate = date; //将结束日的初始值设定为开始日的最大日期
				}
			};
			jeDateFun('startTime',self.start);
			jeDateFun('endTime',self.end);
		},
		listen: function() {
			let self = this;
			$(document).on("click", ".cateBtn", function() {
				let $this = $(this);
				self.cateBtnClick($this);
			});
			$('.exportBtn').on('click', function() {
				// self.exportFun();
				let paramArray = [],
					data = self.searchKeywords;
				for (let key in data) {
					if (data[key] || data[key] === false || data[key] === 0) {
						paramArray.push(key + '=' + encodeURIComponent(data[key]));
					}
				}
				window.open(`${webUrl}/goodsOrder/exportGoodsjyfx.html?${paramArray[0]?paramArray.join('&'):''}`);
			});
			form.on('select(varietiesSelect)', function(data) {
				console.log(data.value);
				self.loadClassification(data.value);
			});
			form.on('submit(search)', function(data) {
				self.searchKeywords = data.field;
				self.listFun({parame:data.field});

				return false;
			});

		},
		cateBtnClick: function($this) {
			let self = this;
			var id = $this.data('id');
			top.layer.open({
				type: 2,
				title: "渠道配置",
				area: ['720px', '800px'],
				fixed: true, //不固定
				maxmin: false,
				content: `/module/financialLife/orderManage/detail.html?id=${id}`,
				end: function() {
					self.listFun({});
				}
			});

		},
		exportFun: function() {
			let self = this;
			common.ajax({
				type: "get",
				url: `${webUrl}/goodsOrder/exportFinancialManage.html`,
				data: self.searchKeywords ? self.searchKeywords : '',
				success: function(data) {
					console.log(data);
					if (data.result) {
						layer.msg('数据加载中', {
							icon: 16,
							time: 500,
							shade: 0.01
						}, function() {});
					} else {
						layer.msg("数据加载失败", {
							icon: 5,
							time: 500
						});
					}
				},
				error: function() {
					layer.msg("数据获取失败", {
						icon: 5,
						time: 500
					});
				}
			});
		},
		loadChannelAndSort: function() {
			common.ajax({
				type: "get",
				url: `${webUrl}/goods/queryChannelAndSortList.html`,
				data: '',
				success: function(data) {
					console.log(data);
					if (data.result) {
						layer.msg('数据加载中', {
							icon: 16,
							time: 500,
							shade: 0.01
						}, function() {
							//加载模板处理
							var channelHtml = '<option value="">请选择</option><option value="" selected="">全部</option>',
								varietiesHtml = '<option value="">请选择</option><option value="" selected="">全部</option>';
							data.channelList.map(function(item) {
								channelHtml += `<option value="${item.id}">${item.channelName}</option>`;
							});
							data.varietiesList.map(function(item) {
								varietiesHtml += `<option value="${item.value}">${item.name}</option>`;
							});
							$('#channelSelect').html(channelHtml);
							$('#varietiesSelect').html(varietiesHtml);
							setTimeout(function() {
								form.render();
							}, 50);
						});
					} else {
						layer.msg("数据加载失败", {
							icon: 5,
							time: 500
						});
					}
				},
				error: function() {
					layer.msg("数据获取失败", {
						icon: 5,
						time: 500
					});
				}
			});
		},
		loadClassification: function(parentid) {
			common.ajax({
				type: "get",
				url: `${webUrl}/goodsClassification/loadGoodsClassificationList.html`,
				data: {
					parentId: parentid
				},
				success: function(data) {
					console.log(data);
					if (data.result) {
						var varietiesHtml2 = '<option value="">请选择</option><option value="" selected="">全部</option>';
						if(data.dataList && data.dataList.length>0){
							data.dataList.map(function(item) {
								varietiesHtml2 += `<option value="${item.id}">${item.varietiesName}</option>`;
							});
							$('#varietiesSelect2').attr('disabled', false);
						}else{
							$('#varietiesSelect2').attr('disabled', true);
						}
						$('#varietiesSelect2').html(varietiesHtml2);
						setTimeout(function() {
							form.render();
						}, 50);
					} else {
						layer.msg("数据加载失败", {
							icon: 5,
							time: 500
						});
					}
				},
				error: function() {
					layer.msg("数据获取失败", {
						icon: 5,
						time: 500
					});
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
				url: '/goodsOrder/financialManage.html',
				pageSize: self.pageSize,
				currentPage: curPage,
				parame: parame
			},param);
		},
	}

	var app = new App();
});