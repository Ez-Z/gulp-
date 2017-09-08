/**
 *  商品规格列表
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
        pageId: common.getUrlParam("pageId"),//商品ID
      };

      this.init();//页面初始化
      this.optionFun();//添加-修改-删除商品规格
      this.cancleLayerFun();//关闭弹出窗口
    };
    App.prototype = {
      init:function(){
        var self = this;
        self.listFun({},{"goodsId":self.param.pageId});
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
          url: '/goodsSpecification/queryGoodsSpecList.html',
          pageSize: self.pageSize,
          currentPage: curPage,
          parame: parame
        },param);
      },
      optionFun:function(){
        var self = this;
        $(document).on("click",".j-optBtn",function(){
          var optType = $(this).attr("data-type"),
              dataId = $(this).attr("data-id");
          
          console.log("optType="+optType); 
          console.log("dataId="+dataId); 
          if(optType == "delete"){
            console.log("这是删除");
            top.layer.confirm('是否删除该记录？', {icon: 3, title:'提示'}, function(){
              common.ajax({
                type: "get",
                url:  self.url.webUrl+"/goodsSpecification/goodsSpecificationOperate.html",
                dataType: "JSON",
                data: {
                  "type": optType,
                  "id": dataId
                },
                success: function(data) {
                  //console.log(data);
                  if(data.result){
                    common.setItem('flag',true);
                    parent.layer.msg('删除成功！', {
                        icon: 1
                    },function(){
                        self.listFun();
                    });
                  }else{
                    parent.layer.msg('删除失败！', {icon: 5});
                  }
                }
              });
            });
          }else{
            top.layer.open({
               type: 2,
               title: "商品规格",
               area: ['400px', '300px'],
               fixed: true, 
               maxmin: false,
               shade: 0.01,
               resize: false,
               content: '/module/financialLife/goodsManage/goodsSpecification.html?pageId='+dataId+'&pageType='+optType+'&goodsId='+self.param.pageId,
               end:function(){
                 self.listFun();
               }
            });
          }
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
