/**
 *  已上架商品列表
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
      this.oprationFun();//修改
      this.loadSearchSelectDataFun();//获取搜索区域下拉框数据
      this.loadNextCategoryFun();//加载二级品类
      this.searchFun();//搜索
      this.statusSwichFun();//活动状态切换
      this.goodsThresholdFun();//查看商品门槛
    };
    App.prototype = {
      init:function(){
        var self = this;
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
              maxmin: false,
              resize: false,
              content: '/module/financialLife/goodsManage/goods.html?type='+operationType+'&pageId='+dataId,
              end:function(){
                if(common.getItem('flag')){
                  self.listFun();
                  common.delItem('flag')
                }
              }
            });
          }
        });
      },
      loadSearchSelectDataFun:function(){
        var self = this;
        common.ajax({
          type: "get",
          url:  self.url.webUrl+"/goods/queryChannelAndSortList.html",
          dataType: "JSON",
          success: function(data) {
            if (typeof data == "string") {
              data = JSON.parse(data);
            }
            console.log(data);
            if(data.result){
              //加载渠道来源
              if(data.channelList){
                var channelListLength = data.channelList.length;
                var channelListHtml = '<option value="">请选择</option>';
                for(var i = 0; i < channelListLength; i++){
                  channelListHtml +=  '<option value="'+data.channelList[i].id+'">'+data.channelList[i].channelName+'</option>';
                }
                $("#channelList").html(channelListHtml);
              }
              
              //加载父级品类
              if(data.varietiesList){
                var varietiesListDataLength = data.varietiesList.length;
                var varietiesListHtml = '<option value="">请选择</option>';
                for(var i = 0; i < varietiesListDataLength; i++){
                  varietiesListHtml +=  '<option value="'+data.varietiesList[i].value+'">'+data.varietiesList[i].name+'</option>';
                }
                $("#varietiesList").html(varietiesListHtml);
              }
              

              //加载商品状态
              if(data.onShelfStatus){
                var onShelfStatusLength = data.onShelfStatus.length;
                var onShelfStatusHtml = '<option value="">请选择</option>';
                for(var i = 0; i < onShelfStatusLength; i++){
                  onShelfStatusHtml +=  '<option value="'+data.onShelfStatus[i].value+'">'+data.onShelfStatus[i].name+'</option>';
                }
                $("#onShelfStatus").html(onShelfStatusHtml);
              }
              
              form.render('select');
              //搜索条件加载成功后加载列表数据
              self.listFun();   

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
              if (typeof data == "string") {
                data = JSON.parse(data);
              }
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
          url: '/goods/goodsUpperList.html',
          pageSize: self.pageSize,
          currentPage: curPage,
          parame: parame
        },param);
      },
      searchFun:function(){
        var self = this;
        form.on('submit(search)', function(data){
          console.log(data.field); //当前容器的全部表单字段
          self.listFun({'parame':data.field});
          return false; //阻止表单跳转
        });
      },
      statusSwichFun:function(){
        var self = this;
        //是否推荐
        form.on('switch(isRecommend)', function(data) {
          console.log(data.elem.title);
          console.log(data.elem.checked); //开关是否开启，true或者false
          console.log(data.value); //开关value值
          
          var goodsIdVal = data.value,
              statusType = data.elem.title,
              checkedVal = "",
              checkedStatus;
          
          if(data.elem.checked){
            checkedVal = 1;
            checkedStatus = false;
          }else{
            checkedVal = 0;
            checkedStatus = true;
          }

          common.ajax({
            type: "get",
            url:  self.url.webUrl+"/goods/recommendOrOff.html",
            dataType: "JSON",
            data: {
              goodsId: goodsIdVal,
              isRecommend: checkedVal
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
                data.elem.checked = checkedStatus;
                form.render();
                layer.msg(json.msg,{icon:5,time: 1500});
              }
            }
          });
        });
        //是否下架
        form.on('switch(isOff)', function(data) {
          console.log(data.elem.title);
          console.log(data.elem.checked); //开关是否开启，true或者false
          console.log(data.value); //开关value值
          
          var goodsIdVal = data.value,
              goodsName = data.elem.title;

          var tipLayer2 = top.layer.open({
            title: '提示',
            content: '你将下架商品（['+goodsName+']），将无法查看和购买。商品下架后可在未上架商品列表中查看。',
            btn: ['确定','取消'],
            yes:function(){
              parent.layer.close(tipLayer2);
              common.ajax({
                type: "get",
                url:  self.url.webUrl+"/goods/recommendOrOff.html",
                dataType: "JSON",
                data:{
                  "goodsId": goodsIdVal,
                  "isOff": 0
                },
                success: function(json) {
                  console.log(json);
                  if(json.result){
                    layer.msg(json.msg,{icon:1,time: 1000},function(){
                      currentPage = 1;//当前页
                      parame = {};//参数
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
            btn2:function(){
              data.elem.checked = false;
              form.render();
            },
            end:function(){
              self.listFun();
            }
          });
        });

      },
      goodsThresholdFun:function(){
        var self = this;
        $(document).on("click",".j-goodsThreshold",function(){
          var goodsIdVal = $(this).attr("data-id");
          top.layer.open({
             type: 2,
             title: "商品门槛设置",
             area: ['920px', '600px'],
             fixed: true, //不固定
             maxmin: false,
             content: '/module/financialLife/goodsManage/goodsThresholdSetting.html?goodsId='+goodsIdVal,
             end:function(){
              if(common.getItem('flag')){
                self.listFun();
                common.delItem('flag')
              }
             }
          });

        });
      },
    };
    var app = new App();
});
