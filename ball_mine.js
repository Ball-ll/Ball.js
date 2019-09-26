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
    //申明插件头
    var Ball = {};
       /**
        * 获取项目的请求访问地址
        * **/
       Ball.get_pro_path=function(){
           var curWwwPath=window.document.location.href;
           //获取主机地址之后的目录如：
           var pathName=window.document.location.pathname;
           var pos=curWwwPath.indexOf(pathName);
           //获取主机地址
           var localhostPaht=curWwwPath.substring(0,pos);
           //获取带"/"的项目名
           var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
           var base_path=localhostPaht+projectName+'/';
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
           var dataJson = "{";
           var dataArr = [];
           dom.find("input").each(function(index, _this) {
               var inputN = $(_this).attr("name");
               if (inputN != "" && inputN != null) {
                   dataArr.push(inputN + ":'" + $(_this).val() + "'");
                   dataJson += ",";
               }
           });
           dataJson = "{" + dataArr.join(",") + "}";
           dataVal= eval('(' + dataJson + ')');
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
          var strOutput = "";
          var strUnit = '仟佰拾亿仟佰拾万仟佰拾整';
          var intPos = num.indexOf('.');
          if (intPos >= 0)
              num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
          strUnit = strUnit.substr(strUnit.length - num.length);
          for (var i=0; i < num.length; i++)
              strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i,1),1) + strUnit.substr(i,1);
              return strOutput;
      }
    /**
     * 金额自动转化为大写
     * **/
     Ball.num_to_A_capital_yuan=function (num) {
        var strOutput = "";
         var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
        num += "00";
        var intPos = num.indexOf('.');
        if (intPos >= 0)
            num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
        strUnit = strUnit.substr(strUnit.length - num.length);
        for (var i=0; i < num.length; i++)
            strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i,1),1) + strUnit.substr(i,1);
        return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
    },
     /**
      * 获取带有name=""属性的input中的值并拼接为json对象{name："value"}
      * dom：需要被获取的父级dom对象
      * dataVal：最终拼接的json对象
      * **/
    Ball.get_input_val=function(dom){
        var dataJson = "{";
        var dataArr = [];
        dom.find("input").each(function(index, _this) {
            var inputN = $(_this).attr("name");
            if (inputN != "" && inputN != null) {
                dataArr.push(inputN + ":'" + $(_this).val() + "'");
                dataJson += ",";
            }
        });
        dataJson = "{" + dataArr.join(",") + "}";
        var dataVal= eval('(' + dataJson + ')');
        return dataVal;
    },
    /**
     * 获取CheckBox被选中的值
     * dom：需要被获取的父级dom对象
     * sep：根据需求设置字符串之间的分割符
     * colums：最终拼接的字符串
     * **/
    Ball.get_checked_val=function(dom,sep){
        var columns="";
        dom.find("input[type='checkbox']:checked,input[type='radio']:checked").each(function(index, _this) {
            var inputN = $(_this).val();
            inputN+=sep;
            columns+=inputN;
        });
        //移除尾部的分割符号
        columns=columns.substring(0,columns.length-1);
        return columns;
    }
    return Ball;

}(jQuery))));
