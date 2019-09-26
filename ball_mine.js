/**
 * 编辑人：Ball
 * 链接地址：https://github.com/Ball-ll/Ball.js
 * 邮箱：2679385753@qq.com
 * 注：结合浏览各个大牛的一些经典案例 整合并在一起常用的JQ插件 欢迎引用提出更新方案
 * **/
;(function(obj) {
    if (typeof Ball !== 'undefined' && typeof exports === 'object' && define.cmd) {
        Ball.exports = obj;
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return obj;
        });
    } else {
        window.Ball= obj;
    }
}((function($) {
    /**
     * 申明插件头
     * **/
    let Ball = {};
    /**
     * 获取项目的请求访问地址(访问链接头)
     * **/
    Ball.get_pro_path=function(){
        //获取访问链接地址
        let local_href=window.document.location.href;
        //获取主机地址之后的目录
        let path_name=window.document.location.pathname;
        let pos=local_href.indexOf(path_name);
        //获取主机地址
        let localhost_path=local_href.substring(0,pos);
        //获取带"/"的项目名
        let pro_name=path_name.substring(0,path_name.substr(1).indexOf('/')+1);
        let base_path=localhost_path+pro_name+'/';
        return base_path;
    }
    /**
     * 普通ajax请求
     * send_type:定义请求方式POST、GET
     * data:提交参数入api接口无需参数时 可填入null
     * url:url为api请求接口
     * success_func:请求成功后返回出来的success方法
     * **/
    Ball.send_Ajax=function(send_type,datas,url,success_func){
        $.ajax({
            cache: false,//不缓存当前页面
            type:send_type,
            url:url,
            data:datas,
            dataType:'json',
            success:function(result){
                success_func(result);
            },
            error:function(result){
                console.log(result)
            }
        });
    },
        /**
         * 跨域ajax请求（jsonp）
         * send_type:定义请求方式POST、GET
         * data:提交参数入api接口无需参数时 可填入null
         * url:url为api请求接口
         * success_func:请求成功后返回出来的success方法
         * **/
        Ball.send_Ajax_jsonp=function(send_type,datas,url,success_func){
            $.ajax({
                cache: false,//不缓存当前页面
                type:send_type,
                url:url,
                data:datas,
                dataType:"jsonp",//数据格式
                jsonp: "callbackparam",
                jsonpCallback:"success_jsonpCallback",//
                success:function(result){
                    success_func(result);
                },
                error:function(result){
                    console.log(result)
                }
            });
        },
        /**
         * 表单类型提交 根据input所在的父级元素进行dom定义入:div、from等
         * dom:为所有input所在的父级对象
         * send_type:定义请求方式POST、GET
         * url:url为api请求接口
         * success_func:请求成功后返回出来的success方法
         * **/
        Ball.send_Ajax_form=function(dom,send_type,url,success_func){
            let dataJson = "{";
            let dataArr = [];
            dom.find("input").each(function(index, _this) {
                let inputN = $(_this).attr("name");
                if (inputN != "" && inputN != null) {
                    dataArr.push(inputN + ":'" + $(_this).val() + "'");
                    dataJson += ",";
                }
            });
            dataJson = "{" + dataArr.join(",") + "}";
            let dataVal= eval('(' + dataJson + ')');
            $.ajax({
                cache: false,//不缓存当前页面
                type:send_type,//请求方式
                url:url,//请求地址base_path为封装获取项目响应头的路径 url为api请求接口
                data:dataVal,//data{"key":"value"}数据
                dataType:'json',
                success:function(result){
                    success_func(result);
                },
                error:function(result){
                    console.log(result)
                }
            });
        },
        /***
         * form_data表单提交 当需要提交formdata进行文件上传时 可调用
         * form:为所需要提交的from对象 需添加enctype ="multipart/form-data"属性
         * url:请求地址base_path为封装获取项目响应头的路径 url为api请求接口
         * success_func:请求成功后返回出来的success方法
         * */
        Ball.send_Ajax_form_data=function(send_type,from,url,success_func){
            $.ajax({
                cache: false,//不缓存当前页面
                type:send_type,
                url:url,
                data : new FormData(from),
                processData: false,//提交时序列化
                contentType: false,//不做数据处理
                success:function(result){
                    success_func(result);
                },
                error:function(result){
                    console.log(result)
                }
            });
        },
        /**
         * 数字自动转化为大写
         * **/
        Ball.num_to_A_capital=function (num) {
            let strOutput = "";
            let strUnit = '仟佰拾亿仟佰拾万仟佰拾整';
            let intPos = num.indexOf('.');
            if (intPos >= 0)
                num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
            strUnit = strUnit.substr(strUnit.length - num.length);
            for (let i=0; i < num.length; i++)
                strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i,1),1) + strUnit.substr(i,1);
            return strOutput;
        }
    /**
     * 金额自动转化为大写
     * **/
    Ball.num_to_A_capital_yuan=function (num) {
        let strOutput = "";
        let strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
        num += "00";
        let intPos = num.indexOf('.');
        if (intPos >= 0)
            num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
        strUnit = strUnit.substr(strUnit.length - num.length);
        for (let i=0; i < num.length; i++)
            strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i,1),1) + strUnit.substr(i,1);
        return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
    },
        /**
         * 获取带有name=""属性的input中的值并拼接为json对象{name："value"}
         * dom：需要被获取的父级dom对象
         * dataVal：最终拼接的json对象
         * **/
        Ball.get_input_val=function(dom){
            let dataJson = "{";
            let dataArr = [];
            dom.find("input").each(function(index, _this) {
                var inputN = $(_this).attr("name");
                if (inputN != "" && inputN != null) {
                    dataArr.push(inputN + ":'" + $(_this).val() + "'");
                    dataJson += ",";
                }
            });
            dataJson = "{" + dataArr.join(",") + "}";
            let dataVal= eval('(' + dataJson + ')');
            return dataVal;
        },
        /**
         * 获取CheckBox被选中的值
         * dom：需要被获取的父级dom对象
         * sep：根据需求设置字符串之间的分割符
         * colums：最终拼接的字符串
         * **/
        Ball.get_checked_val=function(dom,sep){
            let columns="";
            dom.find("input[type='checkbox']:checked,input[type='radio']:checked").each(function(index, _this) {
                let inputN = $(_this).val();
                inputN+=sep;
                columns+=inputN;
            });
            //移除尾部的分割符号
            columns=columns.substring(0,columns.length-1);
            return columns;
        },
        /**
         * 获取当前系统时间 格式为yyyy-mm-dd hh:mm:ss 2019-09-26 00:00:00
         * function time_esc:为日、月、时、分的格式转义 当小于10时 格式为0加时间
         * **/
        Ball.get_Date_time=function () {
            function time_esc(esc) {
                return esc < 10 ? '0' + esc: esc;
            }
            let myDate = new Date();
            let year=myDate.getFullYear();
            let month=myDate.getMonth()+1;
            let date=myDate.getDate();
            let h=myDate.getHours();
            let m=myDate.getMinutes();
            let s=myDate.getSeconds();
            let now_date_time=year+'-'+time_esc(month)+"-"+time_esc(date)+" "+time_esc(h)+':'+time_esc(m)+":"+time_esc(s);
            return now_date_time;
        },
        /**
         * 获取当前系统时间 格式为yyyy-mm-dd 2019-09-26
         * function time_esc:为日、月的格式转义 当小于10时 格式为0加时间
         * **/
        Ball.get_Date=function () {
            function time_esc(esc) {
                return esc < 10 ? '0' + esc: esc;
            }
            let myDate = new Date();
            let year=myDate.getFullYear();
            let month=myDate.getMonth()+1;
            let date=myDate.getDate();
            let now_date=year+'-'+time_esc(month)+"-"+time_esc(date);
            return now_date;
        };
    return Ball;

}(jQuery))));
