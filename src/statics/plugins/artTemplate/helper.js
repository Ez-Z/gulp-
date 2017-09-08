  //时间格式化
  template.defaults.imports.dateFormatFun = function(time,style) {
    function formatDate(now) {
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var hour = now.getHours();
      var minute = now.getMinutes();
      var second = now.getSeconds();
      if (month < 10) {
        month = '0' + month;
      }
      if (date < 10) {
        date = '0' + date;
      }
      if (hour < 10) {
        hour = '0' + hour;
      }
      if (second < 10) {
        second = '0' + second;
      }
      if (minute < 10) {
        minute = '0' + minute;
      }
      if (style == 1) { //格式:2014-08-15 00:00:00
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
      } else if (style == 2) { //格式:2014-08-15 00:00
        return year + "-" + month + "-" + date + " " + hour + ":" + minute;
      } else if (style == 3) { //格式:2014/08/15
        return year + "/" + month + "/" + date;
      } else if (style == 4) { //格式:2014-08-15
        return year + "-" + month + "-" + date;
      } else if (style == 5) { //格式:2014-08-15
        return year + "/" + month + "/" + date + " " + hour + ":" + minute + ":" + second;
      }
    }
    if (time == null || time == '') {
      return '';
    }
    var d = new Date(parseInt(time) * 1000);
    return formatDate(d);
  };
  //E-时间格式化


  //假日宝活动管理列表-状态显示
  template.defaults.imports.jiaRiBaoStatusFun = function(value) {
    if(value ==  0){
      return "";
    }else if(value ==  1){
      return "checked";
    }
  };

  //假日宝活动管理列表-活动状态显示
  template.defaults.imports.jiaRiBaoActivityStatusFun = function(value) {
    if(value ==  0){
      return "进行中";
    }else if(value ==  1){
      return "未开始";
    }else if(value ==  2){
      return "已结束";
    }
  };

  //0元购订单管理-订单状态
  template.defaults.imports.orderStatusFun = function(value) {
    if(value ==  1){
      return "待发货";
    }else if(value ==  2){
      return "待收货";
    }else if(value ==  3){
      return "已完成";
    }
  };

  //未上架商品-状态
  template.defaults.imports.unSoldListStatusFun = function(value) {
    if(value ==  0){
      return "";
    }else if(value ==  1){
      return "售完下架";
    }else if(value ==  2){
      return "人工下架";
    }else if(value ==  3){
      return "从未上架";
    }
  };

  //未上架商品-状态
  template.defaults.imports.onSoldListStatusFun = function(value) {
    if(value ==  1){
      return '<span class="onSale">在售</span>';
    }else if(value ==  2){
      return '<span class="sellOut">售罄</span>';
    }
  };
