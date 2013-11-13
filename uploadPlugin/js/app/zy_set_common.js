/**
 * User: ty
 * Date: 13-6-13
 * 幻灯片设置媒体文件页面公用js
 * 数据字典
 * zy_get_media_id 获取当前媒体的id
 * zy_get_private_uploaded 获取私有的uploaded_medias
 * zy_get_compress_img  获取压缩的图片
 * zy_set_old_content 进入页面后设置原来的值
 * zy_create_media_uploader  媒体文件上传句柄
 * zy_create_thumb_uploader  上传缩略图句柄
 */

//添加配置文件，这样在父级别没有配置文件时也可以使用
var config={
    uploadFileUrl:"/design/upload",
    uploadSize:{
        maxMediaSize:"200m", //最大的媒体文件上传大小
        maxImageSize:"2m"//最大的图片文件上传大小
    },
    uploadFilters:{  //媒体类型格式刷选器
        imageFilter:"jpg,gif,png,jpeg",
        pptFilter:"pptx",
        _3dFilter:"3d",
        videoFilter:"mp4",
        fileFilter:"zip,pdf"
    },
    uploadMediaTypes:{  //媒体类型
        image:"zy_image",
        ppt:"zy_ppt",
        _3d:"zy_3d",
        localVideo:"zy_location_video",
        file:"zy_file",
        webVideo:"zy_network_video"
    },
    mediaObj:{  //媒体对象
        mediaTitle:"zy_media_title",
        mediaMemo:"zy_media_memo",
        mediaType:"zy_media_type",
        mediaThumbFilename:"zy_media_thumb_filename",
        mediaThumbFilepath:"zy_media_thumb_filepath",
        mediaFilename:"zy_media_filename",
        mediaFilepath:"zy_media_filepath"
    },
    messageCode:{  //错误提示
        errorTitle:"错误提示",
        successTitle:"成功提示",
        operationSuccess:"操作成功，请关闭后选择其他操作！",
        timeout:"登陆超时，请关闭后刷新页面并登录！",
        networkError:"网络连接失败，请稍后重试！",
        validCodeError:"验证码错误！",
        operationError:"操作失败，请稍后重试！",
        imgSizeError:"图片不是1:1比例！",
        loadDataError:"请求数据失败！",
        filenameError:"文件名必须是数字下划线汉字字母,且不能以下划线开头！",
        nameOrPwdError:"用户名或者密码错误！",
        notFound:"页面资源未发现，2秒后跳转到首页！",
        changePwdSuccess:"密码修改成功，2秒后跳转到首页并退出！",
        emailNotExist:"输入的邮箱不存在！",
        emailSendSuccess:"操作成功，请进入邮箱查看邮件！",
        mediaHasNoThumb:"有媒体文件没有上传缩略图，请上传后再预览！",
        hasNoMedia:"没有上传媒体文件或者有上传错误的媒体文件，请上传或者删除后再预览！",
        stepOneUnComplete:"标题、标签、描述、缩略图等没有填写完整！",
        pptHasNotUploaded:"此资源还没有被上传到资源服务器，暂时不能查看！",
        pptUploadError:"此资源上传到资源服务器出错，无法查看！",
        uploadSizeError:"最大文件大小",
        uploadExtensionError:"只允许上传",
        uploadIOErrror:"服务器端异常，请稍后重试！"
    }
};
var zy_set_common = (function(){

    var parent=window.parent;
    var uploaded_medias=parent.DE.store.uploadedMedias; //已经上传了的媒体文件
    var UI=parent.DE.UIManager;
    var currentUserId=parent.DE.store.currentUser.userId;

    return {
        /*
         * 获取当前媒体文件的id
         * return 媒体文件id
         * */
        "zy_get_media_id":function(){
            var url=location.href;
            var pos=url.indexOf("?"); //获取参数，因为media_id将通过参数传递过来
            var zy_media_id=url.substr(pos+1,url.length-1);

            return zy_media_id;
        },

        /*
         * 获取压缩后的图片
         * params imgurl 图片的路径
         * return  压缩图片路径
         * */
        "zy_get_compress_img":function(imgurl){
            var img_ext=imgurl.substring(imgurl.lastIndexOf("."),imgurl.length);
            var img_src_compress=imgurl.substring(0,imgurl.lastIndexOf("."))+parent.zy_config.zy_compress_suffix+img_ext;

            return img_src_compress;
        },

        /*
        * 获取私有变量uploaded_medias
        * return uploaded_medias
        * */
        "zy_get_private_uploaded":function(){

            return uploaded_medias;
        },

        /*
         * 打开设置页面时，设置原来的内容
         * params zy_media_id 媒体文件的id
         * */
        "zy_set_old_content":function(zy_media_id,zy_media_type){

            if(zy_media_type!=config.uploadMediaTypes.image){
                if(zy_media_type==config.uploadMediaTypes.webVideo){

                    //网络视频设置不一样
                    if(uploaded_medias[zy_media_id][config.mediaObj.mediaFilename]){
                        $("#zy_network_input").val(uploaded_medias[zy_media_id][config.mediaObj.mediaFilename]);
                        $("#zy_file_info").text($("#zy_network_input").val());
                        $("#zy_file_info_div").removeClass("zy_hidden");
                        $("#zy_change_div").addClass("zy_hidden");
                    }
                }else{
                    $("#zy_file_info").html(uploaded_medias[zy_media_id][config.mediaObj.mediaFilename]);
                }
            }

            // 设置缩略图
            if(uploaded_medias[zy_media_id][config.mediaObj.mediaThumbFilepath]){

                //设置缩略图,显示压缩后的图片
                $("#zy_media_thumb").attr("src",uploaded_medias[zy_media_id][config.mediaObj.mediaThumbFilepath]);
            }

            // 设置标题和描述
            if(uploaded_medias[zy_media_id][config.mediaObj.mediaTitle]){
                $("#zy_media_title").val(uploaded_medias[zy_media_id][config.mediaObj.mediaTitle]);
            }
            if(uploaded_medias[zy_media_id][config.mediaObj.mediaMemo]){
                $("#zy_media_memo").text(uploaded_medias[zy_media_id][config.mediaObj.mediaMemo]);

            }
        },

        /*
         * 媒体设置时上传媒体
         * params filters 媒体文件格式筛选器，zy_media_id 媒体文件id
         * */
        "zy_create_media_uploader":function(filters,zy_media_id){
            var uploader_media=new plupload.Uploader({
                runtimes:"flash",
                multi_selection:false,
                max_file_size:config.uploadSize.maxMediaSize,
                browse_button:"zy_upload_media_button",
                container:"zy_left_top",
                unique_names:true,
                //chunk_size:"10mb",
                url: config.uploadFileUrl,
                flash_swf_url : '../js/lib/plupload.flash.swf',
                multipart_params:{
                    userId:currentUserId
                },
                filters : [
                    {title : "Media files", extensions : filters}
                ]
            });

            //初始化
            uploader_media.init();

            //文件添加事件
            uploader_media.bind("FilesAdded",function(up,files){

                up.start(); //开始上传

                //显示按钮
                $("#zy_upload_media_button").addClass("zy_hidden");
            });

            //文件上传进度条事件
            uploader_media.bind("UploadProgress",function(up,file){
                $("#zy_file_info").html(file.percent + '%'+file.name);
            });

            //出错事件
            uploader_media.bind("Error",function(up,err){

                //一般采用父级别的错误提示
                if(err.message.match("Init")==null){
                    if(err.message.match("size")){
                       UI.showMsgPopout(config.messageCode.errorTitle,config.messageCode.uploadSizeError+config.uploadSize.maxMediaSize);
                    }else if(err.message.match("extension")){
                        UI.showMsgPopout(config.messageCode.errorTitle,filters);
                    }else{
                        UI.showMsgPopout(config.messageCode.errorTitle,config.messageCode.uploadIOErrror);
                    }
                }

                up.refresh();

                //设置页面展示
                //$("#zy_file_info").html("上传出错");
                $("#zy_upload_media_button").removeClass("zy_hidden");
            });

            //上传完毕事件
            uploader_media.bind("FileUploaded",function(up,file,res){
                var response=JSON.parse(res.response);
                if(response.success){
                    //设置uploaded_medias的值
                    uploaded_medias[zy_media_id][config.mediaObj.mediaFilename]=response.clientFilename;
                    uploaded_medias[zy_media_id][config.mediaObj.mediaFilepath]=response.url;

                    //设置列表中的值
                    $("#zy_uploaded_medias_ol a[data-zy-media-id='"+zy_media_id+"']",parent.document).find(".zy_media_filename").text(file.name);

                    //$(".zy_file_info").html(file.name).attr("data-zy-media-url",response.data.url);
                    $("#zy_file_info").html(file.name);
                    $("#zy_upload_media_button").removeClass("zy_hidden");
                }else{
                    UI.showMsgPopout(config.messageCode.errorTitle,config.messageCode.uploadIOErrror);
                }

            });
        },

        /*
         * 媒体设置时上传缩略图
         * params zy_media_id 媒体文件的id
         * */
        "zy_create_thumb_uploader":function(zy_media_id){
            var uploader_thumb=new plupload.Uploader({
                runtimes:"flash",
                multi_selection:false,
                max_file_size:config.uploadSize.maxImageSize,
                browse_button:"zy_upload_thumb_button",
                container:"zy_left_bottom",
                unique_names:true,
                url: config.uploadFileUrl, //parent在每个js里面都有定义
                flash_swf_url:'../js/lib/plupload.flash.swf',
                multipart_params:{
                    userId:currentUserId
                },
                filters : [
                    {title : "Image files", extensions : config.uploadFilters.imageFilter}
                ]
            });

            //初始化
            uploader_thumb.init();

            //文件添加事件
            uploader_thumb.bind("FilesAdded",function(up,files){

                up.start();//开始上传
            });

            //文件上传进度条事件
            uploader_thumb.bind("UploadProgress",function(up,file){
                //$("#"+file.id+" b").html(file.percent + "%");
            });

            //出错事件
            uploader_thumb.bind("Error",function(up,err){

                //一般采用父级别的错误提示
                if(err.message.match("Init")==null){
                    if(err.message.match("size")){
                        UI.showMsgPopout(config.messageCode.errorTitle,config.messageCode.uploadSizeError+config.uploadSize.maxImageSize);
                    }else if(err.message.match("extension")){
                        UI.showMsgPopout(config.messageCode.errorTitle,config.messageCode.uploadExtensionError+config.uploadFilters.imageFilter);
                    }else{
                        UI.showMsgPopout(config.messageCode.errorTitle,config.messageCode.uploadIOErrror);
                    }
                }
                up.refresh();
            });

            //上传完毕事件
            uploader_thumb.bind("FileUploaded",function(up,file,res){

                //和父级别交互操作
                var response=JSON.parse(res.response);
                if(response.success){

                    //设置uploaded_medias的值
                    if(uploaded_medias[zy_media_id][config.mediaObj.mediaType]==config.uploadMediaTypes.image){

                        //如果是图片媒体，需要同时设置四个信息
                        uploaded_medias[zy_media_id][config.mediaObj.mediaThumbFilename]=response.clientFilename;
                        uploaded_medias[zy_media_id][config.mediaObj.mediaThumbFilepath]=response.url;
                        uploaded_medias[zy_media_id][config.mediaObj.mediaFilename]=response.clientFilename;
                        uploaded_medias[zy_media_id][config.mediaObj.mediaFilepath]=response.url;
                    }else{
                        uploaded_medias[zy_media_id][config.mediaObj.mediaThumbFilename]=response.clientFilename;
                        uploaded_medias[zy_media_id][config.mediaObj.mediaThumbFilepath]=response.url;
                    }

                    //设置缩略图，显示压缩后的图片
                    var img_src=response.url;
                    //var img_ext=img_src.substring(img_src.lastIndexOf("."),img_src.length);
                    //var img_src_compress=img_src.substring(0,img_src.lastIndexOf("."))+parent.DE.config.imgSize.middle+img_ext;
                    $("#zy_media_thumb").attr("src",img_src);

                    var parentA=$("#zy_uploaded_medias_ol a[data-zy-media-id='"+zy_media_id+"']",parent.document);


                    //设置列表中的缩略图
                    parentA.find(".zy_small_thumb").attr("src",img_src);
                    parentA.parent().removeClass("zy_media_list_error");


                    //如果是图片类型，还需要设置文件名
                    if(zy_media_id.match("zy_image")!=null){
                        parentA.find(".zy_media_filename").text(file.name);
                    }

                }else{
                    UI.showMsgPopout(config.messageCode.errorTitle,config.messageCode.uploadIOErrror);
                }
            });
        }
    };


})();