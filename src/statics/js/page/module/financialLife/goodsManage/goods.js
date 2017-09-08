/**
 *  商品信息
 */
layui.config({
   base: '/statics/js/common/' //layui自定义layui组件目录
});
layui.use(['jquery','form','common','artTemplate','ckEditor','uploadify'], function() {
  var $ = layui.jquery,
			layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
			layer = layui.layer, //获取当前窗口的layer对象
			form = layui.form(),
      common = layui.common,
      artTemplate = layui.artTemplate(),
      uploadify = layui.uploadify,
      ckEditor = layui.ckEditor;

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
        common.ajax({
          type: "get",
          url:  self.url.webUrl+"/goods/goodsPage.html",
          dataType: "JSON",
          data:{
            "type": self.param.pageType,
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

                //加载编辑器
                ckEditor('goodsDetail');

                //加载图片上传插件
                //列表页产品展示
                var listPicList = '';
                if(data.listPagePicList){
                    listPicList = data.listPagePicList;
                }
                uploadify('listPagePic', 1, listPicList);
                
                //详情页产品展示
                var detailPicList = '';
                if(data.detailPagePicList){
                    detailPicList = data.detailPagePicList;
                }
                uploadify('detailPagePic', 5, detailPicList);

                //商品图片展示
                var graphicDetailPicList = '';
                if(data.graphicDetailPicList){
                    graphicDetailPicList = data.graphicDetailPicList;
                }
                uploadify('graphicDetailPic', 20, graphicDetailPicList);
                
                //编辑回显
                if(self.param.pageType == "edit"){
                  console.log("这是编辑页面");
                  //渠道名称选中处理
                  var channelIdVal = data.goods.channelId;
                  $("#channelId").val(channelIdVal).attr("selected",true);
                  self.loadChannelConfigFun(channelIdVal);

                  //商品品类选中处理
                  if(data.goods.goodsLevelOneVarieties){
                    var goodsLevelOneVarietiesVal = data.goods.goodsLevelOneVarieties;
                    $("#goodsLevelOneVarieties").val(goodsLevelOneVarietiesVal).attr("selected",true);
                    var goodsLevelTwoVarietiesVal = data.goods.goodsLevelTwoVarieties;
                    self.loadNextCategoryFun(goodsLevelOneVarietiesVal,goodsLevelTwoVarietiesVal);
                  }
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
      },
      loadNextCategoryFun:function(parentId,currentId){
        var self = this;
        common.ajax({
          type: "get",
          url:  self.url.webUrl+"/goodsClassification/loadGoodsClassificationList.html",
          data:{
            parentId: parentId
          },
          dataType: "JSON",
          success: function(data) {
            console.log(data);
            if(data.result){
              //加载子级品类
              var dataLength = data.dataList.length;
              if(dataLength > 0){
                var html = '<option value="">请选择</option>';
                for(var i = 0; i < dataLength; i++){
                  html +=  '<option value="'+data.dataList[i].id+'">'+data.dataList[i].varietiesName+'</option>';
                }
                $("#goodsLevelTwoVarieties").attr("disabled",false);
                $("#goodsLevelTwoVarieties").html(html);

                console.log("currentId="+currentId)
                if(currentId){
                  console.log("true")
                  $("#goodsLevelTwoVarieties").val(currentId).attr("selected",true);
                }
              }else{
                $("#goodsLevelTwoVarieties").val("").attr("disabled",true);
              }
              form.render();
            }else{
              layer.msg("数据读取失败",{icon:5,time: 500});
            }
          }
        });
      },
      loadChannelConfigFun:function(id){
        var self = this;
        common.ajax({
          type: "get",
          url:  self.url.webUrl+"/channelConfig/loadChannelConfigInfo.html",
          data:{
            id: id
          },
          dataType: "JSON",
          success: function(data) {
            console.log(data);
            if(data.result){
              //渲染页面数据
              var html = template("channelConfigTpl", data);
              $('#channelConfigData').html(html);
              //加载编辑器
              ckEditor('remarkEditor');
              form.render();
            }else{
              layer.msg("数据读取失败",{icon:5,time: 500});
            }
          }
        });
      },
      formMonitorFun:function(){
        var self = this;
        var goodsDetailVal="";
        
        function CKupdate() {
          for (var instance in CKEDITOR.instances) CKEDITOR.instances[instance].updateElement();
          goodsDetailVal = $("#goodsDetail").val();
        }

        //表单提交监听
        form.on('submit(goodSubmit)', function(data){
          $("#submitBtn").attr("disabled",true);
          CKupdate();
          //更新渲染表单
          data.field.goodsDetail = goodsDetailVal;
          console.log(data.field);
          console.log("goodSubmit");

          common.ajax({
            type: "POST",
            url:  self.url.webUrl+"/goods/goodsOperate.html",
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

        //二级品类监听
        form.on('select(topCate)', function(data){
          var parentIdVal = data.value;
          console.log("父级Id="+parentIdVal);
          self.loadNextCategoryFun(parentIdVal);
        });

        //渠道来源监听
        form.on('select(channel)', function(data){
          var idVal = data.value;
          console.log("渠道Id="+idVal);
          self.loadChannelConfigFun(idVal);
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
