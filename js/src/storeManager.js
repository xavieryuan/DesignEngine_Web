/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-5
 * Time: 上午9:21
 * 存储器
 */
var DE=DE||{};
DE.store={
    scrollTimer:null, //滚动的时候的timeout
    hotUserLoadedCount:0, //记录下热门用户已经加载了的最后一个的id，-1代表没有更多
    projectLoadedId:0, //分页加载，最后一个作品的时间，-1代表没有更多
    resourceLoadedId:0,
    searchLoadedCount:0,
    currentEditEntityId:0, //当前编辑的作品、资源的id
    currentScrollScreenType:"", //当前需要滚动加载的类型
    userEntitiesShowCount:0, //查看用户那里的作品，已经显示的个数，本地分页
    uploadedMedias:{}, //上传作品、资源时已经上传的媒体文件
    currentSearch:{
        currentSearchType:"",//目前搜索显示的类型
        currentSearchValue:"", //目前搜索的内容
        isTag:true
    },
    currentUser:{  //当前登录的用户信息
        userId:0,
        name:"",
        figure:"",
        role:"",
        description:"",
        email:"",
        openId:"",
        openIdSource:"",
        accessToken:"",
        status:"",
        regLocked:true
    },
    currentShowUser:{ //当前显示的用户详情
        userId:0,
        name:"",
        figure:"",
        role:""
    },
    currentShowEntity:{    //当前显示详情的entity的信息
        id:0,
        hasPraised:false,
        type:"",
        commentLoadedId:0 //详情页面评论加载了的id，-1代表没有更多
    },

    /**
     * 清空存储的数据
     */
    clearStore:function(){
        this.userEntitiesShowCount=0;
        this.hotUserLoadedCount=0;
        this.projectLoadedId=0;
        this.searchLoadedCount=0;
        this.resourceLoadedId=0;
        this.currentShowUser.userId=0;
        this.currentShowUser.name="";
        this.currentShowUser.figure="";
        this.currentShowUser.role="";
        this.currentSearch.currentSearchType="";
        this.currentSearch.currentSearchValue="";
        this.currentSearch.isTag=true;
        this.uploadedMedias={};
        this.currentEditEntityId=0;
        this.currentScrollScreenType="";
        this.clearCurrentShowEntity();
        DE.upload.clearEditData();
    },

    clearCurrentShowEntity:function(){
        this.currentShowEntity.id=0;
        this.currentShowEntity.hasPraised=false;
        this.currentShowEntity.type="";
        this.currentShowEntity.commentLoadedId=0;
    },

    /**
     * 初始化当前显示的用户
     * @param {Object} user 包含用户信息的对象
     */
    initCurrentShowUser:function(user){
        this.currentShowUser.userId=user.userId;
        this.currentShowUser.name=user.userName;
        this.currentShowUser.figure=user.userProfileImg;
        this.currentShowUser.role=user.userRoles[0];
    },

    /**
     * 初始化当前显示的作品（资源）
     * @param {Object} entity  包含作品（资源）信息的对象
     */
    initCurrentShowEntity:function(entity){
        this.currentShowEntity.id=entity.id;
        this.currentShowEntity.hasPraised=entity.hasPraised;
        this.currentShowEntity.type=entity.type;
    },

    /**
     * 清空各个面板的数据,这样不至于页面留有很多不必要的数据,导致数据堆积
     * @param {String} notClear 不需要清空那个界面（当前显示的界面）
     */
    clearScreenData:function(notClear){

        var projectList=$("#de_project_list");
        var searchList=$("#de_search_result");
        var resourceList=$("#de_resource_list");
        var hotUserList=$("#de_hot_user_list");
        var userEntityList=$("#de_user_uploads");
        var usersManager=DE.users;
        var entitiesManager=DE.entities;
        var commentsManager=DE.comments;
        switch (notClear){
            case "project":
                searchList.html("");
                resourceList.html("");
                hotUserList.html("");
                userEntityList.html("");
                usersManager.destroyTable();
                entitiesManager.destroyTable();
                commentsManager.destroyTable();

                break;
            case "hotUser":
                searchList.html("");
                projectList.html("");
                resourceList.html("");
                userEntityList.html("");
                usersManager.destroyTable();
                entitiesManager.destroyTable();
                commentsManager.destroyTable();

                break;
            case "resource":
                searchList.html("");
                projectList.html("");
                hotUserList.html("");
                userEntityList.html("");
                usersManager.destroyTable();
                entitiesManager.destroyTable();
                commentsManager.destroyTable();

                break;
            case "search":
                projectList.html("");
                resourceList.html("");
                hotUserList.html("");
                userEntityList.html("");
                usersManager.destroyTable();
                entitiesManager.destroyTable();
                commentsManager.destroyTable();

                break;
            case "user":
                projectList.html("");
                resourceList.html("");
                hotUserList.html("");
                searchList.html("");
                usersManager.destroyTable();
                entitiesManager.destroyTable();
                commentsManager.destroyTable();

                break;
            case "upload":
                projectList.html("");
                resourceList.html("");
                hotUserList.html("");
                searchList.html("");
                userEntityList.html("");
                usersManager.destroyTable();
                entitiesManager.destroyTable();
                commentsManager.destroyTable();

                break;
            case "userManage":
                projectList.html("");
                resourceList.html("");
                hotUserList.html("");
                searchList.html("");
                userEntityList.html("");
                entitiesManager.destroyTable();
                commentsManager.destroyTable();


                break;
            case "entityManage":
                projectList.html("");
                resourceList.html("");
                hotUserList.html("");
                searchList.html("");
                userEntityList.html("");
                usersManager.destroyTable();
                commentsManager.destroyTable();


                break;
            case "commentManage":
                projectList.html("");
                resourceList.html("");
                hotUserList.html("");
                searchList.html("");
                userEntityList.html("");
                usersManager.destroyTable();
                entitiesManager.destroyTable();

                break;
        }

        //判断是否是修改，如果不是清除上传界面的数据
        if(location.href.match("edit")===null){
            DE.upload.clearEditData();
        }
    },

    /**
     *清空当前登录用户的信息
     */
    clearCurrentUser:function(){
        this.currentUser.userId=0;
        this.currentUser.name="";
        this.currentUser.figure="";
        this.currentUser.role="";
        this.currentUser.email="";
        this.currentUser.description="";
        this.currentUser.openId="";
        this.currentUser.accessToken="";
        this.currentUser.status="";
        this.currentUser.regLocked=true;
    },

    /**
     * 初始化当前登录用户信息
     * @param {Object} data 包含用户信息的对象
     */
    initCurrentUser:function(data){
        this.currentUser.userId=data.userId?data.userId:this.currentUser.userId;
        this.currentUser.figure=data.figure?data.figure:this.currentUser.figure;
        this.currentUser.role=data.role?data.role:this.currentUser.role;
        this.currentUser.name=data.name?data.name:this.currentUser.name;
        this.currentUser.email=data.email?data.email:this.currentUser.email;
        this.currentUser.description=typeof data.description!=="undefined"?data.description:this.currentUser.description;
        this.currentUser.status=data.status?data.status:this.currentUser.status;
        this.currentUser.regLocked=typeof data.regLocked!=="undefined"?data.regLocked:this.currentUser.regLocked;
    }
};