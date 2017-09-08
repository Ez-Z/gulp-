/**
 * 登录
 *
 */
layui.config({
    base: '/statics/js/common/',
}).use(['jquery', 'form', 'layer', 'common'], function(exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        common = layui.common,
        form = layui.form();

    var App = function(){
      this.url = {
        webUrl: common.urlConfig("webUrl"),//接口路径
      };
      this.init();//页面初始化
      this.refreshcodeFun();//刷新验证码
      this.formVerify();//表单验证
      this.enterSumitFun();//回车提交表单
      this.loginFun();//表单提交
    };
    App.prototype = {
      init:function(){
        var self = this;
      },
      refreshcodeFun:function(){
        $("#refreshcode").on("click", function() {
            var img = $("#vcode");
            var imgUrl = img.attr("src").split("?")[0];
            var imgPath = imgUrl + "?" + Math.random();
            img.attr("src", imgPath);
        });
      },
      formVerify:function(){
        var self = this;
        form.verify({
          username: function(value){
            if(value == ""){
              return '请输入用户名';
            }
          },
          password:function(value){
            if(value == ""){
              return '请输入密码';
            }
          },
          // verify:function(value){
          //   if(value.length < 4){
          //     return '请输入验证码';
          //   }
          // },
        });
      },
      enterSumitFun:function(){
        var self = this;
        $(document).keydown(function(event) {
            if (event.keyCode == 13) {
              console.log("enter");
               $(".login-btn").click()
            }
        });
      },
      loginFun:function(){
        var self = this;
        form.on('submit(loginSubmit)', function(data){
          var field = data.field;
          //console.log(field);
          $.ajax({
              url: self.url.webUrl + '/operator/login.html',
              type: 'GET',
              dataType: 'JSON',
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              data: field,
              success:function(res){
                  console.log(res);
                  if(res.result){
                      let {
                          data
                      } = res;
                      common.setCookie('JSESSIONID',data);
                      layer.msg('登录成功，页面跳转中', {
                        icon: 16,
                        time: 1000,
                        shade: 0.08
                      },function(){
                        location.href = '/home.html';
                      });
                  }else{
                    layer.msg(res.msg, 
                      {
                        icon: 5,
                        time: 1000,
                        shade: 0.08
                      }, function(){
                        $("#username").val("").focus();
                        $("#password").val("");
                      });
                  }
              },
              error: function(res){
                  console.log(res);
              }
          });
          return false;
        });
      },
    };
    var app = new App();
});
