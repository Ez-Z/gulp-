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
		jsFile = '/statics/plugins/wangeditor/wangEditor.min.js';
	
	/**
	 * 调用wangEditor
	 * layer.use 引入  wangEditor; wangEditor = layui.wangEditor();
	 * 调用代码：
	 * var E = layui.wangEditor;
	 * var editor = new E(id);
	 * editor.create();
	 */
	function wangEditor() {
		common.loadJs(jsFile, function() {
			layui.wangEditor = window.wangEditor;
		});
	};

	exports('wangEditor', wangEditor);
})
	