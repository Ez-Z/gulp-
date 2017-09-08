/**
 * qbm-manage 假日宝活动管理列表页
 * Autor: chenqq
 * Date: 17-06-21
 */
layui.config({
   base: '/statics/js/common/' //layui自定义layui组件目录
});
layui.use(['form','layer','common','ckEditor','WdatePicker'], function() {
  var layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
			layer = layui.layer,
			form = layui.form(),
      common = layui.common,
      ckEditor = layui.ckEditor,
      WdatePicker = layui.WdatePicker;

  var App = function(){
    this.url = {
      webUrl: common.urlConfig('webUrl'),//接口路径
      fileSever: common.urlConfig('fileSever'),//图片上传接口
      imageSeverPath: common.urlConfig('imageSeverPath'),//图片服务器路径
      frameIndex: parent.layer.getFrameIndex(window.name),//获取iframeId
    };

    this.param = {
      pageType: common.getUrlParam('type'),//页面类型
      pageStatus: common.getUrlParam('status'),//活动状态
      pageNid: common.getUrlParam('nid'),//获取活动nid
    };

    this.init();//页面初始化
    this.delPicFun();//删除图片
    this.formVerifyFun();//表单验证
    this.formSubmitFun();//表单提交
    this.cancleBtnFun();//关闭弹窗
  };
  App.prototype = {
    init:function(){
      var self = this;
      console.log("操作类型："+self.param.pageType);
      console.log("活动状态："+self.param.pageStatus);
      console.log("活动标识Nid："+self.param.pageNid);
      $("#pageType").val(self.param.pageType);
      $("#pageNid").val(self.param.pageNid);

      //信息编辑数据处理
      if(self.param.pageType == "edit"){
        console.log("这是编辑页面");
        $("#pageStatus").val(self.param.pageStatus);
        $("#activityRlueEditor").val("");
        self.loadDataFun();
      }

      //初始化编辑器
      if(self.param.pageType == "add"){
        ckEditor('activityRlueEditor');
      }
      //监听活动玩法  、、转盘--礼盒
      form.on('select(activityStyle)', function(data){
        console.log(data.value); //得到被选中的值
        if(data.value == 'lihe'){
          $('.hide-input').hide();
        }else{
            $('.hide-input').show();
        }

      });
      // var layerEdit = layedit.build('activityRlueEditor', {
      //   tool: ['left', 'center', 'right'],
      //   height: 160
      // });

      //图片上传插件配置
      //预告banner
      self.makeUploadFun("heraldBanner");
      //预告主题banner
      self.makeUploadFun("heraldTitleBanner");
      //预告主题banner
      self.makeUploadFun("titleIntroduceBanner");
      //发现banner
      self.makeUploadFun("displayBanner");
      //转盘入口
      self.makeUploadFun("lotteryBackground");
      //转盘背景
      self.makeUploadFun("turntableBackground");
      //预告玩法图片
      self.makeUploadFun("bottomImage");
      //分享小图标
      self.makeUploadFun("shareIco");

      //日期插件
      //活动预告时间
      WdatePicker('trailerStartTime',{maxDate:'#F{$dp.$D(\'trailerEndTime\')||\'2020-01-01\'}',dateFmt:'yyyy-MM-dd HH:mm:ss'});
      WdatePicker('trailerEndTime',{minDate:'#F{$dp.$D(\'trailerStartTime\')||\'2020-01-01\'}',dateFmt:'yyyy-MM-dd HH:mm:ss'});

      //活动时间
      WdatePicker('timeStart',{maxDate:'#F{$dp.$D(\'timeEnd\')||\'2020-01-01\'}',dateFmt:'yyyy-MM-dd HH:mm:ss'});
      WdatePicker('timeEnd',{minDate:'#F{$dp.$D(\'timeStart\')||\'2020-01-01\'}',dateFmt:'yyyy-MM-dd HH:mm:ss'});


    },
    loadDataFun:function(){//读取页面数据
      var self = this;
      var imgPath = self.url.imageSeverPath;

      common.ajax({
        type: "post",
        url:  self.url.webUrl+"/manageHoliday/getAllHolidayActivityInfo.html",
        data: {nid: self.param.pageNid},
        dataType: "JSON",
        success: function(data) {
          if (typeof data == "string") {
            data = JSON.parse(data);
          }
          console.log(data);
          var editPageIndex = layer.msg('数据读取中', {
            icon: 6,
            time: 500,
            shade: 0.01
          },function(){
            if(data.result){
              console.log('test');

              if(data.activity.lotteryType == 'zhuanpan'){
                $('.zhuanpan').attr('selected',true)
                $('.hide-input').show();
              }else if (data.activity.lotteryType == 'lihe') {
                $('.lihe').attr('selected',true);
                $('.hide-input').hide();
              }
             form.render('select', 'activityStyle');

              $("#activityType").val(data.config.activityType);//活动类型
              $("#activityName").val(data.activity.activityName);//活动主题
              $("#trailerStartTime").val(data.activity.trailerStartTime);//活动预告-开始时间
              $("#trailerEndTime").val(data.activity.trailerEndTime);//活动主题-结束时间
              $("#timeStart").val(data.config.timeStart);//活动范围-开始时间
              $("#timeEnd").val(data.config.timeEnd);//活动范围-结束时间

              //首页预告banner
              $("#heraldBannerVal").val(data.activity.heraldBanner);
              $("#heraldBannerImg").attr("src",imgPath + data.activity.heraldBanner);
              $("#heraldBannerPrivew").removeClass("hide");

              //预告主题banner
              $("#heraldTitleBannerVal").val(data.activity.heraldTitleBanner);
              $("#heraldTitleBannerImg").attr("src",imgPath+data.activity.heraldTitleBanner);
              $("#heraldTitleBannerPrivew").removeClass("hide");

              //进行中banner
              $("#titleIntroduceBannerVal").val(data.activity.titleIntroduceBanner);
              $("#titleIntroduceBannerImg").attr("src",imgPath+data.activity.titleIntroduceBanner);
              $("#titleIntroduceBannerPrivew").removeClass("hide");
              console.log('--------------------------------------------');
              console.log(data)
              //发现banner
              $("#displayBannerUploaderVal").val(data.activity.displayBannerUploader);
              $("#displayBannerImg").attr("src",imgPath+data.activity.displayBanner);
              $("#displayBannerPrivew").removeClass("hide");
              console.log('--------------------------------------------');



              $("#activityRlueEditor").val(data.activity.activityRlue);//活动规则
              console.log(data.activity.activityRlue);
              ckEditor('activityRlueEditor');
              //CKEDITOR.instances.content.setData(data.activity.activityRlue);
              //ckEditor('goodsDetail').setData("test");

              //$(window.frames["LAY_layedit_1"].document).find('body').html(data.activity.activityRlue);// 动态插入
              $("#backgroundColor").val(data.color.backgroundColor);//页面背景
              $("#titleTextColor").val(data.color.titleTextColor);//标题文案
              $("#titleBackgroundColor").val(data.color.titleBackgroundColor);//标题底色
              $("#button1BackgroundColor").val(data.color.button1BackgroundColor);//按键1底色
              $("#button2BackgroundColor").val(data.color.button2BackgroundColor);//按键2底色

              //右侧分享图标
              $("#lotteryBackgroundVal").val(data.color.lotteryBackground);
              $("#lotteryBackgroundImg").attr("src",imgPath+data.color.lotteryBackground);
              $("#lotteryBackgroundPrivew").removeClass("hide");

              //转盘背景
              $("#turntableBackgroundVal").val(data.color.turntableBackground);
              $("#turntableBackgroundImg").attr("src",imgPath+data.color.turntableBackground);
              $("#turntableBackgroundPrivew").removeClass("hide");

              //预购玩法图片
              $("#palyerNoticeImageVal").val(data.color.palyerNoticeImage);
              $("#palyerNoticeImage").attr("src",imgPath+data.color.palyerNoticeImage);
              $("#palyerNoticeImagePrivew").removeClass("hide");

              $("#shareTitle").val(data.activity.shareTitle);//分享标题
              $("#shareContent").val(data.activity.shareContent);//分享摘要

              //分享渠道处理
              var wechatVal = data.shareModel.wechat,//微信
                  timelineVal = data.shareModel.timeline,//朋友圈
                  qqVal = data.shareModel.qQ,//QQ
                  qZoneVal = data.shareModel.qZone,//QQ空间
                  sMSVal = data.shareModel.sMS,//短信
                  weiboVal= data.shareModel.weibo;//新浪微博

              console.log(wechatVal,timelineVal,qqVal,qZoneVal,sMSVal,weiboVal);

              if(wechatVal == 1){
                $("#Wechat").attr("checked", true);
              }
              if(timelineVal == 1){
                $("#Timeline").attr("checked", true);
              }
              if(qqVal == 1){
                $("#QQ").attr("checked", true);
              }
              if(qZoneVal == 1){
                $("#QZone").attr("checked", true);
              }
              if(sMSVal == 1){
                $("#SMS").attr("checked", true);
              }
              if(weiboVal == 1){
                $("#Weibo").attr("checked", true);
              }
              form.render('checkbox'); //刷新select选择框渲染

              //分享小图标
              $("#shareIcoVal").val(data.activity.shareIco);
              $("#shareIcoImg").attr("src",imgPath+data.activity.shareIco);
              $("#shareIcoPrivew").removeClass("hide");

              $("#remark").val(data.activity.remark);//备注

              layer.close(editPageIndex);

            }else{
              layer.msg("数据读取失败",{icon:5,time: 500});
            }
          });

        }
      });
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
          'formData': {'timestamp' :  Date.parse(new Date()),'folder': '\\manage\\activity\\images',	'hideName' :'true'},
          'fileTypeDesc':'支持的格式：',//  可选择文件类型说明
          'fileTypeExts':'*.jpg;*.jpge;*.gif;*.png',  //允许上传文件的类型
          'fileSizeLimit': 10 * 1024 * 1024,  //文件上传的最大大小
          //返回一个错误，选择文件的时候触发
          'onSelectError':function(file, errorCode, errorMsg){
              switch(errorCode) {
                  case -100:
                      top.layer.alert("上传的文件数量已经超出系统限制的");
                      break;
                  case -110:
                      top.layer.alert("文件 ["+file.name+"] 大小超出系统限制的");
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
    delPicFun:function(){
      $(document).on("click",".closeBtn",function(){
        var $this = $(this);
        $this.siblings("input").val("");
        $this.parent(".picPrivew").addClass("hide");
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
    formVerifyFun:function(){
      var self = this;
      form.verify({
        title:function(value){
          var newVal = $.trim(value);
          if( newVal.length  == 0){
            return '请添加活动主题';
          }
          if( newVal.length  > 20){
            return '活动主题限制20字内';
          }
        },
        // heraldBanner: function(value){
        //   if(value == ""){
        //     return '请上传假日宝首页预告banner图片';
        //   }
        // },
        // heraldTitleBanner: function(value){
        //   if(value == ""){
        //     return '请上传预告页面-预告主题banner图片';
        //   }
        // },
        // titleIntroduceBanner: function(value){
        //   if(value == ""){
        //     return '请上传进行中-假日宝主题介绍banner图片';
        //   }
        // },
        // displayBanner: function(value){
        //   if(value == ""){
        //     return '请上传发现-发现banner图片';
        //   }
        // },
        // lotteryBackground: function(value){
        //   if(value == ""){
        //     return '请上传转盘入口按钮图片';
        //   }
        // },
        // turntableBackground: function(value){
        //   if(value == ""){
        //     return '请上传转盘图片';
        //   }
        // },
        // bottomImage: function(value){
        //   if(value == ""){
        //     return '请上传抢购时间栏底部配色图片';
        //   }
        // },
        shareIco: function(value){
          if(value == ""){
            return '请上传分享小图标';
          }
        },
        activityRlue:function(value){
          return layedit.sync(self.layerEdit);
        },
        // backgroundColor:[
        //   /^#[0-9a-fA-F]{3,6}$/,'请输入正确的页面背景颜色值'
        // ]
      });
    },
    formSubmitFun:function(){

      var self = this;
      var activityRlueVal="";

      function CKupdate() {
        for (var instance in CKEDITOR.instances) CKEDITOR.instances[instance].updateElement();
        activityRlueVal = $("#activityRlueEditor").val();
      }

      form.on('submit(activitySubmit)', function(data){
        $("#submitBtn").attr("disabled",true);
        CKupdate();
        //更新渲染表单
        data.field.activityRlue = activityRlueVal;
        form.render(); //更新全部
        console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        common.ajax({
          type: "POST",
          url:  self.url.webUrl+"/manageHoliday/manageHolidayActivity.html",
          data: data.field,
          dataType: "JSON",
          traditional:true,
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
