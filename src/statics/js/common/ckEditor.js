/**
 * qbm-manage 编辑器
 * Autor: zsd
 * Date: 17-07-26
 */
layui.define(['common'], function(exports) {
	"use strict";
	var $ = layui.jquery,
		common = layui.common,
		layer = layui.layer,
		jsFile = '/statics/plugins/ckeditor/ckeditor.js';

	/**
	 * 调用ckEditor
	 * @param  {[string]} id  [目标id]
	 * layer.use 引入 ckEditor; ckEditor = layui.ckEditor;
	 * 调用代码：
	 * ckEditor(id);
	 */
	function ckEditor(id) {
		common.loadJs(jsFile, function() {
			CKEDITOR.replace(id);
		});
	};

	exports('ckEditor', ckEditor);
})