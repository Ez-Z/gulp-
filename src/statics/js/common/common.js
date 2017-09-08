/**
 * qbm-manage 自定义公共基础信息提示模块
 * Autor: chenqq
 * Date: 17-06-21
 */
layui.define(['layer'], function(exports) {
	"use strict";
	var $ = layui.jquery,
		layer = layui.layer,
		cookie;
		
	var common = {
		/**
		 * 公用Url处理
		 * @param  {[string]} param
		 */
		urlConfig: function(param) {
			var domainBegin = "test";
			var runTime = "dev";//运行环境 dev-测试环境  product-生产环境
			
			if(runTime =="dev"){
				if (param == "webUrl") {//PC端
					return "http://192.168.188.80:10003";
					return "http://192.168.188.7:8084";
				}
				if (param == "fileSever") { //图片上传服务器
					return '';
				}
				if (param == "imageSeverPath") { //图片服务器前缀
					return '';
				}
				if (param == "wapUrl") { //移动端
					return '';
				}
			}

			if(runTime == "product"){
				if (param == "webUrl") {//PC端
					return '';
				}
				if (param == "fileSever") { //图片上传服务器
					return '';
				}
				if (param == "imageSeverPath") { //图片服务器前缀
					return '';
				}
				if (param == "wapUrl") { //移动端
					return '';
				}
			}
			
		},
		/**
		 * 异步加载css
		 * @param {[string]} src
		 */
		loadCss: function(src) {
			var srcArray = src.split("?")[0].split("/");
			var scr_src = srcArray[srcArray.length - 1];
			var links = document.getElementsByTagName("link");
			if (!!links && 0 != links.length) {
				for (var i = 0; i < links.length; i++) {
					if (-1 != links[i].href.indexOf(scr_src)) {
						return true;
					}
				}
			}

			var link = document.createElement('link');
			link.type = 'text/css';
			link.rel = 'stylesheet';
			link.href = src;
			document.getElementsByTagName("head")[0].appendChild(link);
		},
		/**
		 * 异步加载js
		 * @param  {[string]}   src
		 * @param  {Function} callback
		 */
		loadJs: function(src, callback) {
			var srcArray = src.split("?")[0].split("/");
			var scr_src = srcArray[srcArray.length - 1];

			// 判断要 添加的脚本是否存在如果存在则不继续添加了
			var scripts = document.getElementsByTagName("script");
			if (!!scripts && 0 != scripts.length) {
				for (var i = 0; i < scripts.length; i++) {
					if (-1 != scripts[i].src.indexOf(scr_src)) {
						callback();
						return true;
					}
				}
			}

			// 不存在需要的则添加
			var body = document.getElementsByTagName("body")[0];
			var script = document.createElement("script");
			script.setAttribute("type", "text/javascript");
			script.setAttribute("src", src);
			script.setAttribute("async", true);
			script.setAttribute("defer", true);
			body.appendChild(script);

			//fuck ie! duck type
			if (document.all) {
				script.onreadystatechange = function() {
					var state = this.readyState;
					if (state === 'loaded' || state === 'complete') {
						callback();
					}
				};
			} else {
				//firefox, chrome
				script.onload = function() {
					callback();
				};
			}
		},
		/**
		 * URL参数处理
		 * @param {String} name
		 */
		getUrlParam: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},
		/**
		 * 抛出一个异常错误信息
		 * @param {String} msg
		 */
		throwError: function(msg) {
			throw new Error(msg);
			return;
		},
		/**
		 * 弹出一个错误提示
		 * @param {String} msg
		 */
		msgError: function(msg) {
			layer.msg(msg, {
				icon: 5
			});
			return;
		},
		/**
		 * 设置cookie 默认30分钟
		 * @param {[string]} name     [description]
		 * @param {[string]} value      [description]
		 * @param {[number]} expiredays [description]
		 */
		setCookie: function(name, value, expiredays, path) {
			var exdate = new Date();
			exdate.setTime(exdate.getTime() + (expiredays ? expiredays : 30) * 60 * 1000);
			var domain = location.hostname;
			var domainArr = domain.split('.');
			var host = location.host;
			var hostArr = host.split(':');
			if (!hostArr[1] && domainArr.length > 1) {
				domainArr.shift();
				domain = domainArr.join('.');
				document.cookie = name + "=" + escape(value) + ";expires=" + exdate.toGMTString() + ";path=" + (path ? path : '/') + ";domain=" + domain;
			} else {
				document.cookie = name + "=" + escape(value) + ";expires=" + exdate.toGMTString() + ";path=" + (path ? path : '/');
			}
		},
		/**
		 * 删除cookie
		 * @param  {[string]} name
		 */
		delCookie: function(name, path) {
			var self = this;
			self.setCookie(name, "", -1, path);
		},
		/**
		 * 获取cookie
		 * @param  {[string]} name
		 */
		getCookie: function(name) {
			var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
			if (arr != null) return unescape(arr[2]);
			return null;
		},
		/**
		 * 设置缓存
		 * @param key 保存的键值
		 * @param val 保存的内容
		 */
		setItem: function(key, val) {
			val = JSON.stringify(val);
			localStorage.setItem(key, val);
		},
		/**
		 * 获取缓存
		 * @param  {[String]} key 获取的键值
		 * @return {Object}
		 */
		getItem: function(key) {
			return localStorage.getItem(key) && JSON.parse(localStorage.getItem(key));
		},
		/**
		 * 删除缓存
		 * @param  {[String]} key 删除的键值
		 */
		delItem: function(key) {
			localStorage.removeItem(key);
		},
		/**
		 * Javascript ajax level1
		 * @param  {[object]} opt [opt:{type url data success error}]
		 */
		ajax: function(opt) {
			let self = this;
			let user = self.getCookie('JSESSIONID');
			console.log(user);
			if (!user || user == "") {
				top.layer.alert('请登录后再进行操作', {
					end: function(index) {
						top.location.href = '/login.html';
						top.layer.close(index);
					}
				});
				return false;
			}
			let {
				type = "GET",
					url,
					data = '',
					success = function() {},
					error = function() {
						layer.msg("网络请求失败", {
							icon: 5,
							time: 500
						});
					}
			} = opt;

			let xhr = new XMLHttpRequest();
			xhr.onload = function() {
				switch (xhr.status){
					case 200:
						let res = JSON.parse(xhr.responseText);
						if (res.code != -9999) {
							success(res)
							break;
						}
					default:
						self.delCookie('JSESSIONID');
						//top.location.href = '/login.html';
						break;
				}
				// if (xhr.status == 200) {
				// 	let res = JSON.parse(xhr.responseText);
				// 	if (res.code != -9999) {
				// 		success(res)
				// 	} else {
				// 		self.delCookie('user');
				// 		top.location.href = '/login.html';
				// 	}
				// }
			}
			xhr.onerror = function() {
				error && error();
			}
			let paramArray = [],
				paramString = '';
			for (let key in data) {
				if (data[key] || data[key] === false || data[key] === 0) {
					paramArray.push(key + '=' + encodeURIComponent(data[key]));
				}
			}
			type = type.toUpperCase();
			if (type == 'GET') {
				if (paramArray.length > 0) {
					url += (url.indexOf('?') > -1 ? '&' : '?') + paramArray.join('&');
				}
			}
			xhr.open(type, url, true);
			xhr.withCredentials = true;
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;");
			xhr.send(type === 'POST' ? paramArray.join('&') : '');
		},
		/**
		 * 获取时间戳时间
		 * @param  {[string]} nS  [时间戳]
		 * @param  {[string]} str [日期间隔]
		 */
		getLocalTime: function(nS, str) {
			return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, str).replace(/日/g, " ");
		}
	};

	var jsFile1 = '/statics/plugins/artTemplate/template.js',
		jsFile2 = '/statics/plugins/artTemplate/helper.js';
	common.loadJs(jsFile1, function() {
		common.loadJs(jsFile2, function() {});
	});
	exports('common', common);
})