/**
 * qbm-manage 奖品设置
 * Autor: chenqq
 * Date: 17-06-21
 */
layui.config({
    base: '/statics/js/common/' //layui自定义layui组件目录
});
layui.use(['jquery','form','layer','common','WdatePicker'], function() {
  var layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
			layer = layui.layer,
      layedit = layui.layedit,
			form = layui.form(),
      common = layui.common,
      WdatePicker = layui.WdatePicker;

  var App = function(){
    this.url = {
      webUrl: common.urlConfig('webUrl'),//接口路径
      fileSever: common.urlConfig('fileSever'),//图片上传接口
      imageSeverPath: common.urlConfig('imageSeverPath'),//图片服务器路径
      frameIndex: parent.layer.getFrameIndex(window.name),//获取iframeId
    };

    this.param = {
      pageType: common.getUrlParam('type'),//操作类型
      giftType: common.getUrlParam('giftType'),//活动状态
      activityStatus: common.getUrlParam('status'),//活动状态
      pageNid: common.getUrlParam('nid'),//获取活动nid
      prizeId: common.getUrlParam('id'),//奖品id
    };

    this.init();//页面初始化
    this.loadDataFun();//获取页面数据
    this.delPicFun();//删除图片
    this.formVerifyFun();//表单验证
    this.formSubmitFun();//表单提交
    this.cancleBtnFun();//关闭弹窗
  };
  App.prototype = {
    init:function(){
      var self = this;

      console.log("pageNid="+self.param.pageNid);
      console.log("pageType="+self.param.pageType);
      console.log("giftType="+self.param.giftType);
      console.log("prizeId="+self.param.prizeId);
      $("#pageType").val(self.param.pageType);
      $("#giftType").val(self.param.giftType);
      $("#pageNid").val(self.param.pageNid);

      // if(self.param.giftType == "0"){
      //   console.log("这是普通页面");
      //   $("#prizeIssued").addClass("hide");
      //   $("#addOddsBox").addClass("hide");
      //   $("#upperOddsBox").addClass("hide");
      // }

      //日期控件
      //展示时间
      WdatePicker('startTime1',{maxDate:'#F{$dp.$D(\'endTime1\')||\'2020-01-01\'}',dateFmt:'yyyy-MM-dd HH:mm:ss'});
      WdatePicker('endTime1',{minDate:'#F{$dp.$D(\'startTime1\')||\'2020-01-01\'}',dateFmt:'yyyy-MM-dd HH:mm:ss'});

      //生效时间
      WdatePicker('startTime',{maxDate:'#F{$dp.$D(\'endTime\')||\'2020-01-01\'}',dateFmt:'HH:mm:ss'});
      WdatePicker('endTime',{minDate:'#F{$dp.$D(\'startTime\')||\'2020-01-01\'}',dateFmt:'HH:mm:ss'});


      //预告页面主题大奖图片
      self.makeUploadFun("heraldImage");
      //活动进行中主题大奖图片
      self.makeUploadFun("giftImage");
      //转盘展示图片
      self.makeUploadFun("showImage");

    },
    loadDataFun:function(){
      var self = this;
      var imageSeverPath = self.url.imageSeverPath;
      if(self.param.pageType == "edit"){
        console.log("这是编辑页面");
        $("#pageId").val(self.param.prizeId);
        common.ajax({
          type: "get",
          url:  self.url.webUrl+"/manageHoliday/getDetailHolidayGiftInfo.html",
          dataType: "JSON",
          data:{
            giftId: self.param.prizeId
          },
          success: function(data) {
            console.log(data);
            var editPageIndex = layer.msg('数据读取中', {
              icon: 16,
              time: 1000,
              shade: 0.01
            },function(){
              if(data.result){

                $("#name").val(data.giftInfo.name);//奖品名称
                $("#level").val(data.giftInfo.level);//活动预告-开始时间
                $("#total").val(data.giftInfo.total);//奖品个数

                //奖品类型下拉框
                var rewardTypeVal = data.giftInfo.rewardType;
                $("#rewardType").val(rewardTypeVal).attr("selected",true);
                form.render('select');

                //红包金额
                var amountVal = data.giftInfo.amount;
                if(amountVal){
                  $("#amount").val(amountVal);
                  $("#amountItem").removeClass("hide");
                  $("#amount").attr("lay-verify","required");
                }else{
                  $("#amountItem").addClass("hide");
                  $("#amount").attr("lay-verify","");
                }

                //预告页面主题大奖图
                $("#heraldImageVal").val(data.giftInfo.heraldImage);
                $("#heraldImageImg").attr("src",imageSeverPath+data.giftInfo.heraldImage);
                $("#heraldImagePrivew").removeClass("hide");

                //活动进行中主题大奖图
                $("#giftImageVal").val(data.giftInfo.giftImage);
                $("#giftImageImg").attr("src",imageSeverPath+data.giftInfo.giftImage);
                $("#giftImagePrivew").removeClass("hide");

                //转盘展示图
                $("#showImageVal").val(data.giftInfo.showImage);
                $("#showImageImg").attr("src",imageSeverPath+data.giftInfo.showImage);
                $("#showImagePrivew").removeClass("hide");

                $("#winningOdds").val(data.giftInfo.winningOdds);//中奖概率
                $("#startTime1").val(data.giftInfo.showStartTime);//展示时间-开始时间
                $("#endTime1").val(data.giftInfo.showEndTime);//展示时间-结束时间
                //奖品发放
                $("#timeInterval").val(data.giftInfo.timeInterval);//分钟
                $("#intervalGiftNum").val(data.giftInfo.intervalGiftNum);//份该奖品

                $("#startTime").val(data.giftInfo.validStartTime);//生效时间-开始时间
                $("#endTime").val(data.giftInfo.validEndTime);//生效时间-结束时间
                $("#addOdds").val(data.giftInfo.addOdds);//增加概率
                $("#upperOdds").val(data.giftInfo.upperOdds);//概率最高值
                $("#remark").val(data.giftInfo.remark);//奖品介绍

                //抽奖门槛
                $("#initialNumber").val(data.giftInfo.initialNumber);//奖品介绍
                $("#mustWin").val(data.giftInfo.mustWin);//奖品介绍
                $("#mostWin").val(data.giftInfo.mostWin);//奖品介绍

                layer.close(editPageIndex);

              }else{
                layer.msg("数据读取失败",{icon:5,time: 500});
              }
            });
          }
        });

      }

    },
    makeUploadFun:function(ele){
      var self = this;
      $("#"+ele+"Uploader").uploadify({
          'buttonText':'',  //按钮上的文字
          'buttonClass':'uploadBtnStyle',
          'swf'       : "/statics/plugins/uploadify/uploadify.swf",//flash
          'uploader'  : self.url.fileSever,  //文件上传服务器
          'width'     :'112',  //按钮宽度
          'height'    :'38',  //按钮高度
          'multi'     : false,
          'formData': {'timestamp' :  Date.parse(new Date()),'folder'         : '\\manage\\activity\\images',	'hideName' :'true'},
          'fileTypeDesc':'支持的格式：',//  可选择文件类型说明
          'fileTypeExts':'*.jpg;*.jpge;*.gif;*.png',  //允许上传文件的类型
          'fileSizeLimit': 10 * 1024 * 1024,  //文件上传的最大大小
          //返回一个错误，选择文件的时候触发
          'onSelectError':function(file, errorCode, errorMsg){
              switch(errorCode) {
                  case -100:
                      top.layer.alert("上传的文件数量已经超出系统限制");
                      break;
                  case -110:
                      top.layer.alert("文件 ["+file.name+"] 大小超出系统限制大小！");
                      break;
                  case -120:
                      top.layer.alert("文件 ["+file.name+"] 大小异常！");
                      break;
                  case -130:
                      top.layer.alert("文件 ["+file.name+"] 类型不正确！");
                      break;
              }
          },
          'onFallback':function(){//检测是否安装flash插件
              top.layer.alert("您未安装FLASH控件，无法上传图片！请安装FLASH控件后再试。");
          },
          'onUploadSuccess':function(file, data, response){
              console.log("file="+file);
              console.log("data="+data);
              console.log("response="+response);
              console.log(ele);

              var imgPath = self.url.imageSeverPath+data;
              $("#"+ele+"Privew").removeClass("hide");//显示图片预览框
              $("#"+ele+"Img").attr('src',imgPath);//回显图片
              $("#"+ele+"Val").val(data);//添加图片路径到表单

              self.imgWidthFun(imgPath);//图片大小处理
          }
      });
    },
    imgWidthFun:function(imgUrl){//图片大小处理
      var self = this;
      var img_url = imgUrl;
      // 创建对象
      var img = new Image();
      // 改变图片的src
      img.src = img_url;
      img.onload = function(){
          var imgWidth = img.width;
          $("#picPrivew").css("width",imgWidth);
      };
    },
    delPicFun:function(){
      var self = this;
      $(document).on("click",".closeBtn",function(){
        var $this = $(this);
        $this.siblings("input").val("");
        //$this.siblings("img").attr("src","");
        $this.parent(".picPrivew").addClass("hide");
      });
    },
    formVerifyFun:function(){
      var self = this;
      form.verify({
       //  heraldImage: function(value){
       //    if(value == ""){
       //      return '请上传预告页面主题大奖图片';
       //    }
       //  },
       //  giftImage: function(value){
       //    if(value == ""){
       //      return '请上传活动进行中主题大奖图片';
       //    }
       //  },
        showImage: function(value){
          if(value == ""){
            return '请上传转盘展示图';
          }
        },

      });
    },
    formSubmitFun:function(){
      var self = this;

      //奖品类型监听
      form.on('select(rewardType)', function(data){
        console.log("rewardType="+data.value); //得到被选中的值

        if(data.value == "2"){//红包
          $("#amountItem").removeClass("hide");
          $("#amount").attr("lay-verify","required");
        }else{
          $("#amountItem").addClass("hide");
          $("#amount").attr("lay-verify","");
        }
        form.render('select');
      });
      //表单提交
      form.on('submit()', function(data){
        $("#submitBtn").attr("disabled",true);
        form.render(); //更新全部
        console.log(data.field);
        common.ajax({
          type: "get",
          url:  self.url.webUrl+"/manageHoliday/manageHolidayGift.html",
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
              layer.msg("提交成功！",{
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
        return false;

      });
    },
    cancleBtnFun:function(){
      var self = this;
      $("#cancleBtn").on("click",function(){
        parent.layer.close(self.url.frameIndex);
      });
    },
  };
  var app = new App();

});
