/**
 *  商品信息
 */
layui.config({
   base: '/statics/js/common/' //layui自定义layui组件目录
});
layui.use(['jquery','form','common','artTemplate','uploadify'], function() {
  var $ = layui.jquery,
			layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
			layer = layui.layer, //获取当前窗口的layer对象
			form = layui.form(),
      common = layui.common,
      artTemplate = layui.artTemplate(),
      uploadify = layui.uploadify;

  var App = function(){
      this.url = {
        webUrl: common.urlConfig('webUrl'),//接口路径
        fileSever: common.urlConfig('fileSever'),//图片上传接口
        imageSeverPath: common.urlConfig('imageSeverPath'),//图片服务器路径
        frameIndex: parent.layer.getFrameIndex(window.name),//获取iframeId
      };

      this.param = {
        pageType: common.getUrlParam("type"),//页面类型
        pageId: common.getUrlParam("pageId"),//页面Id
      };

      this.init();//页面初始化
      this.loadDataFun();//加载页面数据
      // this.loadLinkAgeListFun();//类别加载
      this.formVerifyFun();//表单验证
      this.formMonitorFun();//表单提交
      this.cancleLayerFun();//关闭弹出窗口
    };
    App.prototype = {
      init:function(E){
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
        if(self.param.pageType == "edit"){
          common.ajax({
            type: "get",
            url:  self.url.webUrl+"/regSetting/RegpageConfigById.html",
            dataType: "JSON",
            data:{
              "id": self.param.pageId
            },
            success: function(data) {
              console.log(data);
              var pageLoadingIndex = layer.msg('数据加载中', {
                icon: 16,
                time: 300,
                shade: 0.02
              },function(){
                if(data.result){
                  //渲染页面数据
                  var html = template("pageTpl", data);
                  $('#pageData').html(html);

                  //加载图片上传插件
                  //落地页banner图
                  var headPicList = '';
                  if(data.headList){
                      headPicList = data.headList;
                  }
                  uploadify('headPic', 3, headPicList);

                  //落地页底图
                  var bottomPicList = '';
                  if(data.bottomList){
                      bottomPicList = data.bottomList;
                  }
                  console.log(bottomPicList);
                  uploadify('bottomPic', 3, bottomPicList);

                  //编辑回显
                  if(self.param.pageType == "edit"){
                    console.log("这是编辑页面");
                    //类别选中处理
                    var typeVal = data.regpageConfig.typeId;
                    $("#typeId").val(typeVal).attr("selected",true);
                  }

                  //更新渲染表单
                  form.render();
                  layer.close(pageLoadingIndex);
                }else{
                  layer.msg("数据读取失败",{icon:5,time: 500});
                }
              });
            }
          });
        }else {
          var html = template("pageTpl", {});
          $('#pageData').html(html);
          //加载图片上传插件
          //落地页banner图
          var headPicList = '';
          uploadify('headPic', 3, headPicList);

          //落地页底图
          var bottomPicList = '';
          uploadify('bottomPic', 3, bottomPicList);
          self.loadLinkAgeListFun();
          form.render();
        }

      },
      loadLinkAgeListFun:function(id){
        var self = this;
        common.ajax({
          type: "get",
          url:  self.url.webUrl+"/regSetting/LinkAgeList.html",
          dataType: "JSON",
          success: function(data) {
            console.log("类别："+data);
            if(data.result){
              //加载落地页类别
              var dataLength = data.dataList.length;
              var html = '<option value="">请选择</option>';
              for(let i = 0; i < dataLength; i++){
                html +=  '<option value="'+data.dataList[i].value+'">'+data.dataList[i].name+'</option>';
              }

              $("#typeId").html(html);
              form.render('select');
            }else{
              layer.msg("数据读取失败",{icon:5,time: 500});
            }
          }
        });
      },
      formVerifyFun:function(){
        var self = this;
        form.verify({
          headPic: function(value){
            if(value == ""){
              return '请上传落地页banner图片';
            }
          },
          bottomPic: function(value){
            if(value == ""){
              return '请上传落地页底部图片';
            }
          },
          backgroundColor:[
            /^#[0-9a-fA-F]{3,6}$/,'请输入正确的页面背景颜色值'
          ],
        });
      },
      formMonitorFun:function(){
        var self = this;

        //表单提交监听
        form.on('submit(Submit)', function(data){
          $("#submitBtn").attr("disabled",true);

          common.ajax({
            type: "POST",
            url:  self.url.webUrl+"/regSetting/addRegpageConfig.html",
            data: data.field,
            dataType: "JSON",
            traditional:true,
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
          parent.layer.close(self.url.frameIndex);
        });
      },
    };
    var app = new App();
});
