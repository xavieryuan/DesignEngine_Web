var wechat=angular.module("angular",[]);

wechat.constant("Config",{
    previewImgSuffix:"-400x300",
    ajaxUrls:{
        getProjectDetail:"/api/artifacts/:projectId"
    }
});

wechat.service("CFunctions",["$rootScope","$location",function($rootScope,$location){
    this.getFilePathInfo=function(filePath){
        var extPos=filePath.lastIndexOf(".");

        return {
            filePath:filePath.substring(0,extPos),
            ext:filePath.substring(extPos)
        }
    };
    this.getPathParam=function(){
        var path=$location.path();
        var pos=path.lastIndexOf("/");
        return path.substring(pos+1);
    };
}]);

wechat.controller("projectDetail",["$scope","$http","Config","CFunctions",function($scope,$http,Config,CFunctions){
    var projectId=CFunctions.getPathParam();
    $scope.project={};
    $http.get(Config.ajaxUrls.getProjectDetail.replace(":projectId",projectId)).success(function(data){
        $scope.project=data.artifact;
        $scope.project.boxId=data.artifact.topic_id||data.user.id;
        $scope.project.praised=data.praised;
        $scope.project.user=data.user;
        $scope.project.topic=data.topic;

        var length=$scope.project.assets.length;
        for(var i=0;i<length;i++){
            var fileInfo=CFunctions.getFilePathInfo($scope.project.assets[i]["profile_image"]);
            $scope.project.assets[i]["profile_image"]=
                fileInfo["filePath"]+Config.imageScale.previewSmall+fileInfo["ext"];
        }
    });
}]);