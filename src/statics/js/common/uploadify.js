/**
 * qbm-manage 图片上传插件调用
 * Autor: zsd
 * Date: 17-07-26
 */
layui.define(['common'], function(exports) {
	"use strict";
	var $ = layui.jquery,
		common = layui.common,
		fileSever = common.urlConfig('fileSever'),
		imageSeverPath = common.urlConfig('imageSeverPath'),
		layer = layui.layer,
		jsFile = '/statics/plugins/uploadify/jquery.uploadify.min.js';


	/**
	 * 图片上传
	 * @param  {[string]} id [目标id]
	 * @param  {[number]} limit [上传图片张数限制]
	 */
	function uploadify(id, limit, data) {
		window.$ = $;
		var index = 0;
		common.loadJs(jsFile, function() {
			function init() {
				$('#' + id + 'List').html(`<li id="${id}AddBtn"></li>`);
				setTimeout(function() {
					setUploadify(`${id}AddBtn`);

					if (data && data != '') {
						data.map(function(item) {
							appendImg(item.uri)
						});
					}
				}, 50);
			}

			function delImg(elem, url, dom) {
				index--;
				console.log(dom);
				var delIndex = $('#' + id + 'List').find('span').index(dom);
				console.log(delIndex);
				filterImg(url, 0, delIndex);
				elem.remove();
				$('#' + id + 'AddBtn').show();
			}

			function appendImg(url) {

				var Li = document.createElement('li');
				// $(Li).attr('class', id + 'Imgbox');
				var Img = document.createElement('img');
				$(Img).attr('src', url);

				$(Li).append(Img);
				var del = document.createElement('span');
				$(del).text('x');
				$(del).attr('class', 'layui-btn layui-btn-danger layui-btn-mini');

				del.onclick = function(evt) {
					var dom = evt.target;
					delImg(Li, url, dom);
				}
				$(Li).append(del);
				filterImg(url, 1);

				$(Li).insertBefore($('#' + id + 'AddBtn'));
				index++;
				if (index >= limit) {
					$('#' + id + 'AddBtn').hide();
				}
				setTimeout(function() {
					layer.photos({
						photos: '#' + id + 'List',
						closeBtn: 1,
						shade: 0.02,
						shift: 5 //0-6的选择，指定弹出图片动画类型，默认随机
					});
				}, 200);

			}

			function filterImg(url, num, delIndex) {
				var imgs = $('#' + id + 'Input').val().split(',');
				if (num == 0) {
					imgs = imgs.filter(function(item, i) {
						return i != delIndex;
					});
				} else {
					imgs.push(url);
				}
				imgs = $.grep(imgs, function(n) {
					return $.trim(n).length > 0;
				})
				var imgsStr = imgs.join(',');
				$('#' + id + 'Input').val(imgsStr);
			}

			function setUploadify(elem) {
				$('#' + elem).uploadify({
					//指定swf文件
					'swf': '/statics/plugins/uploadify/uploadify.swf',
					//后台处理的页面
					'uploader': fileSever,
					//按钮显示的文字
					'buttonText': '',
					//显示的高度和宽度，默认 height 30；width 120
					'height': 100,
					'width': 100,
					'buttonClass': 'uploaderBtn',
					//上传文件的类型  默认为所有文件    'All Files'  ;  '*.*'
					//在浏览窗口底部的文件类型下拉菜单中显示的文本
					'fileTypeDesc': 'Image Files',
					//允许上传的文件后缀
					'fileTypeExts': '*.gif; *.jpg; *.png',
					//发送给后台的其他参数通过formData指定
					'formData': {
						'timestamp': Date.parse(new Date()),
						'folder': '\\manage\\images',
						'hideName': 'true'
					},
					//'formData': { 'someKey': 'someValue', 'someOtherKey': 1 },
					//上传文件页面中，你想要用来作为文件队列的元素的id, 默认为false  自动生成,  不带#
					//'queueID': 'fileQueue',
					//选择文件后自动上传
					'auto': true,
					//设置为true将允许多文件上传
					'multi': true,
					'fileSizeLimit': 10 * 1024 * 1024, //文件上传的最大大小
					onInit: function() {},
					onUploadSuccess: function(file, data, res) {
						appendImg(imageSeverPath + data);
					},
					onUploadError: function(file, errorCode, errorMsg) {
						layer.msg("上传失败", {
							icon: 5,
							time: 500
						});
					}
				});
			}

			setTimeout(function() {
				init();
			}, 100);
		});
	};

	exports('uploadify', uploadify);
})