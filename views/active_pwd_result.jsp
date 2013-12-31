<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ page session="false" %>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="5;url=http://design.hnu.cn/pinwall" /> 
<title>湖南大学设计艺术学院 - School of Design, Hunan University</title>
<style>
body{
	margin:0;
	padding:0;
	}
header{
	padding-top:80px;
	background:url(images/logo-80.png) no-repeat center top;
	margin:auto;
	text-align:center;
	font-size:1.5em;
	font-family:"微软雅黑";
	text-shadow:0 1px 0 #fff;
	color:#666;
	}
.wrapper{
	background:#efefef;
	text-align:center;
	padding-top:20px;
	}
.wrapper p a{
	color:#390;
	text-decoration:none;
	}
.wrapper p a:hover{
	color:#333;
	}
.greeting{
	font-size:2em;
	text-shadow:0 1px 0 #fff;
	font-weight:bold;
	}
.de_button{
	display: inline-block;
    font-size: 1em;
    text-decoration: none;
    height: 40px;
    line-height: 40px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    color: #333;
    font-weight: bold;
    border: #bbb 1px solid;
    padding: 0 10px;
	min-width:150px;
    /*渐变色*/
    background: #efefef; /* Old browsers */
    background: -moz-linear-gradient(top, #efefef 0%, #cccccc 100%); /* FF3.6+ */
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #efefef), color-stop(100%, #cccccc)); /* Chrome,Safari4+ */
    background: -webkit-linear-gradient(top, #efefef 0%, #cccccc 100%); /* Chrome10+,Safari5.1+ */
    background: -o-linear-gradient(top, #efefef 0%, #cccccc 100%); /* Opera 11.10+ */
    background: -ms-linear-gradient(top, #efefef 0%, #cccccc 100%); /* IE10+ */
    background: linear-gradient(to bottom, #efefef 0%, #cccccc 100%); /* W3C */
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#efefef', endColorstr='#cccccc', GradientType=0); /* IE6-9 */
	}
.de_button:hover {
    background: #ccc;
}
footer{
	background:#fff;
	height:100px;
	position:relative;
	text-align:left;
	padding:20px;
	margin-top:40px;
	font-family:"微软雅黑";
	}
footer p{
	font-size:12px;
	margin-right:220px;
	}
.hnusdlogo{
	font-size:0;
	text-indent:-9999px;
	background:url(images/hnusdlogo.png) no-repeat;
	height:60px;
	width:200px;
	position:absolute;
	top:20px;
	right:20px;
	}
</style>
</head>

<body>
<div class="wrapper">
<header>图钉墙</header>
<%
	String resultCode = (String)request.getAttribute("resultCode").toString();
	if("password_reset_succ".equals(resultCode)){
%>
<h3>密码激活成功,请使用新密码进行登录。</h3>
<%
	}else{
%>
<h3>密码激活失败,请重启提交申请。</h3>
<%
	}
%>
<br>
5秒后跳转到图钉墙首页......

<footer>
<p>©2013 湖南大学设计艺术学院，<a href="http://design.hnu.cn" target="_blank">http://design.hnu.cn</a></p>
<div class="hnusdlogo">湖南大学设计艺术学院 - School of Design, Hunan University</div>

</footer>
</div>
</body>
</html>