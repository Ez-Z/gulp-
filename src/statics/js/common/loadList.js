/**
 * qbm-manage 列表加载函数
 * Autor: zsd
 * Date: 17-07-26
 */
layui.define(['common', 'form', 'laypage'], function(exports) {
	"use strict";
	var $ = layui.jquery,
		common = layui.common,
		layer = layui.layer,
		form = layui.form(),
		laypage = layui.laypage,
		webUrl = common.urlConfig('webUrl');
	var params = {},
		_parame = {},
		url = '';

	/**
	 * 加载列表函数
	 * @param  {[obj]} opt [配置 固定参数 url currentPage pageSize parame]
	 *
	 * listFun 栗子
	 * 
	   listFun: function(opt) {//opt可以不填，如果带其他参数，必填，填为 {} 空对象 listFun({},{key:value})
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
		}
	 */
	var loadList = function(opt) {
		var param = arguments[1],
			parame = opt.parame ? opt.parame : {},
			currentPage = opt.currentPage ? opt.currentPage : 1,
			pageSize = opt.pageSize ? opt.pageSize : 10;
		url = opt.url;
		if(url==''){
			layer.msg("请填写请求url", {
				icon: 5,
				time: 500
			});
			return false;
		}
		if(param){
			for(var key in param){
				params[key] = param[key];
			}
		}
		if(params){
			for(var key in params){
				parame[key] = params[key];
			}
		}
		for(var key in parame){
			_parame[key] = parame[key];
		}
		common.ajax({
			type: "get",
			url: `${webUrl}${url}?pageSize=${pageSize||10}&page=${currentPage||1}`,
			data: parame,
			dataType: "JSON",
			success: function(data) {
				console.log(data);
				if (data.result) {
					layer.msg('数据加载中', {
						icon: 16,
						time: 500,
						shade: 0.01
					}, function() {
						$(".list-no-data").remove();
						//加载模板处理
						setTimeout(function(){
							var html = template('listTpl', data);
                   			$('#dataList').html(html);
                   			form.render();
						},50);

						if(data.dataList.length < 1){
							$(".admin-table").after('<div class="list-no-data txt-center"><span class="qbm-icon qbm-icon-comiiszanwushuju"></span><br/>暂无数据</div>');
						}
						if (data.pages) {
							$("#pages").html('').removeClass("txt-center");
							$("#pageBar").removeClass("hide");
							if(data.pages.total > 0){
								$("#totalRecord").text(data.pages.total);
							}else{
								$("#pageBar").addClass("hide");
							}
							
							laypage({
								cont: 'pages', //容器
								pages: data.pages.pages, //总页数
								curr: data.pages.currentPage, //当前页数
								skip: true,
								jump: function(obj, first) {
									var curr = obj.curr;
									if (!first) {
										currentPage = obj.curr;
										loadList({url: url,pageSize:pageSize||10,currentPage:currentPage,parame:_parame});
									}
								}
							});
						}
						
					});
				} else {
					layer.msg("数据加载失败", {
						icon: 5,
						time: 500
					});
				}
			}
		});
	}
	exports('loadList', loadList);
})