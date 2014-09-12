/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-24
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */
var directives=angular.module("directives",["services"]);
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
directives.directive('preventEnterSubmit', function(){
    return {
        link: function (scope, elem, attrs) {
            elem.on("keydown",function(event){
                if(event.keyCode==13){
                    return false;
                }
            })
        }
    }
});
directives.directive("isEmail",function(){
    return {
        require:"ngModel",
        link:function(scope,elem,attrs,ctrl){
            elem.bind("keyup",function(){
                if(ctrl.$viewValue){
                    scope.$apply(function(){
                        var reg=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/;

                        ctrl.$setValidity("emailExist",reg.test(ctrl.$viewValue));
                    });

                }else{
                    scope.$apply(function(){
                        ctrl.$setValidity("emailExist",true);
                    });
                }
            });
        }
    }
});
/**
 *重写required，不然ie里面页面一展示就提示错误,还是要配合required，不然submit的disable会失效
 */
directives.directive("ownRequired",function(){
    return {
        require:"ngModel",
        link:function(scope,elem,attrs,ctrl){
            elem.bind("keyup",function(){
                if(ctrl.$viewValue){
                    scope.$apply(function(){
                        ctrl.$setValidity("ownRequired",true);
                    });

                }else{
                    scope.$apply(function(){
                        ctrl.$setValidity("ownRequired",false);
                    });
                }
            });
            console.log(ctrl);
        }
    }
});
directives.directive("emailExist",function($http){
    return {
        require:"ngModel",
        link:function(scope,elem,attrs,ctrl){
            elem.bind("keyup",function(){
                if(ctrl.$viewValue){
                    $http.get("/email_exists",{
                        params:{email:ctrl.$viewValue},
                        transformRequest:function(data, headersGetter){
                            return JSON.stringify(data);
                        },
                        transformResponse:function(data, headersGetter){
                            return JSON.parse(data);
                        }
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
directives.directive("toggleLockBox",["toaster","Box","Config",function(toaster,Box,Config){
    return {
        link: function (scope, element, attrs, ctrl) {
            element.on('click', function (event) {
                var params=attrs.toggleLockBox.split(",");
                var targetStatus=params[1]==Config.boxStatus.open?Config.boxStatus.closed:Config.boxStatus.open;
                Box.resource.setBoxStatus({boxId:params[0]},{id:params[0],status:targetStatus},function(data){
                    if(params[2]){
                        scope.boxes[params[2]]["topic"]["status"]=targetStatus;
                    }else{
                        scope.box.status=targetStatus;
                    }
                    toaster.pop('success',Config.messages.successTitle,Config.messages.operationSuccess,null,null);
                });
            });
        }
    }
}]);
directives.directive('clickToHideModalPanel', function(){
    return {
        link: function (scope, element, attrs, ctrl) {
            element.on('click', function (event) {
                var target=event.target||event.srcElement;
                //判断是否隐藏侧边菜单
                if($(target).parents("#de_ext_nav").length==0 && !$(target).is("#de_ext_nav")){
                    scope.$apply(function(){
                        scope.mainFlags.extMenuActive="";
                    });
                }
            });
        }
    }
});
directives.directive("windowStateChange",["$window","CFunctions","LocationChanger","safeApply",
    function($window,CFunctions,LocationChanger,safeApply){
    return {
        link:function(scope,element,attrs){

            //$window是被element函数封装过的
            $window.addEventListener("popstate",function(event){
                scope.initPage(location.pathname);
                //safeApply();
                //LocationChanger.canReload();
            });
        }
    }
}]);
directives.directive("windowScroll", ["$window","$document","$timeout","$interval","Config","Storage","Project","Box","User",
    function ($window,$document,$timeout,$interval,Config,Storage,Project,Box,User) {
        return {
            link: function(scope, element, attrs) {

                //由于在多个view里面有绑定，所以每次绑定前解除，不然会重复绑定
                angular.element($window).unbind("scroll");
                angular.element($window).bind("scroll", function() {
                    if(Storage.scrollTimer){
                        $timeout.cancel(Storage.scrollTimer);
                    }

                    //console.log($document[0]);

                    if(Storage.currentScrollScreenType&&$document[0].body.scrollHeight-$window.innerHeight<=$window.scrollY&&
                        Storage.lastLoadedId!=Config.hasNoMoreFlag&&Storage.lastLoadedId!=0&&scope.mainFlags.showMainWrapper){
                        Storage.scrollTimer=$timeout(function(){
                            switch(Storage.currentScrollScreenType){
                                case Config.scrollScreenType.project:
                                    Project.getProjects().$promise.then(function(data){
                                        var count= 0,length=data.artifacts.length;
                                        var inter=$interval(function(){
                                            if(count<length){
                                                scope.projects.push(data.artifacts[count]);
                                                count++;
                                            }else{
                                                $interval.cancel(inter);
                                            }
                                        },200);
                                    });

                                    break;
                                case Config.scrollScreenType.box:
                                    Box.getBoxes(scope.scope,scope.keyword).$promise.then(function(data){
                                        var count= 0,length=data.topics.length;
                                        var inter=$interval(function(){
                                            if(count<length){
                                                scope.boxes.push(data.topics[count]);
                                                count++;
                                            }else{
                                                $interval.cancel(inter);
                                            }
                                        },200);

                                    });

                                    break;
                                case Config.scrollScreenType.boxDetail:
                                    Box.getBoxProjects(scope.boxId).$promise.then(function(data){
                                        var count= 0,length=data.artifacts.length;
                                        var inter=$interval(function(){
                                            if(count<length){
                                                scope.projects.push(data.artifacts[count]);
                                                count++;
                                            }else{
                                                $interval.cancel(inter);
                                            }
                                        },200);
                                    });

                                    break;
                                case Config.scrollScreenType.searchResult:
                                    Project.getSearchResult(scope.searchContent).$promise.then(function(data){
                                        var count= 0,length=data.artifacts.length;
                                        var inter=$interval(function(){
                                            if(count<length){
                                                scope.projects.push(data.artifacts[count]);
                                                count++;
                                            }else{
                                                $interval.cancel(inter);
                                            }
                                        },200);
                                    });

                                    break;
                                case Config.scrollScreenType.userDetail:
                                    User.getUserProjects(scope.userId).$promise.then(function(data){
                                        var count= 0,length=data.artifacts.length;
                                        var inter=$interval(function(){
                                            if(count<length){
                                                scope.projects.push(data.artifacts[count]);
                                                count++;
                                            }else{
                                                $interval.cancel(inter);
                                            }
                                        },200);
                                    });
                                    break;
                            }
                        },200);
                    }
                });
            }
        }
}]);