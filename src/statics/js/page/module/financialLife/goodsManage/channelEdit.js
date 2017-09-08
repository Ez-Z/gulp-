layui.config({
    base: '/statics/js/common/' //layui自定义layui组件目录
});
layui.use(['jquery', 'form', 'common', 'artTemplate','ckEditor', 'uploadify'], function() {
    var $ = layui.jquery,
        layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
        layer = layui.layer, //获取当前窗口的layer对象
        form = layui.form(),
        common = layui.common,
        ckEditor = layui.ckEditor,
        webUrl = common.urlConfig('webUrl'),
        fileSever = common.urlConfig('fileSever'),
        imageSeverPath = common.urlConfig('imageSeverPath'),
        uploadify = layui.uploadify,
        artTemplate = layui.artTemplate();
    var pageType = common.getUrlParam('type'), //页面类型
        pageid = common.getUrlParam('id');

    var App = function() {
        this.init(); //页面初始化
        this.listen();
    };

    App.prototype = {
        init: function() {
            let self = this;
            self.loadPage();
            $('#pageType').val(pageType);
            $('#pageid').val(pageid);
        },
        listen: function() {
            let self = this;
            let remarkVal = "";
            $(document).on('click', '.tag', function() {
                var num = $(this).data('num').toString();
                var guarantees = $('#guarantees').val().split(',');
                if ($(this).hasClass('tagSel')) {
                    $(this).removeClass('tagSel');
                    guarantees = guarantees.filter(function(item) {
                        return item != num;
                    });
                } else {
                    $(this).addClass('tagSel');
                    guarantees.push(num);
                }
                guarantees = $.grep(guarantees, function(n) {return $.trim(n).length > 0;})
                var guaranteesStr = guarantees.join(',');
                $('#guarantees').val(guaranteesStr);
            });
            $(document).on('click', '#cancleBtn', function() {
                top.layer.closeAll();
            });
            form.verify({
                channelName: function(value) {
                    if (value.length < 1) {
                        return '标题不能为空';
                    }
                },
                channelIcon: function(value) {
                    if (value.length < 1) {
                        return '请上传icon';
                    }
                },
                guarantees: function(value) {
                    if (value.length < 1) {
                        return '至少选择一个平台保障';
                    }
                },
            });

            function CKupdate() {
                for (var instance in CKEDITOR.instances) CKEDITOR.instances[instance].updateElement();
                remarkVal = $("#remarkEditor").val();
            }

            form.on('submit(channelSubmit)', function(data) {

                CKupdate();
                //更新渲染表单
                data.field.remark = remarkVal;
                if(data.field.remark.length<1){
                    layer.msg("售后说明不能为空", {
                        icon: 5,
                        time: 500
                    });
                    return false;
                }
                self.send(data.field);
                return false;
            });
        },
        loadPage: function() {
            var self = this;
            common.ajax({
                type: "get",
                url: `${webUrl}/channelConfig/channelConfigPage.html`,
                data: {
                    id: pageid,
                    type: pageType
                },
                success: function(data) {
                    console.log(data);
                    if (data.result) {
                        layer.msg('数据加载中', {
                            icon: 16,
                            time: 200,
                            shade: 0.01
                        }, function() {
                            //加载模板处理
                            var html = template('editTpl', data);
                            $("#content").html(html);
                            setTimeout(function() {
                                //加载编辑器
                                ckEditor('remarkEditor');
                                
                                var channelIconData = '';
                                if(data.channelIconList){
                                    channelIconData = data.channelIconList;
                                }                                
                                uploadify('channelIcon', 1, channelIconData);

                                var sellerIconData = '';
                                if(data.sellerIconList){
                                    sellerIconData = data.sellerIconList;
                                }
                                uploadify('sellerIcon', 1, sellerIconData);

                                if(data.channelConfig){
                                    $("#channelScope").val(data.channelConfig.channelScope).attr("selected",true);
                                }

                                form.render();
                            }, 50);
                        });

                    } else {
                        layer.msg("数据加载失败", {
                            icon: 5,
                            time: 500
                        });
                    }
                },
                error: function() {
                    layer.msg("网络请求失败", {
                        icon: 5,
                        time: 500
                    });
                }
            });
        },
        send: function(data) {
            console.log(data);
            common.ajax({
                type: "get",
                url: `${webUrl}/channelConfig/channelConfigOperate.html`,
                data: data,
                success: function(res) {
                    if (res.result) {
                        top.layer.msg("提交成功", {
                            icon: 1,
                            time: 500
                        });
                        common.setItem('flag',true);
                        setTimeout(function() {
                            top.layer.closeAll();
                        }, 500)

                    } else {
                        layer.msg("提交失败", {
                            icon: 5,
                            time: 500
                        });
                    }
                },
                error: function() {
                    layer.msg("网络请求失败", {
                        icon: 5,
                        time: 500
                    });
                }
            });
        }
    }

    var app = new App();
});