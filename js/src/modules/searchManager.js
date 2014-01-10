/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-12-19
 * Time: 上午10:40
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.searchManager=(function(){
    return {

        /**
         * 获取系统标签设置在顶部搜索区域
         */
        getTags:function(){
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getTags,
                type:"get",
                dataType:"json",
                success:function(data){
                    if(data.success){
                        me.showTags(data);
                    }else{
                        DE.config.ajaxReturnErrorHandler(data);
                    }

                    //进入页面，请求后台是否登录,先获取到tag然后再初始化数据，这样当时tag进入的时候就知道是作品还是资源
                    DE.loginManager.checkLogin();

                },
                error:function(){
                    DE.config.ajaxErrorHandler();

                    //进入页面，请求后台是否登录
                    DE.loginManager.checkLogin();
                }

            });
        },

        /**
         * 显示系统标签
         * @param {Object} data 请求系统标签时的json对象
         */
        showTags:function(data){
            var html="";
            var projectTagTpl=$("#projectTagTpl").html();
            html=juicer(projectTagTpl,{projecttags:data.work});
            $("#de_project_tags").html(html);

            var resourceTagTpl=$("#resourceTagTpl").html();
            html=juicer(resourceTagTpl,{resourcetags:data.resource});
            $("#de_resource_tags").html(html);
        },

        filterClickHandler:function(){
             DE.uiManager.showFilterMenu();
        },

        /**
         * 系统标签点击事件
         * @param {String} href 需要设置的地址
         * @param {String} searchType 搜索的类型
         * @param {Boolean} isTag 是否是标签
         */
        searchHandler:function(href,searchType,isTag){
            DE.historyManager.push(href); //由于有清空store的操作，需要最先执行
            var array=href.split("/");
            var value=array[1];
            DE.uiManager.showLoading();
            DE.entityManager.getEntityBySearch(value,searchType,isTag,true);
            $("#de_search_input").val("");
        },

        /**
         * 搜索结果面板的tab切换事件
         * @param {String} type 需要显示的类型
         */
        searchTabClickHandler:function(type){

            //如果当前显示的类型和点击的按钮不一致，则要置换
            if(type!=DE.storeManager.currentSearch.currentSearchType){
                DE.storeManager.searchLoadedCount=0;
                DE.entityManager.getEntityBySearch(DE.storeManager.currentSearch.currentSearchValue,type,DE.storeManager.currentSearch.isTag,true);
            }

        },

        /**
         * 搜素输入框事件
         */
        searchInputEventHandler:function(){
            var me=this;
            var searchInput= $("#de_search_input");
            var filterMenu=$("#de_filter_menu");
            searchInput.keydown(function(event){
                if(event.keyCode==13){
                    var value=$(this).val();
                    if(value.trim()){
                        me.serachHandler("search/"+value,"",false);
                        searchInput.trigger("marcopoloblur");
                    }
                }
            });

            searchInput.on('marcopoloblur', function (event) {
                filterMenu.removeClass("de_overflow_visible");
            });
            searchInput.on('marcopolofocus', function (event) {
                filterMenu.addClass("de_overflow_visible");
            });

            searchInput.marcoPolo({
                url: DE.config.ajaxUrls.searchSuggest,
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
                    me.serachHandler("search/"+data,"",false);
                    searchInput.trigger("marcopoloblur");
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
        }
    }
})();
