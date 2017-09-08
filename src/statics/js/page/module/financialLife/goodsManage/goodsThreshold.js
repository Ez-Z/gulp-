/**
 *  商品门槛设置
 */
layui.config({
   base: '/statics/js/common/' //layui自定义layui组件目录
});
layui.use(['jquery','form','common','artTemplate'], function() {
  var $ = layui.jquery,
			layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
			layer = layui.layer, //获取当前窗口的layer对象
			form = layui.form(),
      common = layui.common,
      artTemplate = layui.artTemplate();

  var App = function(){
      this.url = {
        webUrl: common.urlConfig("webUrl"),//接口路径
        frameIndex: parent.layer.getFrameIndex(window.name),//获取iframeId
      };

      this.param = {
        pageType: common.getUrlParam("pageType"),//商品门槛页面类型
        pageId: common.getUrlParam("pageId"),//商品门槛ID
        goodsId: common.getUrlParam("goodsId"),//商品ID
        profitRateVal: common.getUrlParam("profitRateVal"),//商品收益率
        goodsWorthVal: common.getUrlParam("goodsWorth"),//商品售价
      };

      this.init();//页面初始化
      this.loadDataFun();//页面数据读取
      this.calculationFormFun();//表单计算
      this.submitFun();//表单提交
      this.cancleLayerFun();//关闭弹出窗口
    };
    App.prototype = {
      init:function(){
        var self = this;
        $("#pageType").val(self.param.pageType);
        console.log("pageType="+self.param.pageType);
        console.log("goodsWorth="+self.param.goodsWorthVal);

        //ID处理
        if(self.param.pageId != 'undefined' && self.param.pageId !=''){
          $("#pageId").val(self.param.pageId);
        }
        //商品ID
        $("#goodsIdVal").val(self.param.goodsId);
        //商品收益率
        $("#goodsProfitRate").val(self.param.profitRateVal);

      },

      loadDataFun:function(){
        var self = this;
        //截取并保留两位小数
        function toDecimal(x) { 
          var r = parseFloat(x); 
          if (isNaN(r)) { 
            return; 
          } 
          r = Math.floor(x * 100) / 100;
          return r; 
        } 
        common.ajax({
          type: "get",
          url:  self.url.webUrl+"/goodsThreshold/goodsThresholdPage.html",
          dataType: "JSON",
          data:{
            id: self.param.pageId,
            type: self.param.pageType
          },
          success: function(data) {
            console.log(data);
            if(data.result){
              layer.msg('数据加载中', {
                icon: 16,
                time: 500,
                shade: 0.01
              },function(){
                //渲染页面数据
                var html = template("pageTpl", data);
                $('#pageData').html(html);
                if(data.goodsThreshold){
                  //计算建议投资本金  投资本金 = 商品售价  / （商品收益率 * 投资期限/12）
                  var tenderLimitVal = data.goodsThreshold.tenderLimit;//投资期限
                  var suggestTenderAccountVal = toDecimal(self.param.goodsWorthVal /(self.param.profitRateVal / 100 * tenderLimitVal /12));
                  $("#suggestTenderAccount").text(suggestTenderAccountVal);
                }
                form.render();
              });
            }else{
              layer.msg("数据加载失败",{icon:5,time: 500});
            }
          }
        });
      },
      calculationFormFun:function(){
        var self = this;

        //截取并保留两位小数
        function toDecimal(x) { 
          var r = parseFloat(x); 
          if (isNaN(r)) { 
            return; 
          } 
          r = Math.floor(x * 100) / 100;
          return r; 
        } 

        //减法
        function Subtr(arg1,arg2) {
          var r1,r2,m,n;
          try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
          try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
          m=Math.pow(10,Math.max(r1,r2));
          n=(r1>=r2)?r1:r2;
          return ((arg1*m-arg2*m)/m).toFixed(n);
        }

        var timer = null;
        //投资本金 = 商品售价  / （商品收益率 * 投资期限/12）
        $(document).on("keyup","#tenderLimit",function(){
          var tenderLimitVal = Number($(this).val()),//投资期限
              moneyProfitRateVal = $("#moneyProfitRate").val(),//现金收益率
              tenderAccountVal = "";//投资本金

          //投资本金计算
          if(tenderLimitVal !=""){
            tenderAccountVal = toDecimal(self.param.goodsWorthVal /(self.param.profitRateVal / 100 * tenderLimitVal /12));
          }
          $("#tenderAccount").val(tenderAccountVal);
          $("#suggestTenderAccount").text(tenderAccountVal);

          //现金收益
          moneyProfitReadVal(tenderAccountVal,moneyProfitRateVal,tenderLimitVal);

        });

        //现金收益率 = 项目基础年化 - 商品收益率
        $(document).on("keyup","#baseApr",function(){
          var baseAprVal = Number($(this).val()),//基础年化
              profitRateVal = Number(self.param.profitRateVal),//商品收益率
              tenderLimitVal = $("#tenderLimit").val(),//投资期限
              moneyProfitRateVal = "",//现金收益率
              tenderAccountVal = $("#tenderAccount").val();//投资本金

          clearInterval(timer);
          timer = setTimeout(function() {
            console.log("baseAprVal="+baseAprVal);
            console.log("profitRateVal="+profitRateVal);
            if(baseAprVal != 0){
              if(baseAprVal < profitRateVal){
                layer.msg("项目基础年化必须大于商品收益率");
              }else{
                moneyProfitRateVal = toDecimal(baseAprVal - profitRateVal);
                $("#moneyProfitRate").val(moneyProfitRateVal);
                $("#moneyProfit").val(moneyProfitRateVal);
              }
            }else{
              $("#moneyProfitRate").val("");
              $("#moneyProfit").val("");
            }
            timer = null;
            //现金收益
            moneyProfitReadVal(tenderAccountVal,moneyProfitRateVal,tenderLimitVal);
          }, 500);
        });

        //投资本金修改
        $(document).on("keyup","#tenderAccount",function(){
          var tenderAccountVal = Number($(this).val()),
              moneyProfitRateVal = Number($("#moneyProfitRate").val()),
              tenderLimitVal = Number($("#tenderLimit").val());//投资期限
          
          //现金收益
          moneyProfitReadVal(tenderAccountVal,moneyProfitRateVal,tenderLimitVal);
        });

        //现金收益计算 现金收益 = 投资本金 * 现金收益率 * 投资期限/12
        function moneyProfitReadVal(p1,p2,p3){
          var moneyProfitReadVal = "";
          if(p1 !="" && p2 !="" && p3 !=""){
            moneyProfitReadVal =  toDecimal(p1 * p2 / 100 * p3 /12);
          }
          $("#moneyProfitRead").val(moneyProfitReadVal);
          $("#moneyProfit").val(moneyProfitReadVal);
        }

      },
      submitFun:function(){
        var self = this;

        form.on('submit(submit)', function(data){
          $("#submitBtn").attr("disabled",true);
          form.render();
          console.log(data.field);
          common.ajax({
            type: "get",
            url:  self.url.webUrl+"/goodsThreshold/goodsThresholdOperate.html",
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
                layer.msg(data.msg,{
                  icon:1,
                  time: 1000
                },function(){
                  parent.layer.close(self.url.frameIndex);
                });
              }else{
                layer.close(submitLoading);
                layer.msg(data.msg,{
                  icon:5,time: 800
                },function(){
                  $("#submitBtn").attr("disabled",false);
                });
              }
            }
          });
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
