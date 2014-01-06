/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-4
 * Time: 下午6:01
 *上传（新建、修改）作品资源模块
 */
var DE=DE||{};
DE.upload=(function(){

    var addedTags={}; //已经添加的标签

    /**
     * json对象转成json字符串
     * @param {Object} o 需要转化的对象
     * @returns {string} 转化后的字符串
     */
    function jsonToStr(o) {
        var arr = [];
        var fmt = function (s) {
            if (typeof s == 'object' && s != null) return jsonToStr(s);
            return /^(string|number)$/.test(typeof s) ? '"' + s + '"' : s;
        };
        for (var i in o) arr.push('"' + i + '":' + fmt(o[i]));
        return '{' + arr.join(',') + '}';
    }


    /**
     * 格式化日期
     * @returns {string}  返回格式化的日期
     */
    function toDay(){

        var date=new Date();

        var year=date.getFullYear();

        var month=date.getMonth()+1;

        var day=date.getDate();

        return year+"-"+month+"-"+day;

    }


    /**
     * 产生随机数，可以自带前缀arguments[0]
     * @returns {string} 返回产生的字符串
     */
    function getRandom(){
        var date = new Date();
        var mo = (date.getMonth() + 1) < 10 ? ('0' + '' + (date.getMonth() + 1)) : date.getMonth() + 1;
        var dd = date.getDate() < 10 ? ('0' + '' + date.getDate()) : date.getDate();
        var hh = date.getHours() < 10 ? ('0' + '' + date.getHours()) : date.getHours();
        var mi = date.getMinutes() < 10 ? ('0' + '' + date.getMinutes()) : date.getMinutes();
        var ss = date.getSeconds() < 10 ? ('0' + '' + date.getSeconds()) : date.getSeconds();
        var retValue = date.getFullYear() + '' + mo + '' + dd + '' + hh + '' + mi + '' + ss + '';
        for (var j = 0; j < 4; j++) {
            retValue += '' + parseInt(10 * Math.random()) + '';
        }
        if (arguments.length == 1) {
            return arguments[0] + '' + retValue;
        }
        else
            return retValue;
    }

    /**
     * 获取已经上传的媒体文件，即幻灯片（文章）的每一页，供预览使用
     * @returns {Array} 返回对象数组
     */
    function  getSlidePages(){
        var array_slides=[];
        $(".zy_media_list").each(function(index,m){
            var obj={};//幻灯片每一页的对象
            var media_id=$(this).data("zy-media-id");
            var title=DE.store.uploadedMedias[media_id][DE.config.mediaObj.mediaTitle];
            var type=DE.store.uploadedMedias[media_id][DE.config.mediaObj.mediaType];
            var memo=DE.store.uploadedMedias[media_id][DE.config.mediaObj.mediaMemo];
            var img_src=DE.store.uploadedMedias[media_id][DE.config.mediaObj.mediaThumbFilepath];
            //var img_src_compress=$(this).find("img").attr("src");

            obj.title=title?title:"";
            obj.memo=memo?memo:"";

            if(type==DE.config.uploadMediaTypes.image){
                obj.content='<a data-has-media="true" class="de_only_image"  href="'+img_src+'"><img data-media-type="'+DE.config.uploadMediaTypes.image+'" src="'+img_src+'" data-media-id="'+media_id+'" /></a>';
            }else if(type==DE.config.uploadMediaTypes.ppt){
                obj.content='<a data-has-media="true" class="de_has_ppt de_has_media"  href="'+img_src+'"><img data-media-type="'+DE.config.uploadMediaTypes.ppt+'" src="'+img_src+'" data-media-id="'+media_id+'" /></a>';
            }else if(type==DE.config.uploadMediaTypes._3d){
                obj.content='<a data-has-media="true" class="de_has_3d de_has_media"  href="'+img_src+'"><img data-media-type="'+DE.config.uploadMediaTypes._3d+'" src="'+img_src+'" data-media-id="'+media_id+'" /></a>';
            }else if(type==DE.config.uploadMediaTypes.localVideo){
                obj.content='<a data-has-media="true" class="de_has_video de_has_media" href="'+img_src+'"><img data-media-type="'+DE.config.uploadMediaTypes.localVideo+'" src="'+img_src+'" data-media-id="'+media_id+'" /></a>';
            }else if(type==DE.config.uploadMediaTypes.webVideo){
                obj.content='<a data-has-media="true" class="de_has_web_video de_has_media"  href="'+img_src+'"><img data-media-type="'+DE.config.uploadMediaTypes.webVideo+'" src="'+img_src+'" data-media-id="'+media_id+'" /></a>';
            }else if(type==DE.config.uploadMediaTypes.file){
                obj.content='<a class="de_has_file de_has_media"  href="'+DE.store.uploadedMedias[media_id][DE.config.mediaObj.mediaFilepath]+'"><img data-media-type="'+DE.config.uploadMediaTypes.file+'" src="'+img_src+'" data-media-id="'+media_id+'" /></a>';
            }else if(type==DE.config.uploadMediaTypes.flash){
                obj.content='<a data-has-media="true" class="de_has_flash de_has_media"  href="'+img_src+'"><img data-media-type="'+DE.config.uploadMediaTypes.flash+'" src="'+img_src+'" data-media-id="'+media_id+'" /></a>';
            }

            array_slides.push(obj);
        });

        //将所有的幻灯片页返回
        return array_slides;
    }

    /**
     * 获取设置iframe的地址，并且显示上传的文件的li
     * @param {Object} params 参数对象
     * type（文件类型）,url（文件地址）,iframeSrc（iframe地址）,mediaId（文件media对象id）,filename（文件名）
     */
    function setIframeAndShowLi(params){

        var classString = "class='zy_media_list_error'"; //没有上传缩略图的文件都会设置此类用以提示
        var thumb_src ="images/default_small_thumb.png"; //由于设置了basehref不需要再加前缀


        if (params.type == DE.config.uploadMediaTypes.image) {

            //如果是图片，设置缩略图地址为本身（需要获取缩略图地址）
            //var img_src=params.url;
            //var img_ext=img_src.substring(img_src.lastIndexOf("."),img_src.length);
            //var img_compress=img_src.substring(0,img_src.lastIndexOf("."))+parent.DE.config.imgSize.small+img_ext;
            thumb_src = params.url;
            classString = "";
        }

        if (jQuery("#zy_uploaded_medias_ol .zy_media_list_active").length == 0) {
            classString = classString == "" ? "class='zy_media_list_active'" : "class='zy_media_list_active zy_media_list_error'";
            showIframe(params.iframeSrc);
        }

        //组装显示的数据
        var data={
            classString:classString,
            media_type:params.type,
            media_id:params.mediaId,
            iframe_src:params.iframeSrc,
            thumb_src:thumb_src,
            filename:params.filename
        };

        //显示列表项
        var tpl=$("#zy_complete_tpl").html();
        var html=juicer(tpl,data);
        $("#zy_uploaded_medias_ol").append(html);
    }

    function showIframe(src){
        if($("#zy_media_iframe").length!=0){
            $("#zy_media_iframe").remove();
        }
        var tpl=$("#zy_upload_iframe_tpl").html();
        var html=juicer(tpl,{src:src});
        $("#zy_uploader_column_right").append(html);
    }

    /**
     * 将已经上传的媒体文件记录到DE.store.uploadedMedias对象中(hash表)
     * @param {String} type 媒体文件类型
     * @param {String} filename 媒体文件名称
     * @param {String} url 媒体文件地址
     * @param {String} mediaId 媒体文件media对象id
     */
    function setUploadedMediasObj(type,filename,url,mediaId){

        //设置de_uploaded_medias
        DE.store.uploadedMedias[mediaId] = {

            //声明一个空的对象，后续将内容全部加入
        };

        if (type == DE.config.uploadMediaTypes.image) {

            //如果是图片媒体，需要同时设置四个信息
            DE.store.uploadedMedias[mediaId][DE.config.mediaObj.mediaThumbFilename] = filename;
            DE.store.uploadedMedias[mediaId][DE.config.mediaObj.mediaThumbFilepath] = url;
            DE.store.uploadedMedias[mediaId][DE.config.mediaObj.mediaFilename] = filename;
            DE.store.uploadedMedias[mediaId][DE.config.mediaObj.mediaFilepath] = url;
        } else {
            DE.store.uploadedMedias[mediaId][DE.config.mediaObj.mediaFilename] =filename;
            DE.store.uploadedMedias[mediaId][DE.config.mediaObj.mediaFilepath] = url;
        }
        DE.store.uploadedMedias[mediaId][DE.config.mediaObj.mediaType] = type;
    }


    /**
     * 上传幻灯片（文章）封面图句柄
     */
    function createThumbUpload(){
        var uploaderThumb = new plupload.Uploader({
            runtimes:"html5",
            multi_selection:false,
            max_file_size:DE.config.uploadSize.maxImageSize,
            browse_button:"de_upload_thumb_btn",
            container:"de_upload_thumb_container",
            url:DE.config.ajaxUrls.uploadFileUrl,
            unique_names:true,
            //urlstream_upload:true,
            //flash_swf_url : (document.baseURI||$("#de_base_url").attr("href"))+'js/lib/plupload.flash.swf',
            multipart_params:{
                isThumb:true
                //userId:DE.store.currentUser.userId
            },
            filters:[
                {title:"Image files", extensions:DE.config.uploadFilters.imageFilter}
            ]
        });

        //初始化
        uploaderThumb.init();

        //文件添加事件
        uploaderThumb.bind("FilesAdded", function (up, files) {
            up.start();
        });

        //出错事件
        uploaderThumb.bind("Error", function (up, err) {
            if(err.message.match("Init")==null){
                if(err.message.match("size")){
                    DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.uploadSizeError+DE.config.uploadSize.maxImageSize);
                }else if(err.message.match("extension")){
                    DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.uploadExtensionError+DE.config.uploadFilters.imageFilter);
                }else{
                    DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.uploadIOErrror);
                }
            }
            up.refresh();
        });

        //上传完毕事件
        uploaderThumb.bind("FileUploaded", function (up, file, res) {
            var response = JSON.parse(res.response);
            if(response.success){
                //var img_src=response.url;
                //var img_ext=img_src.substring(img_src.lastIndexOf("."),img_src.length);
                //var img_src_compress=img_src.substring(0,img_src.lastIndexOf("."))+parent.DE.config.imgSize.middle+img_ext;
                $("#de_project_thumb").attr("src",response.url);
                $("#de_thumb_name").val(response.clientFilename);
                $("#de_thumb_url").val(response.url);
            }else{
                if(response.errorCode=="thumb_height_not_equals_width"){
                    DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.imgSizeError);
                }else{
                    DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.uploadIOErrror);
                }
            }
        });
    }

    /**
     * 上传媒体文件句柄
     * @param {String} browseButton 需要设置上传按钮的id
     * @param {String} type 上传的文件类型
     * @param {String} filters 文件筛选器
     */
    function createMediaUpload(browseButton,type,filters){
        var uploaderMedia=new plupload.Uploader({
            runtimes:"html5",
            multi_selection:true,
            max_file_size:DE.config.uploadSize.maxMediaSize,
            browse_button:browseButton,
            container:"zy_add_media_menu",
            url:DE.config.ajaxUrls.uploadFileUrl,
            unique_names:true,
            //urlstream_upload:true,
            //flash_swf_url : (document.baseURI||$("#de_base_url").attr("href"))+'js/lib/plupload.flash.swf',
            //chunk_size:"10mb",
            /*multipart_params:{
                userId:DE.store.currentUser.userId
            },*/
            filters : [
                {title : "Media files", extensions : filters}
            ]
        });

        //初始化
        uploaderMedia.init();

        //根据type生成zy_media_id,和iframe的页面
        var zy_media_ids = {}; //一个file.id和媒体media_id的关联hash，因为要传多个文件，需要记录下每个media_id
        var zy_iframe_page_names = {};

        //文件添加事件
        uploaderMedia.bind("FilesAdded", function (up, files) {
            var zy_media_id = "";
            var zy_iframe_page_name = "";
            var fileLength=files.length;

            for (var i = 0; i < fileLength; i++) {


                //给zy_media_id和iframe页面名称赋值
                if (type == DE.config.uploadMediaTypes.localVideo) {
                    zy_media_id = getRandom("zy_location_");
                    zy_iframe_page_name = "zy_set_location_video.html";
                    zy_media_ids[files[i]["id"]] = zy_media_id;
                    zy_iframe_page_names[files[i]["id"]] = zy_iframe_page_name;
                } else if (type == DE.config.uploadMediaTypes._3d) {
                    zy_media_id = getRandom("zy_3d_");
                    zy_iframe_page_name = "zy_set_3d.html";
                    zy_media_ids[files[i]["id"]] = zy_media_id;
                    zy_iframe_page_names[files[i]["id"]] = zy_iframe_page_name;
                } else if (type == DE.config.uploadMediaTypes.ppt) {
                    zy_media_id = getRandom("zy_ppt_");
                    zy_iframe_page_name = "zy_set_ppt.html";
                    zy_media_ids[files[i]["id"]] = zy_media_id;
                    zy_iframe_page_names[files[i]["id"]] = zy_iframe_page_name;
                } else if (type == DE.config.uploadMediaTypes.image) {
                    zy_media_id = getRandom("zy_image_");
                    zy_iframe_page_name = "zy_set_image.html";
                    zy_media_ids[files[i]["id"]] = zy_media_id;
                    zy_iframe_page_names[files[i]["id"]] = zy_iframe_page_name;
                } else if (type == DE.config.uploadMediaTypes.file) {
                    zy_media_id = getRandom("zy_file_");
                    zy_iframe_page_name = "zy_set_file.html";
                    zy_media_ids[files[i]["id"]] = zy_media_id;
                    zy_iframe_page_names[files[i]["id"]] = zy_iframe_page_name;
                } else if (type == DE.config.uploadMediaTypes.flash) {
                    zy_media_id = getRandom("zy_flash_");
                    zy_iframe_page_name = "zy_set_flash.html";
                    zy_media_ids[files[i]["id"]] = zy_media_id;
                    zy_iframe_page_names[files[i]["id"]] = zy_iframe_page_name;
                }


                //组装显示的数据
                var data = {
                    media_id:zy_media_id,
                    thumb_src:'images/zy_small_thumb.png',
                    filename:files[i]["name"]
                };

                //显示列表项
                var tpl = jQuery("#zy_uncomplete_tpl").html();
                var html = juicer(tpl, data);
                jQuery("#zy_uploaded_medias_ol").append(html);

                //隐藏菜单栏
                jQuery("#zy_add_media_menu").css("height", 0);
            }

            //开始上传
            up.start();

        });

        //文件上传进度条事件
        uploaderMedia.bind("UploadProgress", function (up, file) {
            jQuery(".zy_uncomplete_li[data-zy-media-id='" + zy_media_ids[file.id] + "']").find(".zy_media_percent").html(file.percent + "%");

        });

        //出错事件
        uploaderMedia.bind("Error", function (up, err) {

            //由于这里4个上传按钮放到一个面板中，会出现init错误，但是不影响使用，
            if(err.message.match("Init")==null){
                if(err.message.match("size")){
                    DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.uploadSizeError+DE.config.uploadSize.maxMediaSize);
                }else if(err.message.match("extension")){
                    DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.uploadExtensionError+filters);
                }else{
                    DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.uploadIOErrror);
                }
            }
            up.refresh();
        });

        //上传完毕事件
        uploaderMedia.bind("FileUploaded", function (up, file, res) {
            var response = JSON.parse(res.response);
            if (response.success) {

                //存在对应的未完成li，说明在上传的过程中没有被删除，应该做处理
                var uncomplete_li=jQuery(".zy_uncomplete_li[data-zy-media-id='" + zy_media_ids[file.id] + "']");

                if(uncomplete_li.length){

                    //移除上传时候的li
                    uncomplete_li.remove();


                    //下面一节使用封装了的函数
                    var iframe_src="uploadPlugin/html/"+zy_iframe_page_names[file.id] + '?' + zy_media_ids[file.id];

                    setUploadedMediasObj(type,file.name,response.url,zy_media_ids[file.id]);

                    setIframeAndShowLi({
                        type:type,
                        url:response.url,
                        iframeSrc:iframe_src,
                        mediaId:zy_media_ids[file.id],
                        filename:response.clientFilename
                    });

                    //执行一次拖拽,因为元素是动态添加的，应该在添加后添加拖拽事件
                    DE.upload.drag();
                }
            } else {
                DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.uploadIOErrror);
            }
        });
    }

    /**
     * 修改的时候初始化文章（资源）的详细信息
     * @param {Number} id 需要修改作品（资源）的id
     */
    function initEntityDetail(id){
        $.ajax({
            url:DE.config.ajaxUrls.getEntityDetail,
            type:"get",
            async:false,
            dataType:"json",
            data:{
               postId:id
            },
            success:function(data){
                if(data.success){
                    showEntityDetail(data.entity);
                }else{
                    DE.config.ajaxReturnErrorHandler(data);
                }
            },
            error:function(){
                DE.config.ajaxErrorHandler();
            }

        });
    }

    /**
     * 修改的时候显示作品（资源）的详细信息
     * @param {Object} entity 作品（资源）对象
     */
    function showEntityDetail(entity){
        var i= 0,length;

        //设置标题
        $("#de_input_project_title").val(entity.postTitle);

        $("#de_entity_id").val(entity.postId);

        //设置标签
        var tagTpl=$("#uploadInputTagMore").html();
        var html=juicer(tagTpl,{tags:entity.postTags});
        $("#de_input_tag").html(html);
        length=entity.postTags.length;

        //记录下已经输入的tag
        for(i;i<length;i++){
            addedTags[entity.postTags[i]]=true;
        }

        //设置描述
        $("#de_project_description").val(entity.postDescribe);

        //设置缩略图
        $("#de_project_thumb").attr("src",entity.postThumb);
        $("#de_thumb_name").val(entity.postThumbFilename);
        $("#de_thumb_url").val(entity.postThumb);

        //显示界面
        DE.UIManager.showScreen("#de_screen_upload");

    }

    /**
     * 修改的时候初始化已经上传的媒体文件
     * @param {Number} id 需要修改作品（资源）的id
     */
    function initEntityMedias(id){
        $.ajax({
            url:DE.config.ajaxUrls.getEntityAttachments,
            type:"get",
            dataType:"json",
            data:{
                postId:id
            },
            success:function(data){
                if(data.success){
                    attachmentsToObject(data.attachments);
                    showEntityMedias(data.attachments);
                }else{
                    DE.config.ajaxReturnErrorHandler(data);
                }
            },
            error:function(data){
                DE.config.ajaxErrorHandler();
            }

        });
    }

    /**
     * 将后台返回的附件数据，转化成前台需要的数据形式，保存到DE.store.uploadedMedias
     * @param {Object} attachments 已经上传了的媒体文件数据
     */
    function attachmentsToObject(attachments){
        var length=attachments.length;
        var i=0;
        for(;i<length;i++){
            DE.store.uploadedMedias[attachments[i]["attachmentId"]]={
                "zy_media_memo":attachments[i]["attachmentDescribe"],
                "zy_media_title":attachments[i]["attachmentTitle"],
                "zy_media_thumb_filename":attachments[i]["attachmentPreviewFilename"],
                "zy_media_thumb_filepath":attachments[i]["attachmentPreviewLocation"],
                "zy_media_filename":attachments[i]["attachmentMediaFilename"],
                "zy_media_filepath":attachments[i]["attachmentMediaLocation"],
                "zy_media_type":attachments[i]["attachmentType"]
            }
        }
    }

    /**
     * 修改的时候显示已经上传的媒体文件
     * @param {Object} attachments 已经上传了的媒体文件数据(hash表)
     */
    function showEntityMedias(attachments){
        var tpl=$("#zy_complete_tpl").html();
        var html="";
        var iframeSrc="";
        var mediaType="";
        var length=attachments.length;
        var i=0;
        for(;i<length;i++){

            mediaType=attachments[i]["attachmentType"];
            if(mediaType==DE.config.uploadMediaTypes.localVideo) {
                iframeSrc="uploadPlugin/html/zy_set_location_video.html?"+attachments[i]["attachmentId"];
            }else if(mediaType==DE.config.uploadMediaTypes._3d){
                iframeSrc="uploadPlugin/html/zy_set_3d.html?"+attachments[i]["attachmentId"];
            }else if(mediaType==DE.config.uploadMediaTypes.ppt){
                iframeSrc="uploadPlugin/html/zy_set_ppt.html?"+attachments[i]["attachmentId"];
            }else if(mediaType==DE.config.uploadMediaTypes.webVideo){
                iframeSrc="uploadPlugin/html/zy_set_network_video.html?"+attachments[i]["attachmentId"];
            }else if(mediaType==DE.config.uploadMediaTypes.image){
                iframeSrc="uploadPlugin/html/zy_set_image.html?"+attachments[i]["attachmentId"];
            }else if(mediaType==DE.config.uploadMediaTypes.file){
                iframeSrc="uploadPlugin/html/zy_set_file.html?"+attachments[i]["attachmentId"];
            }else if(mediaType==DE.config.uploadMediaTypes.flash){
                iframeSrc="uploadPlugin/html/zy_set_flash.html?"+attachments[i]["attachmentId"];
            }

            html+=juicer(tpl,{
                classString:"",
                media_type:mediaType,
                media_id:attachments[i]["attachmentId"],
                iframe_src:iframeSrc,
                thumb_src:attachments[i]["attachmentPreviewLocation"],
                filename:attachments[i]["attachmentMediaFilename"]
            });
        }
        $("#zy_uploaded_medias_ol").html(html);
    }

    /**
     * 提交前预览
     */
    function preview(){
        var data={};
        data.title=$("#de_input_project_title").val();
        data.date=toDay();
        data.userId=DE.store.currentUser.userId;
        data.userFigure=DE.store.currentUser.figure;
        data.username=DE.store.currentUser.name;
        data.description=$("#de_project_description").text();
        data.medias=getSlidePages();
        var tpl=$("#uploadPreview").html();
        var html=juicer(tpl,data);
        $("#de_upload_preview").html(html);
    }

    return {

        /**
         * 修改作品（资源）函数
         * @param {Number} id 需要修改的作品（资源）id
         */
        editEntity:function(id){
            DE.store.currentEditEntityId=id;
            initEntityDetail(id);
            initEntityMedias(id);
        },

        /**
         * 清空编辑时留下的数据，新建、修改作品（资源）提交时使用
         */
        clearEditData:function(){
            $("#de_input_project_title").val("");
            $("#de_input_tag").html("");
            $("#de_project_description").val("");
            $("#de_input_project_tag").val("");
            $("#zy_media_iframe").remove();

            $("#de_project_thumb").attr("src",DE.config.defualtEntityThumb);
            $("#zy_uploaded_medias_ol").html("");
            $("#de_thumb_name").val("");
            $("#de_thumb_url").val("");
            $("#de_entity_id").val("");
            addedTags={};
            DE.UIManager.gotoUploadStep("#de_upload_step1");
        },

        /**
         * 公开的创建上传句柄函数
         * @param {Object} obj参数数组
         * type（需要创建上传句柄的类型），browreButton（需要设置上传按钮的id），filters（文件刷选器）
         */
        createUpload:function(obj){
            if(obj.type=="thumb"){
                createThumbUpload();
            }else{
                createMediaUpload(obj.browseButton,obj.type,obj.filters)
            }
        },

        /**
         * 拖拽函数
         */
        drag:function(){
            var targetOl = jQuery("#zy_uploaded_medias_ol")[0];//容器元素
            var eleDrag = null;//被拖动的元素

            jQuery("#zy_uploaded_medias_ol a").each(function (index, l) {

                var target = jQuery(this)[0];

                //开始选择
                target.onselectstart = function () {

                    //阻止默认的事件
                    return false;
                };

                //拖拽开始
                target.ondragstart = function (ev) {
                    //拖拽效果
                    ev.dataTransfer.effectAllowed = "move";
                    eleDrag = ev.target;
                    return true;
                };

                //拖拽结束
                target.ondragend = function (ev) {
                    eleDrag = null;
                    return false;
                };
            });

            //在元素中滑过
            //ol作为最大的容器也要处理拖拽事件，当其中有li的时候放到li的前面，但没有的时候放到ol的最后面
            targetOl.ondragover = function (ev) {
                ev.preventDefault();//阻止浏览器的默认事件
                return false;
            };

            //进入元素
            targetOl.ondragenter = function (ev) {

                if (ev.toElement == targetOl) {
                    targetOl.appendChild(jQuery(eleDrag).parents("li")[0]);
                } else {
                    targetOl.insertBefore(jQuery(eleDrag).parents("li")[0], jQuery(ev.toElement).parents("li")[0]);
                }
                return false;
            };
        },

        /**
         *网络视频输入控制
         * @param {String} value 输入的网络视频地址
         */
        webVideoInput:function(value){
            if(value.trim().match(/^<iframe/)!=null){

                //防止后台json_decode出错，将双引号改成单引号
                var filename=value.replace(/["]/g,"'");

                //生成zy_media_id
                var zy_media_id=getRandom("zy_network_");

                //设置DE.store.uploadedMedias对象
                setUploadedMediasObj("zy_network_video",filename,filename,zy_media_id);


                //设置列表中的值
                setIframeAndShowLi({
                    type:DE.config.uploadMediaTypes.webVideo,
                    url:filename,
                    iframeSrc:"uploadPlugin/html/zy_set_network_video.html?"+zy_media_id,
                    mediaId:zy_media_id,
                    filename:filename
                });

                //重新绑定拖拽事件
                this.drag();

                $("#de_pop_window").addClass("de_hidden");
                $("#de_blackout").addClass("de_hidden");
            }else{
                //$("#de_pop_window_content").append($("<label class='error'>请输入通用代码</label>"));
            }
        },

        /**
         * 删除已经上传的文件
         * @param {Object} target 需要删除的文件的项目中删除按钮span.zy_media_delete
         */
        deleteUploadedFile:function(target){
            if(confirm("确定删除吗？")){
                var media_id=target.parent().data("zy-media-id");
                DE.store.uploadedMedias[media_id]=undefined;
                delete DE.store.uploadedMedias[media_id];
                target.parents("li").remove();

                //让第一个选中
                if($("#zy_uploaded_medias_ol li").not(".zy_uncomplete_li").length!=0){
                    $("#zy_uploaded_medias_ol li").removeClass("zy_media_list_active");
                    $("#zy_uploaded_medias_ol li:eq(0)").addClass("zy_media_list_active");
                    showIframe($("#zy_uploaded_medias_ol li:eq(0)").find("a").attr("href"));
                    $("#zy_uploaded_medias_ol").scrollTop(0);
                }else{
                    $("#zy_media_iframe").remove();
                }
            }
        },

        /**
         * 已经上传的文件列表项点击事件处理
         * @param {Object} target 点击的项目中的a.zy_media_list
         */
        uploadedLiClickHandler:function(target){
            var active=$(".zy_media_list_active");
            if(active.length!=0){

                //如果可以显示其他列表项，要删除active类
                active.removeClass("zy_media_list_active");
            }

            //设置媒体类型
            var type=target.data("zy-media-type");

            if(type==DE.config.uploadMediaTypes.localVideo){
                $("#zy_media_type").text("本地视频");
            }else if(type==DE.config.uploadMediaTypes._3d){
                $("#zy_media_type").text("3d文件");
            }else if(type==DE.config.uploadMediaTypes.ppt){
                $("#zy_media_type").text("ppt文件");
            }else if(type==DE.config.uploadMediaTypes.image){
                $("#zy_media_type").text("图片");
            }else if(type==DE.config.uploadMediaTypes.webVideo){
                $("#zy_media_type").text("网络视频");
            }else if(type==DE.config.uploadMediaTypes.file){
                $("#zy_media_type").text("文件");
            }else if(type==DE.config.uploadMediaTypes.flash){
                $("#zy_media_type").text("flash");
            }

            //控制类
            target.parent("li").addClass("zy_media_list_active");

            var src=target.attr("href");
            showIframe(src);
        },

        /**
         * 设置已经上传的列表第一项为选中状态
         */
        setFirstActive:function(){
            if($(".zy_media_list_active").length==0){
                var firstLi=$("#zy_uploaded_medias_ol li:eq(0)");
                if(firstLi.length!=0){
                    firstLi.addClass("zy_media_list_active");
                    showIframe(firstLi.find("a").attr("href"));
                }
            }
        },

        /**
         * 将输入的标签添加到已添加列表
         * @param {String} value 输入的标签
         */
        showInputTag:function(value){

            //如果没有添加
            if(value.trim()&&!addedTags[value]){
                addedTags[value]=true;
                var tpl=$("#uploadInputTag").html();
                var html=juicer(tpl,{text:value});
                $("#de_input_tag").append($(html));

                $("#de_input_project_tag").val("");
            }
        },

        /**
         * 上传的步骤控制
         * @param {String} href 每个步骤需要显示的面板id,即步骤a标签的href属性的值
         * @returns {boolean} 如果不可点的时候，需要返回false
         */
        stepControl:function(href){
            if(href=="#de_upload_step2"){
                if($("#de_input_project_title").val()==""||$("#de_input_tag li").length==0||$("#de_thumb_name").val()==""){
                    DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.stepOneUnComplete);
                    return false;
                }

                this.setFirstActive();
            }else if(href=="#de_upload_step3"){

                //判断第二中的内容是否都已经填写完整。

                if($(".zy_media_list").length!=0&&$(".zy_uncomplete_li").length==0){

                    for(var obj in DE.store.uploadedMedias){

                        //如果有媒体文件没有传缩略图，则不能到第三步
                        if(!DE.store.uploadedMedias[obj]["zy_media_thumb_filename"]){
                            DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.mediaHasNoThumb);
                            return false;
                        }
                    }
                }else{
                    DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.hasNoMedia);
                    return false;
                }

                //显示
                preview();
            }

            DE.UIManager.gotoUploadStep(href);
        },

        /**
         *表单提交
         */
        ajaxUploadForm:function(){
            var url=DE.config.ajaxUrls.uploadAction;
            var order={};
            $(".zy_media_list").each(function(index,m){
                order[$(this).data("zy-media-id")]=index+1;
            });

            if(DE.store.currentEditEntityId){
                url=DE.config.ajaxUrls.editUploadAction;
            }
            $("#de_upload_form").ajaxSubmit({
                url:url,
                type:"post",
                data:{
                    attachmentJson:jsonToStr(DE.store.uploadedMedias),
                    orderJson:jsonToStr(order)
                },
                dataType:"json",
                success:function (data) {
                    if(data.success&&data.resultCode==DE.config.resultCode.post_create_succ){
                        DE.UIManager.hideLoading();
                        DE.UIManager.showMsgPopout(DE.config.messageCode.successTitle,DE.config.messageCode.operationSuccess);

                        //将postId保存起来，在跳转页面的时候DE.store.currentEditEntityId会被清除
                        var postId=DE.store.currentEditEntityId||data.postId;

                        //跳到用户首页
                        DE.user.userClickHandler("user/"+DE.store.currentUser.userId,function(){
                            var href="item/"+postId;
                            DE.entity.entityClickHandler("item/"+postId,false);
                            DE.history.push(href,true);
                        });


                    }else{
                        DE.config.ajaxReturnErrorHandler(data);
                    }
                },
                error:function (data) {
                    DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.networkError);
                }
            });
        },

        /**
         * 删除标签
         * @param {Object} target 点击的a
         */
        deleteTag:function(target){
            target.parent().remove();

            var value=target.text();

            addedTags[value]=undefined;
            delete addedTags[value];
        },

        /**
         * 标签输入栏的事件
         */
        tagInputEventHandler:function(){
            var me=this;
            var tagInput=$("#de_input_project_tag");

            tagInput.keydown(function(event){
                if(event.keyCode==13){
                    me.showInputTag($(this).val());
                }
            });

            tagInput.marcoPolo({
                url: DE.config.ajaxUrls.termSuggest,
                minChars:2,
                formatData : function (data) {
                    if(!$.isEmptyObject(data)&&data.spellcheck.suggestions.length){
                        return data.spellcheck.suggestions[1]["suggestion"];
                    }else{
                        return [];
                    }
                },
                formatItem: function (data) {
                    return data;
                },
                onSelect: function (data) {
                    me.showInputTag(data);
                },
                formatNoResults:function(q, $item){
                    return "";
                },
                formatMinChars :function(minChars, $item){
                    return "";
                },
                formatError :function($item, jqXHR, textStatus, errorThrown){
                    return "";
                }
            });

            //模拟失去焦点，直接用blur的话与自动完成中的事件冲突
            $("#de_screen_upload").click(function(event){
                var target=$(event.target);
                if(!target.is("#de_input_project_tag")&&target.parents("#mp_de_input_project_tag_list").length==0){
                    me.showInputTag(tagInput.val());
                }
            });
        }
    }
})();

$(document).ready(function(){

    //创建上传句柄
    DE.upload.createUpload({type:"thumb"});
    DE.upload.createUpload({type:DE.config.uploadMediaTypes.localVideo,browseButton:"zy_add_location_video",filters:DE.config.uploadFilters.videoFilter});
    DE.upload.createUpload({type:DE.config.uploadMediaTypes._3d,browseButton:"zy_add_3d",filters:DE.config.uploadFilters._3dFilter});
    DE.upload.createUpload({type:DE.config.uploadMediaTypes.ppt,browseButton:"zy_add_ppt",filters:DE.config.uploadFilters.pptFilter});
    DE.upload.createUpload({type:DE.config.uploadMediaTypes.image,browseButton:"zy_add_image",filters:DE.config.uploadFilters.imageFilter});
    DE.upload.createUpload({type:DE.config.uploadMediaTypes.file,browseButton:"zy_add_file",filters:DE.config.uploadFilters.fileFilter});
    DE.upload.createUpload({type:DE.config.uploadMediaTypes.flash,browseButton:"zy_add_flash",filters:DE.config.uploadFilters.flashFilter});

    //步骤控制
    $("#de_upload_step_nav a").click(function(){
        DE.upload.stepControl($(this).attr("href"));

        return false;
    });

    //标签删除事件
    $(document).on("click","#de_input_tag a",function(){
        DE.upload.deleteTag($(this));

        return false;
    });

    //标签输入事件
    DE.upload.tagInputEventHandler();

    //显示上传文件的菜单
    $("#zy_add_medias_button").hover(function(e){
        $("#zy_add_media_menu").css("height","280px");
    },function(e){
        $("#zy_add_media_menu").css("height",0);
    });
    $("#zy_add_media_menu").hover(function(e){
        $("#zy_add_media_menu").css("height","280px");
    },function(e){
        $("#zy_add_media_menu").css("height",0);
    });

    //控制网络视频,显示输入面板
    $("#zy_add_network_video").click(function(){
        var tpl=$("#webVideoInput").html();
        $("#de_pop_window").removeClass("de_hidden de_pop_show_media").addClass("de_pop_web_video_input");
        $("#de_pop_window_content").html(tpl);
        $("#de_blackout").removeClass("de_hidden");

        return false;
    });

    //网络视频输入确定
    $(document).on("click","#de_input_web_video_ok",function(){
        var value=$("#de_input_web_video").val();
        DE.upload.webVideoInput(value);
    });

    //删除未上传的文件
    $(document).on("click","span.zy_uncomplete_delete",function(){
        if(confirm("确定删除吗？")){
            $(this).parents("li").remove();
        }
    });

    //删除已经上传的文件
    $(document).on("click","span.zy_media_delete",function(event){
        DE.upload.deleteUploadedFile($(this));

        //阻止事件冒泡到a
        return false;
    });

    //列表中每一项的点击事件，如果选中的列表没有填写完整，则不能选择其他列表
    $(document).on("click","a.zy_media_list",function(){
        DE.upload.uploadedLiClickHandler($(this));

        return false;
    });

    //表单提交
    $("#de_submit_upload").click(function(){

        //防止重复提交
        DE.UIManager.showLoading();
        DE.upload.ajaxUploadForm();

        return false;
    });

    //火狐里面阻止form提交
    $("input[type='text'],input[type='password']").keydown(function(e){
        if(e.keyCode==13){
            return false;
        }
    })
});