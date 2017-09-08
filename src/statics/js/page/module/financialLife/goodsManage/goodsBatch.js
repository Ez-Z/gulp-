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

      this.init();//页面初始化
      this.submitFun();//表单提交
      this.cancleLayerFun();//关闭弹出窗口
    };
    App.prototype = {
      init:function(){
        var self = this;

      },
      submitFun:function(){
        var self = this;
        form.on('submit(submit)', function(data){
          console.log(data.field);
          common.ajax({
            type: "get",
            url:  self.url.webUrl+"/showjoy/getSkuInfo.html",
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
                layer.close(submitLoading);
                layer.msg(data.msg,{
                  icon:1,
                  time: 1000
                },function(){
                  parent.layer.close(self.url.frameIndex);
                });
              }else{
                layer.close(submitLoading);
                layer.msg(data.msg,{icon:5,time: 800});
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
