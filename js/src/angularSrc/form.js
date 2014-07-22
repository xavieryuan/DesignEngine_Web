/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-17
 * Time: 下午3:08
 * To change this template use File | Settings | File Templates.
 */
var formHandler=angular.module("formHandler",[]);
formHandler.filter("setMinLength", function(){
    return function(first, second){
        return first.replace("${value}",second);
    }
});
formHandler.filter("setMaxLength", function(){
    return function(first, second){
        return first.replace("${value}",second);
    }
});

formHandler.directive("integer",function(){
    return {
        require:"ngModel",
        link:function(scope,elem,attrs,ctrl){
            ctrl.$parsers.unshift(function(viewValue){
                var INTER_REGEXP=/^\-?\d+$/;
                if(INTER_REGEXP.test(viewValue)){
                    ctrl.$setValidity("integer",true);
                    return viewValue;
                }else{
                    ctrl.$setValidity("integer",false);
                    return undefined;
                }
            });
        }
    }
});
formHandler.directive("emailExist",function($http){
    return {
        require:"ngModel",
        link:function(scope,elem,attrs,ctrl){

            elem.bind("keyup",function(){
                //console.log(ctrl);
                if(ctrl.$viewValue){
                    $http({
                        method:"get",
                        url:"php/nameExist.php",
                        params:{email:ctrl.$viewValue}
                    }).success(function(data,status,headers,config){
                            if(data.exist){
                                ctrl.$setValidity("emailExist",false);
                            }else{
                                ctrl.$setValidity("emailExist",true);
                            }
                        }).error(function(data,status,headers,config){
                            ctrl.$setValidity('emailExist', true);
                        });
                }else{
                    ctrl.$setValidity("emailExist",true);
                }
            });
        }
    }
});
formHandler.service("Form",["$rootScope","$http",function($rootScope,$http){
    var postCfg={
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        transformRequest:transform
    };

    //序列化参数
    function param(obj){
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {
            value = obj[name];

            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    }

    //发送post请求时的数据处理操作
    function transform(data){
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }


    /**
     * 提交表单
     * @param param {formUrl:"表单提交地址",formParam:"表单数据对象",successCb:"提交成功后回调函数"}
     */
    this.ajaxSubmit=function(param){

        console.log(angular.toJson(param.formParam));

        /*$http.post(param.formUrl,param.formParam).
            success(param.successCb).
            error(function(data, status, headers, config){
                console.log("error");
            });*/
        $http.post(param.formUrl,param.formParam,postCfg).
             success(param.successCb).
             error(function(data, status, headers, config){
                console.log(data);
             });
    };
}]);
