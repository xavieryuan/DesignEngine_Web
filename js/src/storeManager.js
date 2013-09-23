/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-5
 * Time: 上午9:21
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.store={
    scrollTimer:null,
    isFirstLoad: false, //是否第一次进入，由于火狐第一次不响应popstate，谷歌响应需要记录下来
    hotUserLoadedId:0,
    projectLoadedDate:"",//分页加载，最后一个作品的时间
    resourceLoadedDate:"",
    currentShowEntitiesType:DE.config.entityTypes.project, //当前聚合显示的实体类型
    currentEditEntityId:0,
    currentScrollScreenType:"",
    userProjectsCount:0,
    userProjectsShow:0, //查看用户那里的作品，已经显示的个数，本地分页
    currentSearchType:"project",//目前搜索显示的类型
    currentSearchValue:"",//目前搜索的内容
    uploadedMedias:{},
    currentUser:{
        userId:0,
        name:"",
        figure:"",
        role:"",
        description:"",
        email:""
    },
    currentShowUser:{
        userId:0,
        name:"",
        figure:"",
        role:""
    },
    currentShowEntity:{    //当前显示详情的entity的信息
        id:0,
        hasPraised:false
    },
    clearStore:function(clearFirstLoadFlag){

        /* clearFirstLoadFlag是否重置isFirstLoad此标志，当页面进入时，history的initDatas函数调用了handler函数，handler函数里面
         * 调用了clearStore，那么会重置isFirstLoad，那么会在谷歌第一次进入，响应popstate的函数stateChange中再请求一次数据
         * */
        this.userProjectsCount=0;
        this.userProjectsShow=0;
        this.projectLoadedDate="";
        this.resourceLoadedDate="";
        this.currentShowEntitiesType="project";
        this.currentShowUser.userId=0;
        this.currentShowUser.name="";
        this.currentShowUser.figure="";
        this.currentShowUser.role="";
        this.currentSearchType=DE.config.entityTypes.project;
        this.currentSearchValue="";
        this.uploadedMedias={};
        this.currentEditEntityId=0;
        this.currentShowEntity.id=0;
        this.currentShowEntity.hasPraised=false;
        this.currentScrollScreenType="";

        if(clearFirstLoadFlag){
            this.isFirstLoad=false;
        }
    },
    initCurrentShowUser:function(user){
        this.currentShowUser.userId=user.id;
        this.currentShowUser.name=user.name;
        this.currentShowUser.figure=user.figure;
        this.currentShowUser.role=user.role;
    },
    initCurrentShowEntity:function(entity){
        this.currentShowEntity.id=entity.id;
        this.currentShowEntity.hasPraised=entity.hasPraised;
    },
    clearEditData:function(){
        $("#de_input_project_title").val("");
        $("#de_input_tag").html("");
        $("#de_project_description").text("");
        $("#de_project_thumb").attr("src",DE.config.root+"/images/default_thumb_500.png");
        $("#zy_uploaded_medias_ol").html("");
    },
    clearScreenData:function(notClear){
        var projectList=$("#de_project_list");
        var searchList=$("#de_search_result");
        var resourceList=$("#de_resource_list");
        var hotUserList=$("#de_hot_user_list");
        var userEntityList=$("#de_user_uploads");
        if(notClear=="project"){
            searchList.html("");
            resourceList.html("");
            hotUserList.html("");
            userEntityList.html("");
        }else if(notClear=="hotUser"){
            searchList.html("");
            projectList.html("");
            resourceList.html("");
            userEntityList.html("");
        }else if(notClear=="resource"){
            searchList.html("");
            projectList.html("");
            hotUserList.html("");
            userEntityList.html("");
        }else if(notClear=="search"){
            projectList.html("");
            resourceList.html("");
            hotUserList.html("");
            userEntityList.html("");
        }else if(notClear=="user"){
            projectList.html("");
            resourceList.html("");
            hotUserList.html("");
            searchList.html("");
        }else if(notClear=="upload"){
            projectList.html("");
            resourceList.html("");
            hotUserList.html("");
            searchList.html("");
            userEntityList.html("");
        }

        if(location.href.match("edit")==null){
            this.clearEditData();
        }
    },
    clearCurrentUser:function(){
        this.currentUser.userId=0;
        this.currentUser.name="";
        this.currentUser.figure="";
        this.currentUser.role="";
        this.currentUser.email="";
        this.currentUser.description="";
    },
    initCurrentUser:function(data){
        this.currentUser.userId=data.userId;
        this.currentUser.figure=data.figure;
        this.currentUser.role=data.role;
        this.currentUser.name=data.name;
        this.currentUser.email=data.email;
        this.currentUser.description=data.description;
    }
};