var weChatApp=angular.module("weChatApp",[]);

weChatApp.constant("Config",{
    imageScale:{
        thumbSmall:"-200x200",
        previewSmall:"-400x300"
    },
    ajaxUrls:{
        getProjectDetail:"../api/artifacts/:projectId"
    }
});

weChatApp.service("CFunctions",["$rootScope",function($rootScope){
    this.getFilePathInfo=function(filePath){
        var extPos=filePath.lastIndexOf(".");

        return {
            filePath:filePath.substring(0,extPos),
            ext:filePath.substring(extPos)
        }
    };
    this.getPathParam=function(){
        var path=location.href;
        var pos=path.lastIndexOf("/");
        return path.substring(pos+1);
    };
}]);

weChatApp.controller("projectDetail",["$scope","$http","Config","CFunctions",function($scope,$http,Config,CFunctions){
    var projectId=CFunctions.getPathParam();
    $scope.project={};
    $http.get(Config.ajaxUrls.getProjectDetail.replace(":projectId",projectId)).success(function(data){
        $scope.project=data.artifact;
        $scope.project.boxId=data.artifact.topic_id||data.user.id;
        $scope.project.praised=data.praised;
        $scope.project.user=data.user;
        $scope.project.topic=data.topic;

        shareData.imgUrl=$scope.project.profile_image;
        shareData.shareTitle=$scope.project.name;
        shareData.descContent=$scope.project.description;

        var length=$scope.project.assets.length;
        for(var i=0;i<length;i++){
            var fileInfo=CFunctions.getFilePathInfo($scope.project.assets[i]["profile_image"]);
            $scope.project.assets[i]["profile_image"]=
                fileInfo["filePath"]+Config.imageScale.previewSmall+fileInfo["ext"];
        }
    });
}]);


