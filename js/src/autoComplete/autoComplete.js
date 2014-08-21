/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-8-15
 * Time: 上午9:30
 * To change this template use File | Settings | File Templates.
 */
angular.module("autoComplete",[]).
    constant("autoCompleteConfig",{
        version:"1.0"
    }).
    factory("AutoComplete",["$http",function($http){
        return {
            selectedEvent:null,
            getResultUrl:"",
            resultFilter:null,
            autoComplete:function(param){
                this.getResultUrl=param.url;
                this.selectedEvent=param.selectedEvent;
                this.resultFilter=param.filter;
            },
            getResult:function(){
                var me=this;
                if(me.getResultUrl){
                    return $http.get(me.getResultUrl).then(function(res){
                        //console.log("1");
                        var results=[];
                        var data=res.data;
                        if(me.resultFilter){
                            results=me.resultFilter(data);
                        }else{
                            if(data.success){
                                results=data.results;
                            }
                        }
                        return results;
                    });
                }
            }
        }
    }]).
    controller("ctrl",["$scope","AutoComplete",function($scope,AutoComplete){
        $scope.showResult=false;
        $scope.items=[];
        $scope.content="";
        $scope.currentItemIndex=0;

        $scope.setCurrent=function(index){
            $scope.currentItemIndex=index;
        };
        $scope.selectItem=function(item){
            $scope.content=item;
            AutoComplete.selectedEvent($scope.content);
            $scope.items=[];
        };
        $scope.keyDownEvent=function(event){
            if(event.keyCode==13&&$scope.content){
                AutoComplete.selectedEvent($scope.content);
            }
        };
        $scope.keyUpEvent=function(){
            if($scope.content.length>=2){
                AutoComplete.getResult().then(function(data){
                    //console.log("2");
                    $scope.items=data;
                });
            }
        }
    }]).
    directive("autoComplete",[function(){
        return {
            replace:true,
            templateUrl:"js/src/autoComplete/tpl.html",
            link:function($scope,element){

            }
        }
    }]);

