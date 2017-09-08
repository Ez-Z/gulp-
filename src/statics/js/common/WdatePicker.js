/**
 * 调用My97日期控件
 * Autor: zsd
 * Date: 17-07-26
 */
layui.define(['common'], function(exports) {
	"use strict";
	var $ = layui.jquery,
		common = layui.common,
		layer = layui.layer,
		jsFile = '/statics/plugins/97DatePicker/WdatePicker.js';

	/**
	 * 调用ckEditor
	 * @param  {[string]} id  [目标id]
	 * @param  {[obj]} opt  [配置项]
	 * layer.use 引入 WdatePicker; WdatePicker = layui.WdatePicker;
	 * 调用代码：
	 * WdatePicker(id);
	 */
	function WdatePickerFun(id,opt) {
		common.loadJs(jsFile, function() {
			console.log(id);
			var obj = {};
			document.querySelector('#' + id).onclick = function(){
				obj = {el:this};
				for(var key in opt){
					obj[key] = opt[key];
				}
				WdatePicker(obj);
			}
		});
	};

	exports('WdatePicker', WdatePickerFun);
})