/**
 * 商品分类列表
 */
layui.config({
   base: '/statics/js/common/' //layui自定义layui组件目录
});
layui.use(['jquery','common','laypage','form','artTemplate','loadList'], function() {
  var $ = layui.jquery,
			layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
			layer = layui.layer, //获取当前窗口的layer对象
      common = layui.common,
      laypage = layui.laypage,
			form = layui.form(),
      loadList = layui.loadList,
      artTemplate = layui.artTemplate();
  var App = function(){
      this.url = {
        webUrl: common.urlConfig("webUrl"),//接口路径
      };

      this.init();//页面初始化
      this.oprationFun();//添加、修改
      this.getTopCategoryFun();//获取父级品类列表
      this.searchFun();//搜索
      this.statusSwichFun();//活动状态切换
    };
    App.prototype = {
      init:function(){
        var self = this;
        self.pageSize = 10;
        self.listFun();
      },
      oprationFun:function(){
        var self = this;
        $(document).on("click",".operationBtn",function(){
          var operationType = $(this).attr("data-type"),
              dataId = $(this).attr("data-id");

          top.layer.open({
             type: 2,
             title: "品类管理",
             area: ['480px', '280px'],
             fixed: true, //不固定
             maxmin: false,
             resize: false,
             content: '/module/financialLife/goodsManage/category.html?type='+operationType+'&pageId='+dataId,
             end:function(){
              if(common.getItem('flag')){
                self.listFun();
                common.delItem('flag')
              }
             }
          });
        });
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
          url: '/goodsClassification/goodsClassificationList.html',
          pageSize: self.pageSize,
          currentPage: curPage,
          parame: parame
        },param);
      },
      getTopCategoryFun:function(){
        var self = this;
        common.ajax({
          type: "get",
          url:  self.url.webUrl+"/goods/queryChannelAndSortList.html",
          dataType: "JSON",
          success: function(data) {

            console.log(data);
            if(data.result){
              //加载父级品类
              var dataLength = data.varietiesList.length;
              var html = '<option value="">请选择</option>';
              for(var i = 0; i < dataLength; i++){
                html +=  '<option value="'+data.varietiesList[i].value+'">'+data.varietiesList[i].name+'</option>';
              }
              $("#searchType").html(html);
              form.render('select');
            }else{
              layer.msg("数据读取失败",{icon:5,time: 500});
            }
          }
        });
      },
      searchFun:function(){
        var self = this;
        form.on('submit(search)', function(data){
          console.log(data.field); //当前容器的全部表单字段
          parame = data.field;
          self.listFun({
            parame: parame
          });
          return false; //阻止表单跳转
        });
      },
      statusSwichFun:function(){
        var self = this;
        form.on('switch(status)', function(data) {
           console.log(data);
           console.log(data.elem.checked); //开关是否开启，true或者false
           var idVal = data.value;
           console.log(idVal);
           common.ajax({
             type: "get",
             url:  self.url.webUrl+"/goodsClassification/setGoodsClassificationStatus.html",
             dataType: "JSON",
             data:{
               id: idVal
             },
             success: function(json) {
               if (typeof json == "string") {
                 json = JSON.parse(json);
               }
               console.log(json);
               if(json.result){
                 layer.msg(json.msg,{icon:1,time: 1000},function(){
                    self.listFun();
                 });
               }else{
                 data.elem.checked = false;
                 form.render();
                 layer.msg(json.msg,{icon:5,time: 1500});
               }
             }
           });

        });
      },
    };
    var app = new App();
});
