/**
 *  商品分类
 */
layui.config({
   base: '/statics/js/common/' //layui自定义layui组件目录
});
layui.use(['jquery','form','common'], function() {
  var $ = layui.jquery,
			layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
			layer = layui.layer, //获取当前窗口的layer对象
			form = layui.form(),
      common = layui.common;

  var App = function(){
      this.url = {
        webUrl: common.urlConfig("webUrl"),//接口路径
        frameIndex: parent.layer.getFrameIndex(window.name),//获取iframeId
      };

      this.param = {
        pageType: common.getUrlParam("type"),//页面类型
        pageId: common.getUrlParam("pageId"),//页面Id
      };

      this.init();//页面初始化
      this.loadDataFun();//页面数据读取
      this.submitFun();//表单提交
      this.cancleLayerFun();//关闭弹出窗口
    };
    App.prototype = {
      init:function(){
        var self = this;
        console.log("pageType="+self.param.pageType);
        console.log("pageId="+self.param.pageId);

        $("#pageType").val(self.param.pageType);
        //ID处理
        if(self.param.pageId != 'undefined' && self.param.pageId !=''){
          $("#pageId").val(self.param.pageId);
        }
        
      },
      loadDataFun:function(){
        var self = this;
        common.ajax({
          type: "get",
          url:  self.url.webUrl+"/goodsClassification/goodsClassificationPage.html",
          data:{
            type: self.param.pageType,
            id: self.param.pageId
          },
          dataType: "JSON",
          success: function(data) {
            if (typeof data == "string") {
              data = JSON.parse(data);
            }
            console.log(data);
            var pageIndex = layer.msg('数据读取中', {
              icon: 16,
              time: 1000,
              shade: 0.01
            },function(){
              if(data.result){
                //加载父级品类
                var dataLength = data.varietiesList.length;
                var html = '<option value="">请选择</option>';
                for(var i = 0; i < dataLength; i++){
                  html +=  '<option value="'+data.varietiesList[i].value+'">'+data.varietiesList[i].name+'</option>';
                }
                $("#TopCategory").html(html);
                if(self.param.pageType == "edit" ){
                  console.log("这是编辑页面");
                  $("#varietiesName").val(data.goodsClassification.varietiesName);
                  var parentId = data.goodsClassification.parentId;
                  $("#TopCategory").val(parentId).attr("selected",true);
                }
                form.render('select');
                layer.close(pageIndex);
              }else{
                layer.msg("数据读取失败",{icon:5,time: 500});
              }
            });

          }
        });
      },
      submitFun:function(){
        var self = this;
        form.on('submit(submit)', function(data){
          $("#submitBtn").attr("disabled",true);
          console.log(data.field);
          common.ajax({
            type: "get",
            url:  self.url.webUrl+"/goodsClassification/goodsClassificationOperate.html",
            data: data.field,
            dataType: "JSON",
            success: function(data) {
              if (typeof data == "string") {
                data = JSON.parse(data);
              }
              console.log(data);
              //加载动画
              var submitLoading = layer.msg('数据提交中', {
                icon: 16,
                time: 0,
                shade: 0.01
              });
              //返回结果处理
              if(data.result){
                common.setItem('flag',true);
                layer.close(submitLoading);
                layer.msg(data.msg,{
                  icon:1,
                  time: 1000
                },function(){
                  parent.layer.close(self.url.frameIndex);
                });
              }else{
                layer.close(submitLoading);
                layer.msg(data.msg,{
                  icon:5,
                  time: 800
                },function(){
                  $("#submitBtn").attr("disabled",false);
                });
              }
            }
          });
          return false; //阻止表单跳转
        });
      },
      cancleLayerFun:function(){
        var self = this;
        $("#cancleBtn").on("click",function(){
          parent.layer.closeAll();
        });
      },

    };
    var app = new App();
});
