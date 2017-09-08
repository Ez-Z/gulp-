/**
 * qbm-manage 落地页管理列表页
 * Autor: sheht
 * Date: 17-08-15
 */
layui.config({
    base: '/statics/js/common/' //layui自定义layui组件目录
});
layui.use(['jquery','common','form','artTemplate','loadList'], function() {
  var $ = layui.jquery,
			layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
			layer = layui.layer, //获取当前窗口的layer对象
      common = layui.common,
			form = layui.form(),
      loadList = layui.loadList,
      artTemplate = layui.artTemplate(),
      currentPage = 1,//当前页
      parame = {};//参数
      window.jQuery = $;

  var App = function(){
    this.url = {
      webUrl: common.urlConfig("webUrl"),//接口路径
      wapUrl: common.urlConfig("wapUrl"),//接口路径
    };
    this.init();//页面初始化
    // this.listFun();//列表
    this.searchFun();//搜索
    this.LinkAgeList();//类别查询
    this.activityFun();//落地页编辑（添加、修改、删除）
  };

  App.prototype = {
    init:function(){
      var self = this;
      self.pageSize = 10;
      self.listFun();
    },
    LinkAgeList:function(){
      var self = this;
      common.ajax({
        type: "get",
        url: self.url.webUrl+"/regSetting/LinkAgeList.html",
        dataType: "JSON",
        success: function(data){
          if(typeof data == "string"){
            data = JSON.parse(data);
          }
          console.log("类别："+data);
          if(data.result){
            //加载父级品类
            var dataLength = data.dataList.length;
            var html = '<option value="">请选择</option><option value="">全部</option>';
            for(var i = 0; i < dataLength; i++){
              html +=  '<option value="'+data.dataList[i].value+'">'+data.dataList[i].name+'</option>';
            }
            $("#searchType").html(html);
            form.render('select');
          }else{
            layer.msg("数据读取失败",{icon:5,time: 500});
          }
        }
      })
    },
    searchFun: function(){
      var self = this;
      form.on('submit(search)', function(data){
        console.log(data.field); //当前容器的全部表单字段
        self.listFun({'parame':data.field});
        return false; //阻止表单跳转
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
				url: '/regSetting/queryRegpageConfig.html',
				pageSize: self.pageSize,
				currentPage: curPage,
				parame: parame
			},param);
		},
    activityFun:function(){
      var self = this;
      $(document).on("click",".optBtn",function(){
        var pageType = $(this).attr("data-type"),//操作类型
            pageNid = $(this).attr("data-nid"),//落地页标识
            contentUrl = "";

        if(pageType == "add"){
          contentUrl =  '/module/functional/landingPage/pageSetting.html?type=' + pageType;
        }
        if(pageType == "edit"){
          contentUrl =  '/module/functional/landingPage/pageSetting.html?type=' + pageType + '&pageId=' + pageNid;
        }
        top.layer.open({
           type: 2,
           title: "落地页h5配置",
           area: ['920px', '600px'],
           maxmin: false,
           resize: false,
           content: contentUrl,
           end:function(){
             currentPage = 1;//当前页
             parame = {};//参数
             self.listFun();
           }
         });
      });

      //new Clipboard('.btn');
      // $(document).on("click",".copyBtn",function(){
      //   var nid = $(this).attr("data-nid")
      //   $(this).attr("data-clipboard-text",self.url.wapUrl+"/reg/reg.html?nid="+nid)
      // })
      var clipboard = new Clipboard('.copyBtn');
      clipboard.on('success', function(e) {
      	var msg = e.trigger.getAttribute('aria-label');
      	top.layer.msg(msg,{time:800})
          console.info('Action:', e.action);
          console.info('Text:', e.text);
          console.info('Trigger:', e.trigger);

          e.clearSelection();
      });

      $(document).on("click",".deleteBtn",function(){
        var pageNid = $(this).attr("data-nid");//落地页标识
        common.ajax({
          type: "get",
          url: self.url.webUrl+"/regSetting/deleteRegpageConfig.html",
          data: {
            id: pageNid
          },
          dataType: "JSON",
          success: function(data){
            if(typeof data == "string"){
              data = JSON.parse(data);
            }
            if(data.result){
              self.listFun();
              return false
            }else{
              layer.msg("数据读取失败",{icon:5,time: 500});
            }
          }
        })
      })
    },
  };
  var app = new App();
});
