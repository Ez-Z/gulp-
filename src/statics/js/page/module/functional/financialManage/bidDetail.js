layui.config({
	base: '/statics/js/common/' //layui自定义layui组件目录
});
layui.use(['jquery', 'form', 'common', 'loadList', 'WdatePicker'], function() {
	var $ = layui.jquery,
		layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
		layer = layui.layer, //获取当前窗口的layer对象
		common = layui.common,
		webUrl = common.urlConfig('webUrl'),
		loadList = layui.loadList,
		WdatePicker = layui.WdatePicker,
		form = layui.form();
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
			$('.exportBtn').on('click', function() {
				let paramArray = [],
					data = self.searchKeywords;
				for (let key in data) {
					if (data[key] || data[key] === false || data[key] === 0) {
						paramArray.push(key + '=' + encodeURIComponent(data[key]));
					}
				}
				window.open(`${webUrl}/goodsOrder/exportFinancialManage.html${paramArray[0]?'?':''}${paramArray[0]?paramArray.join('&'):''}`);
			});
			form.on('select(varietiesSelect)', function(data) {
				console.log(data.value);
				self.loadClassification(data.value);
			});
			form.on('submit(search)', function(data) {
				self.searchKeywords = data.field;
				console.log(self.searchKeywords);
				self.listFun({parame: self.searchKeywords});

				return false;
			});

		},
		loadChannelAndSort: function() {
			common.ajax({
				type: "get",
				url: `${webUrl}/goods/queryChannelAndSortList.html`,
				data: '',
				success: function(data) {
					if (data.result) {
						layer.msg('数据加载中', {
							icon: 16,
							time: 500,
							shade: 0.01
						}, function() {
							//加载模板处理
							var channelHtml = '<option value="">请选择</option><option value="">全部</option>',
								borrowHtml = '<option value="">请选择</option><option value="">全部</option>',
								varietiesHtml = '<option value="">请选择</option><option value="">全部</option>';
							data.borrowStatus.map(function(item,index) {
								borrowHtml += `<option value="${item.value}">${item.name}</option>`;
							});
							data.channelList.map(function(item) {
								channelHtml += `<option value="${item.id}">${item.channelName}</option>`;
							});
							data.varietiesList.map(function(item) {
								varietiesHtml += `<option value="${item.value}">${item.name}</option>`;
							});
							$('#channelSelect').html(channelHtml);
							$('#varietiesSelect').html(varietiesHtml);
							$('#borrowSelect').html(borrowHtml);
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
			});
		},
		loadClassification: function(parentid) {
			if(!parentid){
				var varietiesHtml2 = '<option value="">请选择</option>';
				$('#varietiesSelect2').html(varietiesHtml2);
				$('#varietiesSelect2').attr('disabled', true);
				setTimeout(function() {
					form.render();
				}, 50);
				return false;
			}
			common.ajax({
				type: "get",
				url: `${webUrl}/goodsClassification/loadGoodsClassificationList.html`,
				data: {
					parentId: parentid
				},
				success: function(data) {
					console.log(data);
					if (data.result) {
						var varietiesHtml2 = '<option value="">请选择</option>';
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