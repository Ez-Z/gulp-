/**
 *  商品门槛设置列表
 */
layui.config({
   base: '/statics/js/common/' //layui自定义layui组件目录
});
layui.use(['jquery','form','common','artTemplate','loadList'], function() {
  var $ = layui.jquery,
			layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
			layer = layui.layer, //获取当前窗口的layer对象
			form = layui.form(),
      common = layui.common,
      artTemplate = layui.artTemplate(),
      loadList = layui.loadList;

  var App = function(){
      this.url = {
        webUrl: common.urlConfig("webUrl"),//接口路径
        frameIndex: parent.layer.getFrameIndex(window.name),//获取iframeId
      };

      this.param = {
        goodsId: common.getUrlParam("goodsId"),//商品ID
      };

      this.init();//页面初始化
      this.goodsThresholdOptFun();//添加-修改-删除商品门槛
      this.submitFun();//表单提交
      this.cancleLayerFun();//关闭弹出窗口
    };
    App.prototype = {
      init:function(){
        var self = this;
        console.log("商品门槛设置");

        //读取列表
        var data={
          'goodsId': self.param.goodsId
        }
        self.listFun({'parame':data});
      },
      listFun:function(opt){
        var self = this;
        if(!opt && typeof opt !== 'object'){
          opt = {};
        }
        var param = arguments[1],
          curPage = opt.currentPage,
          parame = opt.parame;
        loadList({
          url: '/goodsThreshold/queryGoodsThreshold.html',
          pageSize: self.pageSize,
          currentPage: curPage,
          parame: parame
        },param);

      },
      goodsThresholdOptFun:function(){
        var self = this;
        $(document).on("click",".j-optBtn",function(){
          var optType = $(this).attr("data-type"),//操作类型
              dataId = $(this).attr("data-id"),//记录Id
              profitRateVal = $("#goodsProfitRate").val(),//商品收益率
              goodsWorthVal = $("#goodsWorth").val();//商品售价

          if(optType == "delete"){
            console.log("这是删除");

            var confirmLayer = layer.confirm('是否删除该记录？', {icon: 3, title:'提示'}, function(){
              common.ajax({
                type: "get",
                url:  self.url.webUrl+"/goodsThreshold/goodsThresholdOperate.html",
                dataType: "JSON",
                data: {
                  "type": optType,
                  "id": dataId
                },
                success: function(data) {
                  console.log(data);
                  if(data.result){
                    layer.close(confirmLayer);
                    layer.msg(data.msg, {
                      icon: 1
                    },function(){
                      var data={
                        'goodsId': self.param.goodsId
                      }
                      self.listFun({'parame':data});
                    });
                  }else{
                    parent.layer.msg('删除失败！', {icon: 5});
                  }
                }
              });
            });
          }else{
            if(profitRateVal == ""){
              layer.msg("请先设置商品收益率");
            }else{
              top.layer.open({
                type: 2,
                title: "商品门槛",
                area: ['500px', '460px'],
                fixed: true, //不固定
                maxmin: false,
                resize: false,
                content: '/module/financialLife/goodsManage/goodsThreshold.html?pageId='+dataId+'&profitRateVal='+profitRateVal+'&pageType='+optType+'&goodsWorth='+goodsWorthVal+'&goodsId='+self.param.goodsId,
                end:function(){
                  var data={
                    'goodsId': self.param.goodsId
                  }
                  self.listFun({'parame':data});
                }
              });
            }
          }
        });
      },
      submitFun:function(){
        var self = this;
        form.on('submit(submit)', function(data){
          parent.layer.close(self.url.frameIndex);
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
