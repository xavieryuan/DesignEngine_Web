/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-24
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */
var filters=angular.module("filters",[]);
filters.filter("setMinLength", function(){
    return function(first, second){
        return first.replace("${value}",second);
    }
});
filters.filter("setMaxLength", function(){
    return function(first, second){
        return first.replace("${value}",second);
    }
});
filters.filter("getMinNumber", function(){
    return function(first, second){
        return Math.min(first,second);
    }
});
filters.filter("arrayHasElement",function(){
    return function(array,element){
        var length=array.length;
        var result=false;
        for(var i=0;i<length;i++){
            if(array[i]==element){
                result=true;
                break;
            }
        }

        return result;
    }
});
