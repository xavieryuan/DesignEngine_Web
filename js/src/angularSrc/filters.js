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
