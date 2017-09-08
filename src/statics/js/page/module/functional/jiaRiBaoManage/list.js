/**
 * qbm-manage 假日宝活动管理列表页
 * Autor: chenqq
 * Date: 17-06-21
 */
layui.config({
    base: '/statics/js/common/' //layui自定义layui组件目录
});
layui.use(['jquery','common','form','artTemplate','loadList'], function() {
  var $ = layui.jquery,
			layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
			layer = layui.layer, //获取当前窗口的layer对象
      common = layui.common,
			form = layui.form(),
      artTemplate = layui.artTemplate(),
      loadList = layui.loadList;

  var App = function(){
    this.url = {
      webUrl: common.urlConfig("webUrl"),//接口路径
    };
    this.init();//页面初始化
    this.listFun();//列表
    this.activityFun();//活动添加-编辑
    this.prizeSettingFun();//奖项设置
    this.activityStatusSwichFun();//活动状态切换
  };

  App.prototype = {
    init:function(){
      var self = this;
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
        url: '/manageHoliday/getHolidayActivityByMap.html',
        pageSize: self.pageSize,
        currentPage: curPage,
        parame: parame
      },param);
    },
    activityFun:function(){
      var self = this;
      $(document).on("click",".optBtn",function(){
        var operationType = $(this).attr("data-type"),//操作类型
            pageNid = $(this).attr("data-nid"),//活动标识
            activityStatus = $(this).attr("data-activityStatus"),//活动状态
            status = $(this).attr("data-status"),
            contentUrl = "";

        if(operationType == "add"){
          contentUrl = '/module/functional/jiaRiBaoManage/activity.html?type='+operationType;
        }
        if(operationType == "edit"){
          contentUrl =  '/module/functional/jiaRiBaoManage/activity.html?type=' + operationType + '&nid=' + pageNid + "&status=" + status;
        }
        top.layer.open({
           type: 2,
           title: "活动设置",
           area: ['920px', '600px'],
           maxmin: false,
           resize: false,
           content: contentUrl,
           end:function(){
             self.listFun();
           }
         });
      });
    },
    prizeSettingFun:function(){
      var self = this;
      $(document).on("click",".prizeSettingBtn",function(){
        var  activityStatus = $(this).attr("data-status"),//活动状态
             pageNid = $(this).attr("data-nid");//活动标识
        console.log("activityStatus="+activityStatus);
        top.layer.open({
           type: 2,
           title: "奖项设置",
           area: ['920px', '600px'],
           fixed: true, //不固定
           maxmin: false,
           content: '/module/functional/jiaRiBaoManage/prizeSetting.html?nid='+pageNid+'&status='+activityStatus,
           end:function(){
             //重新加载列表
             self.listFun();
           }
         });
      });
    },
    activityStatusSwichFun:function(){
      var self = this;
      form.on('switch()', function(data){
         console.log(data.elem.checked); //开关是否开启，true或者false
         var nid = data.value;
         console.log(nid);
         common.ajax({
           type: "get",
           url:  self.url.webUrl+"/manageHoliday/updateConfigStatus.html",
           dataType: "JSON",
           data:{
             nid: nid
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
