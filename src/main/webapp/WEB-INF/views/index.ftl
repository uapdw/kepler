<!DOCTYPE html>
<html>

	<head>
		<meta http-equiv="content-type" content="text/html;charset=UTF-8" />
		<meta charset="utf-8" />
		<title>主页</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<meta content="" name="description" />
		<meta content="" name="author" />
		<link rel="shortcut icon" href="${ctx}/static/images/favicon_2.ico" type="image/x-icon" />
		<link href="${ctx}/static/lib/uui/css/u.css" rel="stylesheet">
		<link href="${ctx}/static/css/index.css" rel="stylesheet">
		<script src="${ctx}/static/lib/jQueryAlert/jquery.js" type="text/javascript"></script>
		<script src="${ctx}/static/lib/jQueryAlert/jquery.ui.draggable.js" type="text/javascript"></script>
		<script src="${ctx}/static/lib/jQueryAlert/jquery.alerts.js" type="text/javascript"></script>
		<link href="${ctx}/static/lib/jQueryAlert/jquery.alerts.css" rel="stylesheet" type="text/css" media="screen" />
		<script>
			window.$ctx = '${ctx}';
		</script>
	</head>
	<body style="background-color:#F1F1F1">
		<!-- top -->
		<div class="top navbar navbar-default" role="navigation" style="background-color:#201F1B;">
		  <div style="width:1180px;height:50px;margin:auto">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#example-navbar-collapse">
					<span class="sr-only">切换导航</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<!--<a class="navbar-brand" href="#">演示环境</a>-->
				<div style="width:105px;height:50px;float:left;padding-top:9px;margin-right:25px;padding-left: 20px"><img src="${ctx}/static/images/Kepler.png" style="width:80px;height:32px"></div>
				<div type="button" id="show_side" class="navbar-brand glyphicon glyphicon-th-large"></div>
			</div>
			<div class="collapse navbar-collapse" id="example-navbar-collapse" style="width:300px;float:right">
				<ul class="right-nav nav navbar-nav navbar-right">
					<li>
						<a href="#" class="glyphicon glyphicon-envelope"></a>
					</li>
					<li class="dropdown" style="width:160px;">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown">
							<span class="glyphicon glyphicon-user"></span>
							<span class="">${cusername}</span>
							<span class="glyphicon glyphicon-chevron-down"></span>
						</a>
						<ul class="dropdown-menu">
						<!--<li><a href="#">系统配置</a></li>
							<li><a href="#">个性化</a></li>
							<li><a href="${ctx}/register" target="_blank">注册店铺测试</a></li>
							
							<li><a href="#">mmm</a>
							</li>
							<li class="divider"></li>
							<li><a href="#">zzzz</a>
							</li>
							<li class="divider"></li>
							-->
							<li><a href="${ctx}/logout">注销</a></li>
						</ul>
					</li>
				</ul>
			</div>
		  </div>	
		</div> 
		<!-- left -->
		<!--<div class="leftpanel">-->
		<div class="leftpanel" style="background-color:#E7E7E7;">
			<ul class="left-menu">
				<!--
				<li class="">
					<a href="javascript:;"> <i class="fa fa-file-text"></i> <span class="title">系统管理</span> <span class="arrow glyphicon glyphicon-chevron-left"></span> </a>
					<ul class="sub-menu">
						<li> <a href="" >用户管理</a> </li>
						<li> <a href="" >角色管理</a> </li>
						<li> <a href="#/mgr/function/functionlist" >功能管理</a> </li>
					</ul>
				</li>
				<li class="">
					<a href="javascript:;"> <i class="fa fa-file-text"></i> <span class="title">商品维护(平台)</span> <span class="arrow glyphicon glyphicon-chevron-left"></span> </a>
					<ul class="sub-menu">
						<li> <a href="#/emall/admgr/admgrlist" >广告图片管理</a> </li>
						<li> <a href="#/emall/category/category">目录维护</a> </li>
						<li> <a href="#/emall/goods/goodslist">商品管理</a> </li>
						<li> <a href="#/emall/attribute/attributelist">属性维护</a> </li>
						<li> <a href="#/emall/brand/brandlist">品牌管理</a> </li>
						<li> <a href="">商品价格调整审核</a> </li>
						<li> <a href="">商品解冻审核</a> </li>
						<li> <a href="#/emall/category/bindtest">学习测试konckoutjs</a> </li>
						<li> <a href="#/emall/example/examplelist">example</a> </li>
						<li> <a href="#/emall/demo/demolist">Demo</a> </li>
					</ul>
				</li>
				<li class="">
					<a href="javascript:;"> <i class="fa fa-file-text"></i> <span class="title">商户店铺管理(平台)</span> <span class="arrow glyphicon glyphicon-chevron-left"></span> </a>
					<ul class="sub-menu">
						<li> <a href="">店铺维护</a> </li>
						<li> <a href="">店铺审核</a> </li>
					</ul>
				</li>
				<li class="">
					<a href="javascript:;"> <i class="fa fa-file-text"></i> <span class="title">商品管理(商户)</span> <span class="arrow glyphicon glyphicon-chevron-left"></span> </a>
					<ul class="sub-menu">
						<li> <a href="">商品发布</a> </li>
						<li> <a href="">商品维护</a> </li>
						<li> <a href="">价格调整申请</a> </li>
						<li> <a href="">商品解冻申请</a> </li>
						<li> <a href="">统计</a> </li>
					</ul>
				</li>
				<li class="">
					<a href="javascript:;"> <i class="fa fa-file-text"></i> <span class="title">店铺管理(商户)</span> <span class="arrow glyphicon glyphicon-chevron-left"></span> </a>
					<ul class="sub-menu">
						<li> <a href="">店铺基本信息维护</a> </li>
						<li> <a href="">店铺装修</a> </li>
						<li> <a href="">会员管理</a> </li>
						<li> <a href="">订单管理</a> </li>
					</ul>
				</li>	
				-->
			</ul>
		</div>
		<!-- content -->
		<div class="content"></div>

		<script src="${ctx}/static/lib/requirejs/require.debug.js"></script>
		<script src="${ctx}/static/js/config.js"></script>
		<script src="${ctx}/static/js/index.js"></script>
	</body>

</html>