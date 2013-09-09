/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-5
 * Time: 上午9:21
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.store={
    status:{
        loginPanel:0,
        registerPanel:0
    },
    currentUser:{
        userId:0,
        name:"",
        figureUrl:"",
        role:""
    },
    currentShowUser:{
        userId:0,
        name:"",
        figureUrl:"",
        role:""
    },
    hotUserLoadedId:0,
    projectLoadedDate:"",//分页加载，最后一个作品的时间
    resourceLoadedDate:"",
    currentShowEntity:"project",//当前显示的实体类型
    entityShowOrNot:false,
    hasPraised:false,//是否赞过
    userProjectsCount:0,
    userProjectsShow:0, //查看用户那里的作品，已经显示的个数，本地分页
    clearStore:function(){
        this.userProjectsCount=0;
        this.userProjectsShow=0;
        this.projectLoadedDate="";
        this.resourceLoadedDate="";
        this.currentShowEntity="project";
        this.currentShowUser.userId=0;
        this.currentShowUser.name="";
        this.currentShowUser.figureUrl="";
        this.currentShowUser.role="";
    },
    clearCurrentUser:function(){
        this.currentUser.userId=0;
        this.currentUser.name="";
        this.currentUser.figureUrl="";
        this.currentUser.role="";
    },
    initCurrentUser:function(data){
        this.currentUser.userId=data.userId;
        this.currentUser.figureUrl=data.figureUrl;
        this.currentUser.role=data.role;
        this.currentUser.name=data.name;
    }
};