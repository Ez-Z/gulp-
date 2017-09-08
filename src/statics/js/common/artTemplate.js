/**
 * qbm-manage 模板调用
 * Autor: zsd
 * Date: 17-07-26
 */
layui.define(['common'], function(exports) {
	"use strict";
	var $ = layui.jquery,
		common = layui.common,
		layer = layui.layer,
		jsFile1 = '/statics/plugins/artTemplate/template.js',
		jsFile2 = '/statics/plugins/artTemplate/helper.js';

	/**
	 * 模板js异步加载
	 * @param  {[string]} tpl  [模板id]
	 * @param  {[type]} id   [需要渲染的节点id]
	 * @param  {[object or array]} data [数据]
	 */
	function artTemplate(tpl, id, data) {
		common.loadJs(jsFile1, function() {
			common.loadJs(jsFile2, function() {
				if(tpl){
					var html = template(tpl, data);
                   	$('#'+id).html(html);
				}
			});
		});

	};


	exports('artTemplate', artTemplate);
})