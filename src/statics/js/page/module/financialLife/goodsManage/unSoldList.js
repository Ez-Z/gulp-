/**
 * 未上架商品列表
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
      artTemplate = layui.artTemplate(),
      loadList = layui.loadList;

  var App = function(){
      this.url = {
        webUrl: common.urlConfig("webUrl"),//接口路径
      };

      this.init();//页面初始化
      this.btnGroupFun();//按钮组
      this.oprationFun();//添加、修改
      this.batchAddFun();//批量添加
      this.loadSearchSelectDataFun();//获取搜索区域下拉框数据
      this.loadNextCategoryFun();//加载二级品类
      this.searchFun();//搜索
      this.statusSwichFun();//是否上架切换
    };
    App.prototype = {
      init:function(){
        var self = this;        
      },
      btnGroupFun:function(){
        var self = this;
        $(".btn-group").on("click",function(){
          var $this = $(this),
              dataStatus = $this.attr("data-status");//状态

          $this.removeClass('layui-btn-primary').siblings().addClass('layui-btn-primary');
          console.log("dataStatus="+dataStatus);

          self.listFun({},{"status":dataStatus});
        });
      },
      oprationFun:function(){
        var self = this;
        $(document).on("click",".operationBtn",function(){
          var operationType = $(this).attr("data-type"),
              dataId = $(this).attr("data-id");

          if(operationType == 'specification'){
            top.layer.open({
              type: 2,
              title: "商品规格",
              area: ['920px', '600px'],
              fixed: true,
              maxmin: false,
              resize: false,
              content: '/module/financialLife/goodsManage/goodsSpecificationList.html?pageId='+dataId,
              end:function(){
                if(common.getItem('flag')){
                  self.listFun();
                  common.delItem('flag')
                }
              }
            });        
          }else{
            
           top.layer.open({
              type: 2,
              title: "商品信息",
              area: ['920px', '600px'],
              fixed: true,
              maxmin: true,
              resize: false,
              content: '/module/financialLife/goodsManage/goods.html?type='+operationType+'&pageId='+dataId,
              end:function(){
                if(common.getItem('flag')){
                  self.listFun();
                  common.delItem('flag')
                }
              }
            });
            //layer.full(openLayer);    
          }
        });
      },
      batchAddFun:function(){
        var self = this;

        $(".batchBtn").on("click",function(){
          top.layer.open({
            type: 2,
            title: "批量新增商品",
            area: ['600px', '300px'],
            fixed: true,
            maxmin: false,
            resize: false,
            content: '/module/financialLife/goodsManage/goodsBatch.html',
            end:function(){
              self.listFun();
            }
          });
        });

      },
      loadSearchSelectDataFun:function(){
        var self = this;
        common.ajax({
          type: "get",
          url:  self.url.webUrl+"/goods/queryChannelAndSortList.html",
          dataType: "JSON",
          success: function(data) {
            console.log(data);
            if(data.result){
              //加载渠道来源
              var channelListLength = data.channelList.length;
              console.log("channelListLength="+channelListLength);
              var channelListHtml = '<option value="">请选择</option>';
              for(var i = 0; i < channelListLength; i++){
                channelListHtml +=  '<option value="'+data.channelList[i].id+'">'+data.channelList[i].channelName+'</option>';
              }
              $("#channelList").html(channelListHtml);

              //加载父级品类
              var varietiesListDataLength = data.varietiesList.length;
              var varietiesListHtml = '<option value="">请选择</option>';
              for(var i = 0; i < varietiesListDataLength; i++){
                varietiesListHtml +=  '<option value="'+data.varietiesList[i].value+'">'+data.varietiesList[i].name+'</option>';
              }
              $("#varietiesList").html(varietiesListHtml);

              form.render('select');
              //搜索条件加载成功后加载列表数据
              self.listFun({},{"status":0}); 
            }else{
              layer.msg("数据读取失败",{icon:5,time: 500});
            }
          }
        });
      },
      loadNextCategoryFun:function(){
        var self = this;
        form.on('select(topCate)', function(data){
          var parentIdVal = data.value;
          common.ajax({
            type: "get",
            url:  self.url.webUrl+"/goodsClassification/loadGoodsClassificationList.html",
            data:{
              parentId: parentIdVal
            },
            dataType: "JSON",
            success: function(data) {
              console.log(data);
              if(data.result){
                //加载子级品类
                var levelTwoListDdataLength = data.dataList.length;
                if(levelTwoListDdataLength > 0){
                  var levelTwoListHtml = '<option value="">请选择</option>';
                  for(var i = 0; i < levelTwoListDdataLength; i++){
                    levelTwoListHtml +=  '<option value="'+data.dataList[i].id+'">'+data.dataList[i].varietiesName+'</option>';
                  }
                  $("#levelTwoList").attr("disabled",false);
                  $("#levelTwoList").html(levelTwoListHtml);
                }else{
                  $("#levelTwoList").val("").attr("disabled",true);
                }
                form.render('select');
              }else{
                layer.msg("数据读取失败",{icon:5,time: 500});
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
          url: '/goods/queryGoodsByStatus.html',
          pageSize: self.pageSize,
          currentPage: curPage,
          parame: parame
        },param);
        
      },
      searchFun:function(){
        var self = this;
        form.on('submit(search)', function(data){
          console.log(data.field); //当前容器的全部表单字段
          //parame = data.field;
          self.listFun({'parame':data.field});
          return false; //阻止表单跳转
        });
      },
      statusSwichFun:function(){
        var self = this;
        form.on('switch(status)', function(data) {
          console.log(data.elem.checked); //开关是否开启，true或者false
          var goodsIdVal = data.value,//商品ID
               goodsName = data.elem.title,
               remainStock = $(this).attr("data-remainStock"),//当前库存 
               num= $(this).attr("data-num");//是否配置门槛

          console.log("goodsName="+goodsName);

          if(remainStock == 0 || remainStock == "" || remainStock == undefined){
            data.elem.checked = false;
            form.render();
            top.layer.open({
              title: '提示',
              content: '库存为0的商品不可上架',
              end:function(){
                self.listFun();
              }
            });
          }else if(num == 0){
            data.elem.checked = false;
            form.render();
            var tipLayer = top.layer.open({
              title: '提示',
              content: '上架商品前，请先配置商品白领门槛',
              btn: ['前往配置','取消'],
              yes:function(){
                parent.layer.close(tipLayer);
                top.layer.open({
                  type: 2,
                  title: "商品门槛设置",
                  area: ['920px', '600px'],
                  fixed: true, //不固定
                  maxmin: false,
                  content: '/module/financialLife/goodsManage/goodsThresholdSetting.html?goodsId='+goodsIdVal,
                  end:function(){
                    self.listFun();
                  }
                });
              }
            });
          }else{
            if(data.elem.checked){
              data.elem.checked = false;
            }else{
              data.elem.checked = true;
            }
            
            form.render();
            var tipLayer2 = top.layer.open({
              title: '提示',
              content: '你将上架商品（['+goodsName+']），点击确定，完成上架。商品上架后可前往已上架商品列表中查看',
              btn: ['确定','取消'],
              yes:function(){
                parent.layer.close(tipLayer2);
                common.ajax({
                  type: "get",
                  url:  self.url.webUrl+"/goods/recommendOrOff.html",
                  dataType: "JSON",
                  data:{
                    "goodsId": goodsIdVal,
                    "isOff": 1
                  },
                  success: function(json) {
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
              },
              end:function(){
                self.listFun();
              }
            });            
          }

        });
      },
    };
    var app = new App();
});
