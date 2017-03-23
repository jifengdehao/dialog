;(function ($) {
    var Dialog = function (config) {
        //默认参数
        this.config = {
            //按钮组
            buttons: null,
            //对话框的类型
            type: 'loading', // success waring
            //延迟
            delay: null,
            //延迟关闭的回调
            delayCallback: null,
            //内容
            message: null,
            //对话框的宽度和高度
            width: 'auto',
            //遮罩层透明度
            maskOpacity: null,
            //进场动画
            effect: null,
            //指定遮罩层是否关闭
            maskClose: null
        }
        if (config && $.isPlainObject(config)) {
            $.extend(this.config, config);
        } else {
            this.isConfig = true;
        }

        //创建基本的DOM
        this.body = $('body');
        //创建遮罩层
        this.mask = $('<div class="dialog">');
        //创建弹出框
        this.win = $('<div class="dialog-wrapper">');
        //创建弹出框的头部
        this.winHeader = $('<div class="dialog-header">');
        //创建弹出框的body
        this.winBody = $('<div class="dialog-body">');
        //创建弹出框的footer
        this.winFooter = $('<div class="dialog-footer">');

        this.creat();
    }
    //记录弹窗层级
    Dialog.zIndex = 10000;

    Dialog.prototype = {
        //渲染DOM
        creat: function () {
            var _this = this,
                config = this.config,
                mask = this.mask,
                win = this.win,
                winHeader = this.winHeader,
                winBody = this.winBody,
                winFooter = this.winFooter,
                body = this.body;
            //增加层级
            Dialog.zIndex++;
            this.mask.css('z-index', Dialog.zIndex);
            //如果没有传递参数，就弹出一个等待的加载框
            if (this.isConfig) {
                winBody.html('数据加载中');
                win.append(winHeader);
                win.append(winBody);
                mask.append(win);
                body.append(mask);
            } else {
                winHeader.addClass(config.type);
                win.append(winHeader);
                //如果传递了信息文本
                if (config.message) {
                    winBody.html(config.message);
                    win.append(winBody);
                }
                //按钮组
                if (config.buttons) {
                    this.creatButtons(winFooter, config.buttons);
                    win.append(winFooter);
                }
                //插入到页面
                mask.append(win);
                body.append(mask);
                //信息配置，设置对话框的宽度，高度不用设置
                if (config.width != "auto") {
                    win.width(config.width + 'px');
                }
                //设置对话框遮罩透明度
                if (config.maskOpacity) {
                    mask.css('backgroundColor', 'rgba(0,0,0,' + config.maskOpacity + ')');
                }
                //设置弹出框多久关闭
                if (config.delay && config.delay != 0) {
                    window.setTimeout(function () {
                        _this.close();
                        //执行延迟的回调的函数
                        config.delayCallback && config.delayCallback();
                    }, config.delay);
                }
                //指定遮罩层点击关闭
                if (config.maskClose) {
                    mask.on('click', function () {
                        _this.close();
                    });
                }
                //是否需要进场动画
                if (config.effect) {
                    this.animate();
                }
            }
        },
        //关闭弹出框的函数
        close: function () {
            this.mask.remove();
        },
        animate: function () {
            var _this = this;
            this.win.css('-webkit-transform', 'scale(0,0)');
            window.setTimeout(function () {
                _this.win.css('-webkit-transform', 'scale(1,1)');
            }, 300);
        },
        creatButtons:function(footer,buttons){
            var _this=this;//存储this对象
            $(buttons).each(function(i){
                //获取按钮颜色和文本，回调
                var type=this.type?this.type:"";
                var btntext=this.text?this.text:"按钮"+(++i);
                var callback=this.callback?this.callback:null;
                //console.log(this);
                var button=$("<button class="+type+">"+btntext+"</button>")
                if(callback){
                    button.click(function(e){
                        //阻止事件冒泡
                        e.stopPropagation();
                        var isClose=callback();
                        if(isClose!=false){
                            _this.close();
                        }

                    });
                }else{
                    button.click(function(e){
                        e.stopPropagation();
                        _this.close();
                    });
                }
                footer.append(button);
            });
        }
    }
    /**
     *
     * @param config
     * @return {Dialog}  挂载在$的静态方法上
     */
    $.dialog = function (config) {
        return new Dialog(config);
    }
    window.Dialog = Dialog;
    /**
     * 调用
     * $.dialog({
     *      //参数
     * });
     * var dialog=new Dialog({
     *      // 参数
     * })
     *
     *
     */
})(Zepto);
