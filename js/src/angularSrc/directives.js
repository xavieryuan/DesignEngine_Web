/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-24
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */
var directives=angular.module("directives",["classes"]);
directives.directive('pwdCheck', function(){
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = angular.element(document.getElementById(attrs.pwdCheck));
            elem.on('keyup', function () {
                /*scope.$apply(function () {
                    var v = elem.val()===firstPassword.val();
                    ctrl.$setValidity('noMatch', v);
                });*/
                var v = elem.val()===firstPassword.val();
                ctrl.$setValidity('noMatch', v);
            });
            firstPassword.on('keyup', function () {

                var v = elem.val()===firstPassword.val();
                ctrl.$setValidity('noMatch', v);
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
directives.directive("drag",function(){
    return {
        link:function(scope,elem,attrs,ctrl){
            var targetOl=elem[0];
            var item=attrs.drag;
            var eleDrag = null;//被拖动的元素

            //console.log(elem[0]);
            //console.log(document.getElementById("mediaList"));

            targetOl.onselectstart=function(event){
                if(event.target.className.match(item)!==null){

                    event.preventDefault();
                    event.stopPropagation();
                }
            };
            targetOl.ondragstart=function(event){
                if(event.target.className.match(item)!==null){
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text","移动中");
                    eleDrag = event.target||event.srcElement;

                    return true;
                }
            };
            targetOl.ondragend=function(event){
                if(event.target.className.match(item)!==null){
                    eleDrag=null;

                    event.preventDefault();
                    event.stopPropagation();
                }
            };

            //在元素中滑过
            targetOl.ondragover = function (event) {
                event.preventDefault();
                event.stopPropagation();
            };

            targetOl.ondrop=function(event){

                event.preventDefault();
                event.stopPropagation();
            };

            //ol作为最大的容器也要处理拖拽事件，当在li上滑动的时候放到li的前面，当在ol上滑动的时候放到ol的最后面
            targetOl.ondragenter = function (event) {
                var target=event.toElement||event.target;
                var targetParent=target.parentNode;
                if (target == targetOl) {
                    targetOl.appendChild(eleDrag);
                }else{
                    if(target.tagName=="LI"){
                        targetOl.insertBefore(eleDrag, target);
                    }else{
                        targetOl.insertBefore(eleDrag, targetParent);
                    }
                }

                event.preventDefault();
                event.stopPropagation();
            };
        }
    }
});
directives.directive('animateHide', ["LocationChanger",function(LocationChanger){
    return {
        link: function (scope, element, attrs, ctrl) {

            element.on('click', function () {
                var parent=$(element).parents(".de_animation_project_detail");
                var header=parent.find(".de_project_header");
                var detail=parent.find(".de_project_detail");
                TweenMax.to(header,0.3,{y:-100});
                TweenMax.to(detail,0.3,{y:100});
                TweenMax.to(element,0.4,{opacity:0,onComplete:function(){
                    scope.mainFlags.showProjectDetailFlag=false;
                    scope.mainFlags.projectDetailTemplate="";
                    scope.mainFlags.showMainWrapper=true;
                    scope.$apply();


                    LocationChanger.goBack();
                }});
            });
        }
    }
}]);
directives.directive('hideSomePanel', function(){
    return {
        link: function (scope, element, attrs, ctrl) {
            function hideExtMenu(target){
                var extMenuEl=document.getElementsByClassName("de_ext_nav")[0];
                if(target!=extMenuEl){
                    scope.$apply(function(){
                        scope.mainFlags.extMenuActive="";
                    });
                }
            }

            element.on('click', function (event) {
                hideExtMenu(event.target||event.srcElement);
            });
        }
    }
});
