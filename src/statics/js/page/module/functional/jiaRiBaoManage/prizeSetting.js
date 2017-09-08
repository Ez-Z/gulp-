/**
 * qbm-manage 奖项设置
 * Autor: chenqq
 * Date: 17-06-21
 */
 layui.config({
    base: '/statics/js/common/' //layui自定义layui组件目录
 });
layui.use(['jquery','form','layer','common'], function(exports) {
  var $ = layui.jquery,
			layer = layui.layer,
			form = layui.form(),
      common = layui.common;

  var App = function(){
    this.url = {
      webUrl: common.urlConfig('webUrl'),//接口路径
      fileSever: common.urlConfig('fileSever'),//图片上传接口
      imageSeverPath: common.urlConfig('imageSeverPath'),//图片服务器路径
      frameIndex: parent.layer.getFrameIndex(window.name),//获取iframeId
    };

    this.param = {
      pageType: common.getUrlParam('type'),//页面类型
      activityStatus: common.getUrlParam('status'),//活动状态
      pageNid: common.getUrlParam('nid'),//获取活动nid
      getType:"loading",
    };

    this.init();//页面初始化
    this.prizeOptFun();//奖品处理-添加-删除-修改
    this.formSubmitFun();//表单提交
    this.cancleBtnFun();//关闭弹窗
  };
  App.prototype = {
    init:function(){
      var self = this;

      $("#pageNid").val(self.param.pageNid);

      //活动结束处理
      if(self.param.activityStatus == 2){
        $("#submitBtn").addClass("hide");//隐藏提交按钮
      }
      self.getSettinStatusFun(self.param.getType);

    },
    getSettinStatusFun:function(param){//获取奖品设置状态
      var self = this;
      common.ajax({
        type: "get",
        url:  self.url.webUrl+"/manageHoliday/getHolidayGiftStatus.html",
        dataType: "JSON",
        data:{
          nid: self.param.pageNid
        },
        success: function(data) {
          if (typeof data == "string") {
            data = JSON.parse(data);
          }
          console.log(data);
          var editPageIndex = layer.msg('数据读取中', {
            icon: 16,
            time: 600,
            shade: 0.01
          },function(){
            if(data.result){
              //状态处理
              if(data.status){//编辑状态
                $("#pageType").val("edit");
              }else{//添加状态
                $("#pageType").val("add");
              }

              //加载奖品信息
              self.getPageInfoFun("bigPrize",1,self.param.getType);//获取大奖信息
              self.getPageInfoFun("smallPrize",2,self.param.getType);//获取小奖信息
              self.getPageInfoFun("generalPrize",0,self.param.getType);//获取普通奖信息

              //解锁条件下拉列表处理
              var unlockListLength = data.unlockList.length;
              if(unlockListLength >= 0 && self.param.getType == "loading"){
                var html = '<option value="">请选择</option>';
                for(var i = 0; i < unlockListLength; i++){
                  html +=  '<option value="'+data.unlockList[i].type+'">'+data.unlockList[i].name+'</option>';
                }
                $(".selectBox").html(html);
                form.render('select');
              }

              layer.close(editPageIndex);
            }else{
              layer.msg("数据读取失败",{icon:5,time: 500});
            }
          });
        }
      });
    },
    getPageInfoFun:function(elem,giftTypeVal,getType){//获取页面信息
      var self = this;
      console.log("elem="+elem);
      common.ajax({
        type: 'get',
        url: self.url.webUrl+'/manageHoliday/getAllHolidayGiftInfo.html',
        dataType: "JSON",
        data:{
          nid: self.param.pageNid,
          giftType: giftTypeVal
        },
        success:function(data){
          console.log("---------------------获取页面信息----------------------------");
          console.log(data);
          //console.log("unlock=====" +data.unlock);
          //ID赋值
          if(data.unlock != undefined && getType == "loading"){
            $("#"+elem+"Id").val(data.unlock.id);
            //解锁条件处理
            var unlockType = data.unlock.unlockType;//选中值
            //console.log(unlockType);
            $("#"+elem+"Val").val(unlockType).attr("selected",true);

            $("#"+elem+"UnlockLower").val(data.unlock.unlockLower);//满足下限
            $("#"+elem+"UnlockUpper").val(data.unlock.unlockUpper);//满足上限
            $("#"+elem+"LowerLimit").val(data.unlock.lowerLimit);//设置投资下限
            $("#"+elem+"UpperLimit").val(data.unlock.upperLimit);//设置投资上限

            if(unlockType == "none"){
              $("#"+elem+"Box").addClass("hide");
            }
            form.render('select');
          }

          //加载模板处理
          var html = template(elem+'Tpl', data);
          $("#"+elem+"DataList").html(html);

          //主题大奖-解锁条件下拉监听
          self.unLockTermFun("bigPrize");
          //主题小奖-解锁条件下拉监听
          self.unLockTermFun("smallPrize");
          //普通奖品-解锁条件下拉监听
          self.unLockTermFun("generalPrize");
        }

      });
    },
    unLockTermFun:function(elem){//解锁条件下拉监听公用监听方法
      var self = this;
      form.on('select('+elem+'Val)', function(data){
        //console.log(data.othis); //得到美化后的DOM对象
        //console.log("elemV="+data.value); //得到被选中的值
        if(data.value == "none"){
          $("#"+elem+"Box").addClass("hide");
          $("#"+elem+'UnlockLower').val("");//设置投资下限
          $("#"+elem+'UnlockUpper').val("");//设置投资上限
        }else{
          $("#"+elem+"Box").removeClass("hide");
          $("#"+elem+"UnlockLower").val("");//设置投资下限
          $("#"+elem+"UnlockUpper").val("");//设置投资上限
        }
      });
    },
    prizeOptFun:function(){
      var self = this;
      $(document).on("click",".prizeOptBtn",function(){
        var pageTypeVal = $(this).attr("data-type"),
            giftTypeVal = $(this).attr("data-giftType"),
            prizeId = $(this).attr("data-id"),
            giftName = $(this).attr("data-name");
        //console.log(giftName);
        //console.log("pageNid="+pageNid);
        if(pageTypeVal == "delete"){

          top.layer.confirm('是否删除该奖品？', {icon: 3, title:'提示'}, function(){
            common.ajax({
              type: "get",
              url:  self.url.webUrl+"/manageHoliday/manageHolidayGift.html",
              dataType: "JSON",
              data:{
                id: prizeId,
                type: pageTypeVal,
                giftType: giftTypeVal,
                name: giftName,
                nid: self.param.pageNid
              },
              success: function(data) {
                //console.log(data);
                if(data.result){
                  parent.layer.msg('删除成功！', {
                    icon: 1
                  },function(){
                    self.getSettinStatusFun(pageTypeVal);
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
             title: "奖品信息",
             area: ['700px', '500px'],
             fixed: true, //不固定
             maxmin: false,
             content: '/module/functional/jiaRiBaoManage/prize.html?id='+prizeId+'&type='+pageTypeVal+'&giftType='+giftTypeVal+'&nid='+self.param.pageNid,
             end:function(){
               self.getSettinStatusFun(pageTypeVal);
             }
           });
        }

      });
    },
    formSubmitFun:function(){
      var self = this;
      form.on('submit()', function(data){
        form.render(); //更新全部
        //console.log(data.form);
        //console.log(data.field);

        common.ajax({
          type: "get",
          url:  self.url.webUrl + "/manageHoliday/manageAllHolidayGifts.html",
          data: data.field,
          dataType: "JSON",
          success: function(data) {
            if (typeof data == "string") {
              data = JSON.parse(data);
            }
            //console.log(data);
            //加载动画
            var submitLoading = layer.msg('数据提交中', {
              icon: 16,
              time: 0,
              shade: 0.01
            });
            //返回结果处理
            if(data.result){
              layer.close(submitLoading);
              layer.msg("提交成功！",{
                icon:1,
                time: 1000
              },function(){
                parent.layer.close(self.url.frameIndex);
              });
            }else{
              layer.close(submitLoading);
              layer.msg("提交失败",{icon:5,time: 800});
            }
          }
        });
        return false;

      });
    },
    cancleBtnFun:function() {
      var self = this;
      $("#cancleBtn").on("click",function(){
        parent.layer.close(self.url.frameIndex);
      });
    },
  };
  var app = new App();

});
