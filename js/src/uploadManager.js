/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-4
 * Time: 下午6:01
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.upload=(function(){
    function jsonToStr(o) {

        var me = this;
        var arr = [];
        var fmt = function (s) {
            if (typeof s == 'object' && s != null) return jsonToStr(s);
            return /^(string|number)$/.test(typeof s) ? '"' + s + '"' : s;
        };
        for (var i in o) arr.push('"' + i + '":' + fmt(o[i]));
        return '{' + arr.join(',') + '}';
    }

    function getRandom(){
        var date = new Date();
        var retValue = "";
        var mo = (date.getMonth() + 1) < 10 ? ('0' + '' + (date.getMonth() + 1)) : date.getMonth() + 1;
        var dd = date.getDate() < 10 ? ('0' + '' + date.getDate()) : date.getDate();
        var hh = date.getHours() < 10 ? ('0' + '' + date.getHours()) : date.getHours();
        var mi = date.getMinutes() < 10 ? ('0' + '' + date.getMinutes()) : date.getMinutes();
        var ss = date.getSeconds() < 10 ? ('0' + '' + date.getSeconds()) : date.getSeconds();
        retValue = date.getFullYear() + '' + mo + '' + dd + '' + hh + '' + mi + '' + ss + '';
        for (var j = 0; j < 4; j++) {
            retValue += '' + parseInt(10 * Math.random()) + '';
        }
        if (arguments.length == 1) {
            return arguments[0] + '' + retValue;
        }
        else
            return retValue;
    }

    function  getSlidePages(){
        var array_slides=[];
        $(".zy_media_list").each(function(index,m){
            var obj={};//幻灯片每一页的对象
            var media_id=$(this).data("zy-media-id");
            var title=DE.store.uploadedMedias[media_id]["zy_media_title"];
            var type=DE.store.uploadedMedias[media_id]["zy_media_type"];
            var memo=DE.store.uploadedMedias[media_id]["zy_media_memo"];
            var img_src=DE.store.uploadedMedias[media_id]["zy_media_thumb_filepath"];
            var img_ext=img_src.substring(img_src.lastIndexOf("."),img_src.length);
            var img_src_compress=img_src.substring(0,img_src.lastIndexOf("."))+zy_config.zy_compress_suffix+img_ext;

            obj.title=title;
            obj.memo=memo;

            if(type=="zy_image"){
                obj.content='<a href="'+img_src+'"><img src="'+img_src_compress+'" data-zy-media-id="'+media_id+'" /></a>';
            }else if(type=="zy_ppt"){
                obj.content='<a class="zy_preview_pptslide" href="'+img_src+'"><img src="'+img_src_compress+'" data-zy-media-id="'+media_id+'" /></a>';
            }else if(type=="zy_3d"){
                obj.content='<a class="zy_preview_3dslide" href="'+img_src+'"><img src="'+img_src_compress+'" data-zy-media-id="'+media_id+'" /></a>';
            }else if(type=="zy_location_video"){
                obj.content='<a class="zy_preview_videoslide" href="'+img_src+'"><img src="'+img_src_compress+'" data-zy-media-id="'+media_id+'" /></a>';
            }else if(type=="zy_network_video"){
                obj.content='<a class="zy_preview_webslide" href="'+img_src+'"><img src="'+img_src_compress+'" data-zy-media-id="'+media_id+'" /></a>';
            }

            array_slides.push(obj);
        });

        //将所有的幻灯片页返回
        return array_slides;
    }

    function getSlideContent(){
        var contents="";
        $(".zy_media_list").each(function(index,l){
            var media_id=$(this).data("zy-media-id");
            var media_type=$(this).data("zy-media-type");
            var img_src_compress=$(this).find("img").attr("src");
            var img_src=img_src_compress.replace(zy_config.zy_compress_suffix,"");

            if(media_type!="zy_image"){
                if(media_type=="zy_ppt"){
                    contents+='<a class="pptslide" href="'+img_src+'"><img src="'+img_src_compress+'" data-zy-media-id="'+media_id+'" /></a>';
                }else if(media_type=="zy_3d"){
                    contents+='<a class="_3dslide" href="'+img_src+'"><img src="'+img_src_compress+'" data-zy-media-id="'+media_id+'" /></a>';
                }else if(media_type=="zy_location_video"){
                    contents+='<a class="videoslide" href="'+img_src+'"><img src="'+img_src_compress+'" data-zy-media-id="'+media_id+'" /></a>';
                }else if(media_type=="zy_network_video"){
                    contents+='<a class="webslide" href="'+img_src+'"><img src="'+img_src_compress+'" data-zy-media-id="'+media_id+'" /></a>';
                }
            }else{

                //如果是纯粹的图片，不需要保存media_id
                contents+='<a href="'+img_src+'"><img data-zy-media-id="'+media_id+'" src="'+img_src_compress+'" /></a>';
            }
        });


        return contents;
    }

    function createThumbUpload(){
        var uploaderThumb = new plupload.Uploader({
            runtimes:"flash",
            multi_selection:false,
            max_file_size:DE.config.maxImageSize,
            browse_button:"de_upload_thumb_btn",
            container:"de_upload_thumb_container",
            flash_swf_url:DE.config.root+'/js/lib/plupload.flash.swf',
            url:DE.config.ajaxUrls.uploadFileUrl,
            chunk_size:"1m",
            filters:[
                {title:"Image files", extensions:"jpg,gif,png,jpeg"}
            ]
        });

        //初始化
        uploaderThumb.init();

        //文件添加事件
        uploaderThumb.bind("FilesAdded", function (up, files) {
            var filename = files[0].name;
            var lastIndex = filename.lastIndexOf(".");
            filename = filename.substring(0, lastIndex);

            //只含有汉字、数字、字母、下划线不能以下划线开头和结尾
            var reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;

            if (!reg.test(filename)) {
                alert("文件名必须是数字下划线汉字字母,且不能以下划线开头。");

                //删除文件
                up.removeFile(files[0]);
                return false;
            } else {
                up.start();//开始上传
            }
        });

        //出错事件
        uploaderThumb.bind("Error", function (up, err) {
            if(err.message.match("Init")==null){
                alert(err.message);
            }
            up.refresh();
        });

        //上传完毕事件
        uploaderThumb.bind("FileUploaded", function (up, file, res) {
            console.log(res);
        });
    }

    function createMediaUpload(browseButton,container,type,fileters){
        var uploaderMedia=new plupload.Uploader({
            runtimes:"flash",
            multi_selection:false,
            max_file_size:DE.config.maxMediaSize,
            browse_button:browseButton,
            container:container,
            flash_swf_url: '../js/lib/plupload.flash.swf',
            url:DE.config.ajaxUrls.uploadFileUrl,
            chunk_size:"2m",
            filters : [
                {title : "Media files", extensions : filters}
            ],
            multipart_params: {
                path:"#"
            }
        });

        //初始化
        uploaderMedia.init();

        //根据type生成zy_media_id,和iframe的页面
        var zy_media_ids = {};//一个文件名和媒体id的关联hash，因为要传多个文件，需要记录下每个media_id
        var zy_iframe_page_names = {};

        //文件添加事件
        uploaderMedia.bind("FilesAdded", function (up, files) {
            var de_media_id = "";
            var de_iframe_page_name = "";

            for (var i = 0; i < files.length; i++) {
                var filename = files[i].name;
                var lastIndex = filename.lastIndexOf(".");
                var filename_noext = filename.substring(0, lastIndex);

                //只含有汉字、数字、字母、下划线不能以下划线开头和结尾
                var reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
                if (!reg.test(filename_noext)) {
                    alert("文件" + filename + "命名有误（只能数字字母下划线，且不能以下划线开头）,将从上传列表中删除。");

                    up.removeFile(files[i]);
                    files.splice(i, 1);
                    i--;
                } else {

                    //给zy_media_id和iframe页面名称赋值
                    if (type == "zy_location_video") {
                        zy_media_id = getRandom("zy_location_");
                        zy_iframe_page_name = "zy_set_location_video.html";
                        zy_media_ids[filename] = zy_media_id;
                        zy_iframe_page_names[filename] = zy_iframe_page_name;
                    } else if (type == "zy_3d") {
                        zy_media_id = getRandom("zy_3d_");
                        zy_iframe_page_name = "zy_set_3d.html";
                        zy_media_ids[filename] = zy_media_id;
                        zy_iframe_page_names[filename] = zy_iframe_page_name;
                    } else if (type == "zy_ppt") {
                        zy_media_id = getRandom("zy_ppt_");
                        zy_iframe_page_name = "zy_set_ppt.html";
                        zy_media_ids[filename] = zy_media_id;
                        zy_iframe_page_names[filename] = zy_iframe_page_name;
                    } else if (type == "zy_image") {
                        zy_media_id = getRandom("zy_image_");
                        zy_iframe_page_name = "zy_set_image.html";
                        zy_media_ids[filename] = zy_media_id;
                        zy_iframe_page_names[filename] = zy_iframe_page_name;
                    }

                    //组装显示的数据
                    var data = {
                        media_id:zy_media_id,
                        thumb_src:zy_config.zy_template_url + '/images/zy_small_thumb.png',
                        filename:filename
                    };

                    //显示列表项
                    var tpl = jQuery("#zy_uncomplete_tpl").html();
                    var html = juicer(tpl, data);
                    jQuery("#zy_uploaded_medias_ol").append(html);

                    //隐藏菜单栏
                    jQuery("#zy_add_media_menu").css("height", 0);
                }
            }

            //开始上传
            up.start();

        });

        //文件上传进度条事件
        uploaderMedia.bind("UploadProgress", function (up, file) {
            jQuery(".zy_uncomplete_li[data-zy-media-id='" + zy_media_ids[file.name] + "']").find(".zy_media_percent").html(file.percent + "%");

        });

        //出错事件
        uploaderMedia.bind("Error", function (up, err) {
            //由于这里4个上传按钮放到一个面板中，会出现init错误，但是不影响使用，
            if (err.message.match("Init") == null) {
                alert(err.message);
            }
            up.refresh();
        });

        //上传完毕事件
        uploaderMedia.bind("FileUploaded", function (up, file, res) {
            var response = JSON.parse(res.response);
            if (response.success) {

                //移除上传时候的li
                jQuery(".zy_uncomplete_li[data-zy-media-id='" + zy_media_ids[file.name] + "']").remove();


                var classString = "class='zy_media_list_error'";
                var thumb_src = zy_config.zy_template_url + "/images/zy_small_thumb.png";


                if (type == "zy_image") {

                    //显示压缩后的图片
                    var img_src = response.data.url;
                    var img_ext = img_src.substring(img_src.lastIndexOf("."), img_src.length);
                    var img_src_compress = img_src.substring(0, img_src.lastIndexOf(".")) + zy_config.zy_compress_suffix + img_ext;
                    thumb_src = img_src_compress;
                    classString = "";
                }

                if (jQuery("#zy_uploaded_medias_ol .zy_media_list_active").length == 0) {
                    classString = classString == "" ? "class='zy_media_list_active'" : "class='zy_media_list_active zy_media_list_error'";
                    jQuery("#zy_media_iframe").attr("src", zy_config.zy_template_url + '/zy_pages/' + zy_iframe_page_names[file.name] +
                        '?' + zy_media_ids[file.name]);

                }


                //组装显示的数据
                var data = {
                    classString:classString,
                    media_type:type,
                    media_id:zy_media_ids[file.name],
                    iframe_src:zy_config.zy_template_url + '/zy_pages/' + zy_iframe_page_names[file.name] + '?' + zy_media_ids[file.name],
                    thumb_src:thumb_src,
                    filename:file.name
                };

                //显示列表项
                var tpl = jQuery("#zy_complete_tpl").html();
                var html = juicer(tpl, data);
                jQuery("#zy_uploaded_medias_ol").append(html);

                //设置de_uploaded_medias
                DE.store.uploadedMedias[zy_media_ids[file.name]] = {

                    //声明一个空的对象，后续将内容全部加入
                };

                if (type == "zy_image") {

                    //如果是图片媒体，需要同时设置四个信息
                    DE.store.uploadedMedias[zy_media_ids[file.name]]["zy_media_thumb_filename"] = response.data.filename;
                    DE.store.uploadedMedias[zy_media_ids[file.name]]["zy_media_thumb_filepath"] = response.data.url;
                    DE.store.uploadedMedias[zy_media_ids[file.name]]["zy_media_filename"] = response.data.filename;
                    DE.store.uploadedMedias[zy_media_ids[file.name]]["zy_media_filepath"] = response.data.url;
                } else {
                    DE.store.uploadedMedias[zy_media_ids[file.name]]["zy_media_filename"] = response.data.filename;
                    DE.store.uploadedMedias[zy_media_ids[file.name]]["zy_media_filepath"] = response.data.url;
                }
                DE.store.uploadedMedias[zy_media_ids[file.name]]["zy_media_type"] = type;

                //执行一次拖拽,因为元素是动态添加的，应该在添加后添加拖拽事件
                DE.upload.drag();
            } else {
                alert(response.data.message);
            }
        });
    }

    function initEntityDetail(id){
        $.ajax({
            url:DE.config.ajaxUrls.getEntityDetail,
            type:"get",
            async:false,
            dataType:"json",
            success:function(data){

               showEntityDetail(data.entity);

            },
            error:function(){

            }

        });
    }
    function showEntityDetail(entity){

        //设置标题
        $("#de_input_project_title").val(entity.title);

        //设置标签
        var tagTpl=$("#uploadInputTagMore").html();
        var html=juicer(tagTpl,entity);
        $("#de_input_tag").html(html);

        //设置描述
        $("#de_project_description").text(entity.description);

        //设置缩略图
        $("#de_project_thumb").attr("src",entity.thumb);

        //显示界面
        DE.UIManager.showScreen("#de_screen_upload");

    }
    function initEntityMedias(id){
        $.ajax({
            url:DE.config.ajaxUrls.getEntityMedias,
            type:"get",
            dataType:"json",
            success:function(data){
               DE.store.uploadedMedias=data.medias;
               showEntityMedias(data.medias);
            },
            error:function(data){
                alert("error");
            }

        });
    }
    function showEntityMedias(data){
        var tpl=$("#completeUploadTpl").html();
        var html="";
        var iframeSrc="";
        var mediaType="";
        for(var obj in data){

            mediaType=data[obj]["zy_media_type"];
            if(mediaType=="zy_location_video") {
                iframeSrc=DE.config.root+"/uploadPlugin/html/zy_set_location_video.html?"+obj;
            }else if(mediaType=="zy_3d"){
                iframeSrc=DE.config.root+"/uploadPlugin/html/zy_set_3d.html?"+obj;
            }else if(mediaType=="zy_ppt"){
                iframeSrc=DE.config.root+"/uploadPlugin/html/zy_set_ppt.html?"+obj;
            }else if(mediaType=="zy_network_video"){
                iframeSrc=DE.config.root+"/uploadPlugin/html/zy_set_network_video.html?"+obj;
            }else if(mediaType=="zy_image"){
                iframeSrc=DE.config.root+"/uploadPlugin/html/zy_set_image.html?"+obj;
            }

            html+=juicer(tpl,{
                media_type:data[obj]["zy_media_type"],
                media_id:obj,
                iframe_src:iframeSrc,
                thumb_src:data[obj]["zy_media_thumb_filepath"],
                filename:data[obj]["zy_media_filename"]
            });
        }
        $("#zy_uploaded_medias_ol").html(html);
    }

    return {
        getWorkDetail:function(){
            $.ajax({
                url:DE.config.urls.getWorkDetail,
                type:"post",
                data:{

                },
                dataType:"json",
                success:function(data){

                },
                error:function(){

                }

            });
        },
        editEntity:function(id){
            DE.store.currentEditEntityId=id;
            initEntityDetail(id);
            initEntityMedias(id);
        },
        createUpload:function(obj){
            if(obj.type=="thumb"){
                createThumbUpload();
            }else{
                createMediaUpload(obj.browseButton,obj.container,obj.filters)
            }
        },
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
        uploadBtnHandler:function(){

        },
        deleteUploadFile:function(){

        },
        setFirstActive:function(){

        },
        showInputTag:function(value){
            var tpl=$("#uploadInputTag").html();
            var html=juicer(tpl,{text:value});
            $("#de_input_tag").append($(html));
        },
        stepControl:function(href){
            if(href=="#de_upload_step2"){
                /*if($("#de_input_project_title").val()==""||$("#de_selected_tag li").length==0||$("#de_project_thumb").attr("src").match("images/")!=null){
                    return false;
                }*/
                var firstLi=$("#zy_uploaded_medias_ol li:eq(0)");
                if(firstLi.length!=0){
                    firstLi.addClass("zy_media_list_active");
                    $("#zy_media_iframe").attr("src",firstLi.find("a").attr("href"));
                }
            }else if(href=="#de_upload_step3"){
                //return false
            }

            DE.UIManager.gotoUploadStep(href);
        },
        ajaxForm:function(){
            $("#form").ajaxSubmit({
                url:DE.config.uploadAction,
                type:"post",
                data:{

                },
                dataType:"json",
                success:function (data) {
                    if (data.info == 1) {

                    } else {

                    }
                },
                error:function (data) {

                }
            });
        }
    }
})();

$(document).ready(function(){
    DE.upload.createUpload({type:"thumb"});
    /*DE.upload.createUpload({type:"media",browseButton:"",container:"",filters:""});
    DE.upload.createUpload({type:"media",browseButton:"",container:"",filters:""});
    DE.upload.createUpload({type:"media",browseButton:"",container:"",filters:""});
    DE.upload.createUpload({type:"media",browseButton:"",container:"",filters:""});*/

    $("#de_upload_step_nav a").click(function(evt){
        DE.upload.stepControl($(this).attr("href"));

        return false;
    });

    //标签删除事件
    $(document).on("click","#de_input_tag a",function(){
        $(this).parent().remove();

        return false;
    });
    $("#de_input_project_tag").keydown(function(event){
        if(event.keyCode==13){
            DE.upload.showInputTag($(this).val());
            $(this).val("");
        }
    });

    //显示上传文件的菜单
    $("#zy_add_medias_button").hover(function(e){
        $("#zy_add_media_menu").css("height","300px");
    },function(e){
        $("#zy_add_media_menu").css("height",0);
    });

    $("#zy_add_media_menu").hover(function(e){
        $("#zy_add_media_menu").css("height","300px");
    },function(e){
        $("#zy_add_media_menu").css("height",0);
    });

    //删除未上传的文件
    $(document).on("click","span.zy_uncomplete_delete",function(){
        if(confirm("如果文件在上传过程中或者在等待上传，则无法删除！尝试删除吗？")){
            $(this).parents("li").remove();
        }
    });

    //删除已经上传的文件
    $(document).on("click","span.zy_media_delete",function(event){
        if(confirm("确定删除吗？")){
            var media_id=$(this).parent().data("zy-media-id");
            DE.store.uploadedMedias[media_id]=undefined;
            delete DE.store.uploadedMedias[media_id];
            $(this).parents("li").remove();

            //让第一个选中
            if($("#zy_uploaded_medias_ol li").not(".zy_uncomplete_li").length!=0){
                $("#zy_uploaded_medias_ol li").removeClass("zy_media_list_active");
                $("#zy_uploaded_medias_ol li:eq(0)").addClass("zy_media_list_active");
                $("#zy_media_iframe").attr("src",$("#zy_uploaded_medias_ol li:eq(0)").find("a").attr("href"));
                $("#zy_uploaded_medias_ol").scrollTop(0);
            }else{
                $("#zy_media_iframe").removeAttr("src");
            }
        }

        //阻止事件冒泡到a
        return false;
    });

    //列表中每一项的点击事件，如果选中的列表没有填写完整，则不能选择其他列表
    $(document).on("click","a.zy_media_list",function(){
        var active=$(".zy_media_list_active");
        if(active.length!=0){

            //如果可以显示其他列表项，要删除active类
            active.removeClass("de_media_list_active");
        }

        //设置媒体类型
        var type=$(this).data("zy-media-type");
        if(type=="zy_location_video"){
            $("#zy_media_type").text("本地视频");
        }else if(type=="de_3d"){
            $("#zy_media_type").text("3d文件");
        }else if(type=="de_ppt"){
            $("#zy_media_type").text("ppt文件");
        }else if(type=="de_image"){
            $("#zy_media_type").text("图片");
        }else if(type=="de_network_video"){
            $("#zy_media_type").text("网络视频");
        }

        //控制类
        $(this).parent("li").addClass("zy_media_list_active");
    });

});