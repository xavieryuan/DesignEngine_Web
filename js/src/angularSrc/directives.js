/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-24
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */
var directives=angular.module("directives",[]);
directives.directive('pwdCheck', function(){
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = angular.element(document.getElementById(attrs.pwdCheck));
            elem.on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val()===firstPassword.val();
                    ctrl.$setValidity('noMatch', v);
                });
            });
            firstPassword.on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val()===firstPassword.val();
                    ctrl.$setValidity('noMatch', v);
                });
            });
        }
    }
});
directives.directive("integer",function(){
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
directives.directive("emailExist",function($http){
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
