/**
 *  商品规格
 */
layui.config({
   base: '/statics/js/common/' //layui自定义layui组件目录
});
layui.use(['jquery','form','common','artTemplate'], function() {
  var $ = layui.jquery,
			layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
			layer = layui.layer, //获取当前窗口的layer对象
			form = layui.form(),
      common = layui.common,
      artTemplate = layui.artTemplate();

  var App = function(){
      this.url = {
        webUrl: common.urlConfig("webUrl"),//接口路径
        frameIndex: parent.layer.getFrameIndex(window.name),//获取iframeId
      };

      this.param = {
        pageType: common.getUrlParam("pageType"),//页面类型
        pageId: common.getUrlParam("pageId"),//商品ID
        goodsId: common.getUrlParam("goodsId"),//商品ID
      };

      this.init();//页面初始化
      this.loadDataFun();//页面数据读取
      this.submitFun();//表单提交
      this.cancleLayerFun();//关闭弹出窗口
    };
    App.prototype = {
      init:function(){
        var self = this;
        $("#pageType").val(self.param.pageType);
        $("#goodsId").val(self.param.goodsId);

        console.log("frameIndex="+self.url.frameIndex);
        
        //pageId处理
        if(self.param.pageId != 'undefined' && self.param.pageId !=''){
          $("#specificationId").val(self.param.pageId);
        }
        
      },
      loadDataFun:function(){
        var self = this;
        if(self.param.pageType == "edit"){
          common.ajax({
            type: "get",
            url:  self.url.webUrl+"/goodsSpecification/goodsSpecificationPage.html",
            dataType: "JSON",
            data:{
              "type": self.param.pageType,
              "id": self.param.pageId
            },
            success: function(data) {
              console.log(data);
              if(data.result){
                layer.msg('数据加载中', {
                  icon: 16,
                  time: 500,
                  shade: 0.01
                },function(){
                  //加载商品规格数据
                  $("#goodsModel").val(data.goodsSpecification.goodsModel);//商品型号
                  $("#goodsColour").val(data.goodsSpecification.goodsColour);//商品颜色
                  $("#stock").val(data.goodsSpecification.stock);//数量
                });
              }else{
                layer.msg("数据加载失败",{icon:5,time: 500});
              }
            }
          });
        }
      },
      submitFun:function(){
        var self = this;
        form.on('submit(submit)', function(data){
          $("#submitBtn").attr("disabled",true);
          form.render(); 
          console.log(data.field);
          common.ajax({
            type: "get",
            url:  self.url.webUrl+"/goodsSpecification/goodsSpecificationOperate.html",
            data: data.field,
            dataType: "JSON",
            success: function(data) {
              console.log(data);
              //加载动画
              var submitLoading = layer.msg('数据提交中', {
                icon: 16,
                time: 0,
                shade: 0.01
              });
              //返回结果处理
              if(data.result){
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
                  icon:5,time: 800
                },function(){
                  $("#submitBtn").attr("disabled",false);
                });
              }
            }
          });
          return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
      },
      cancleLayerFun:function(){
        var self = this;
        $("#cancleBtn").on("click",function(){
          parent.layer.close(self.url.frameIndex);
        });
      },

    };
    var app = new App();
});
