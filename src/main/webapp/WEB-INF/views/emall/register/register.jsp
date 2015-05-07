<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c" %>
<% 
	String path=request.getContextPath(); 
	String basePath=request.getScheme()+"://"+request.getServerName()+ ":"+request.getServerPort()+path+ "/"; 
%>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">
		<!-- BEGIN GLOBAL MANDATORY STYLES -->
		<link href="<%= basePath %>static/lib/media/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
		<link href="<%= basePath %>static/lib/media/css/bootstrap-responsive.min.css" rel="stylesheet" type="text/css"/>
		<link href="<%= basePath %>static/lib/media/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
		<link href="<%= basePath %>static/lib/media/css/style-metro.css" rel="stylesheet" type="text/css"/>
		<link href="<%= basePath %>static/lib/media/css/style.css" rel="stylesheet" type="text/css"/>
		<link href="<%= basePath %>static/lib/media/css/style-responsive.css" rel="stylesheet" type="text/css"/>
		<link href="<%= basePath %>static/lib/media/css/default.css" rel="stylesheet" type="text/css" id="style_color"/>
		<link href="<%= basePath %>static/lib/media/css/uniform.default.css" rel="stylesheet" type="text/css"/>
		<!-- END GLOBAL MANDATORY STYLES -->
		<!-- BEGIN PAGE LEVEL STYLES -->
		<link rel="stylesheet" type="text/css" href="<%= basePath %>static/lib/media/css/select2_metro.css" />
		<link rel="stylesheet" type="text/css" href="<%= basePath %>static/lib/media/css/chosen.css" />
		<script src="<%= basePath %>static/lib/jQueryAlert/jquery.js" type="text/javascript"></script>
		<script src="<%= basePath %>static/lib/jQueryAlert/jquery.ui.draggable.js" type="text/javascript"></script>
		<script src="<%= basePath %>static/lib/jQueryAlert/jquery.alerts.js" type="text/javascript"></script>
		<link href="<%= basePath %>static/lib/jQueryAlert/jquery.alerts.css" rel="stylesheet" type="text/css" media="screen" />
		
		<!-- END PAGE LEVEL STYLES -->
		<style>
		.container-fluid {
			padding-top: 0px;
			padding-right: 20px;
			padding-left: 20px;
		}
		body {
			background-color: #FFF !important;
		}		
		.portlet {
			clear: both;
			margin-top: 0px;
			margin-bottom: 0px;
			padding: 0px;
		}
		</style>
	</head>
    <body class="page-header-fixed">
	    <!-- BEGIN PAGE CONTAINER-->
	    <div class="container-fluid">
	        <!-- BEGIN PAGE CONTENT-->
		    <div class="row-fluid" style="height:50px;width:100%;background-color:#FFF;">
		    	<div style="height:40px;position:relative;top:3px;padding-top:13px;text-align:center;font-size:40px;"><b>店铺注册</b></div>
		    </div>    
	        <div class="row-fluid">
	            <div class="span12">
	                <div class="portlet box green" id="form_wizard_1">
	                    <div class="portlet-title">
	                        <div class="caption">
	                            <i class="icon-reorder">
	                            </i>
	                            	注册向导 -
	                            <span class="step-title">
	                                	第 1 步
	                            </span>
	                        </div>
	                        <div class="tools hidden-phone">
	                        </div>
	                    </div>
	                    <div class="portlet-body form">
	                        <form action="/portal/pt/meplogin/doRegisteMerchants" method="post" class="form-horizontal" id="submit_form" >
	                            <div class="form-wizard">
	                                <div class="navbar steps">
	                                    <div class="navbar-inner">
	                                        <ul class="row-fluid">
	                                            <li class="span3">
	                                                <a href="#tab1" data-toggle="tab" class="step active">
	                                                    <span class="number">
	                                                        1
	                                                    </span>
	                                                    <span class="desc">
	                                                        <i class="icon-ok">
	                                                        </i>
	                                                        店铺基本信息
	                                                    </span>
	                                                </a>
	                                            </li>
	                                            <li class="span3">
	                                                <a href="#tab2" data-toggle="tab" class="step">
	                                                    <span class="number">
	                                                        2
	                                                    </span>
	                                                    <span class="desc">
	                                                        <i class="icon-ok">
	                                                        </i>
	                                                       企业资质
	                                                    </span>
	                                                </a>
	                                            </li>
	                                            <li class="span3">
	                                                <a href="#tab3" data-toggle="tab" class="step">
	                                                    <span class="number">
	                                                        3
	                                                    </span>
	                                                    <span class="desc">
	                                                        <i class="icon-ok">
	                                                        </i>
	                                                        其他信息
	                                                    </span>
	                                                </a>
	                                            </li>
	                                            <li class="span3">
	                                                <a href="#tab4" data-toggle="tab" class="step">
	                                                    <span class="number">
	                                                        4
	                                                    </span>
	                                                    <span class="desc">
	                                                        <i class="icon-ok">
	                                                        </i>
	                                                        提交申请
	                                                    </span>
	                                                </a>
	                                            </li>
	                                        </ul>
	                                    </div>
	                                </div>
	                                <div id="bar" class="progress progress-success progress-striped">
	                                    <div class="bar">
	                                    </div>
	                                </div>
	                                <div class="tab-content">
	                                    <div class="alert alert-error hide">
	                                        <button class="close" data-dismiss="alert">
	                                        </button>
	                                        您的输入有误，请检查所填写的内容！
	                                    </div>
	                                    <div class="alert alert-success hide">
	                                        <button class="close" data-dismiss="alert">
	                                        </button>
	                                        表单校验成功!
	                                    </div>
	                                    <div class="tab-pane active" id="tab1">
	                                        <h3 class="block">
	                                           店铺基本信息
	                                        </h3>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                店铺名称
	                                                <span class="required">
	                                                    *
	                                                </span>
	                                            </label>
	                                            <div class="controls">
	                                                <input type="text" class="span6 m-wrap" name="merchantsname" id="merchantsname"/>
	                                                <span class="help-inline">
	                                                    输入店铺名称,3~50个字符，推荐使用中文名称。
	                                                </span>
	                                            </div>
	                                        </div>
											<div class="control-group">
												<label class="control-label">店铺分类 <span class="required">*</span></label>
												<div class="controls">
													<select class="span6 m-wrap" name="merchantsclass" id="merchantsclass">
														<option value="">请选择店铺分类...</option>
													</select>
													<span class="help-inline">
	                                                    店铺所属的类别。
	                                                </span>
												</div>
											</div>	                                        
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                用户名
	                                                <span class="required">
	                                                    *
	                                                </span>
	                                            </label>
	                                            <div class="controls">
	                                                <input type="text" class="span6 m-wrap" name="username" id="username"/>
	                                                <span class="help-inline">
	                                                    用户名，4~20个字符，推荐使用商家名称拼音首字母，不支持中文。
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                登录密码
	                                                <span class="required">
	                                                    *
	                                                </span>
	                                            </label>
	                                            <div class="controls">
	                                                <input type="password" class="span6 m-wrap" name="password" id="submit_form_password"
	                                                />
	                                                <span class="help-inline">
	                                                    6~16个字符，建议使用字母加数字的组合密码。
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                确认密码
	                                                <span class="required">
	                                                    *
	                                                </span>
	                                            </label>
	                                            <div class="controls">
	                                                <input type="password" class="span6 m-wrap" name="rpassword" />
	                                                <span class="help-inline">
	                                                    确认密码!
	                                                </span>
	                                            </div>
	                                        </div>
											<div class="control-group">
	                                            <label class="control-label">
	                                                联系人
	                                                <span class="required">
	                                                    *
	                                                </span>
	                                            </label>
	                                            <div class="controls">
	                                                <input type="text" class="span6 m-wrap" name="lxr" id="lxr"/>
	                                                <span class="help-inline">
	                                                    商户联系人名称。
	                                                </span>
	                                            </div>
	                                        </div>
 											<div class="control-group">
	                                            <label class="control-label">
	                                                手机号码
	                                                <span class="required">
	                                                    *
	                                                </span>
	                                            </label>
	                                            <div class="controls">
	                                                <input type="text" class="span6 m-wrap" name="lxrmobile" id="lxrmobile"/>
	                                                <span class="help-inline">
	                                                    联系人手机号码。
	                                                </span>
	                                            </div>
	                                        </div>                                    
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                邮箱
	                                                <span class="required">
	                                                    *
	                                                </span>
	                                            </label>
	                                            <div class="controls">
	                                                <input type="text" class="span6 m-wrap" name="lxremail" id="lxremail"/>
	                                                <span class="help-inline">
	                                                    联系人邮箱地址。
	                                                </span>
	                                            </div>
	                                        </div>
	                                    </div>
	                                    <div class="tab-pane" id="tab2">
	                                        <h3 class="block">
	                                            企业资质信息
	                                        </h3>
											<div class="control-group">
	                                            <label class="control-label">
	                                                地区
	                                            </label>
	                                            <div class="controls">
	                                                <select class="span6 m-wrap" name="areainfo" id="areainfo">
														<option value="">请选择地区...</option>
													</select>
													<span class="help-inline">
	                                                    商户所在地区。
	                                                </span>
	                                            </div>
	                                        </div>	  
											<div class="control-group">
	                                            <label class="control-label">
	                                                行业
	                                            </label>
	                                            <div class="controls">
	                                                <select class="span6 m-wrap" name="tradeinfo" id="tradeinfo">
														<option value="">请选择行业...</option>
													</select>
													<span class="help-inline">
	                                                    商户所属行业。
	                                                </span>
	                                            </div>
	                                        </div>	 
											<div class="control-group">
	                                            <label class="control-label">
	                                                营业执照注册号
	                                            </label>
	                                            <div class="controls">
	                                                <input type="text" class="span6 m-wrap" name="yyzzzch" id="yyzzzch"/>
	                                                <span class="help-inline">
	                                                    商户的营业执照号码。
	                                                </span>
	                                            </div>
	                                        </div>	 
											<div class="control-group">
	                                            <label class="control-label">
	                                                税务登记代码
	                                            </label>
	                                            <div class="controls">
	                                                <input type="text" class="span6 m-wrap" name="swdjdm" id="swdjdm"/>
	                                                <span class="help-inline">
	                                                    商户的税务登记代码。
	                                                </span>
	                                            </div>
	                                        </div>	 
											<div class="control-group">
	                                            <label class="control-label">
	                                                纳税人识别号
	                                            </label>
	                                            <div class="controls">
	                                                <input type="text" class="span6 m-wrap" name="nsrsbh" id="nsrsbh"/>
	                                                <span class="help-inline">
	                                                    纳税人识别号。
	                                                </span>
	                                            </div>
	                                        </div>	 
											<div class="control-group">
	                                            <label class="control-label">
	                                                法人代表
	                                                <span class="required">
	                                                    *
	                                                </span>
	                                            </label>
	                                            <div class="controls">
	                                                <input type="text" class="span6 m-wrap" name="frdb" id="frdb"/>
	                                                <span class="help-inline">
	                                                    法人代表。
	                                                </span>
	                                            </div>
	                                        </div>	 
	                                    </div>
	                                    <div class="tab-pane" id="tab3">
	                                        <h3 class="block">
	                                            商户详细信息
	                                        </h3>
											<div class="control-group">
	                                            <label class="control-label">
	                                                常用电话
	                                            </label>
	                                            <div class="controls">
	                                                <input type="text" class="span6 m-wrap" name="cydh" id="cydh"/>
	                                                <span class="help-inline">
	                                                     常用电话。
	                                                </span>
	                                            </div>
	                                        </div>                                    
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                常用邮箱
	                                            </label>
	                                            <div class="controls">
	                                                <input type="text" class="span6 m-wrap" name="cyyx" id="cyyx"/>
	                                                <span class="help-inline">
	                                                     常用邮箱。
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                网址
	                                            </label>
	                                            <div class="controls">
	                                                <input type="text" class="span6 m-wrap" name="weburl" id="weburl"/>
	                                                <span class="help-inline">
	                                                    网址
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                企业地址
	                                                <span class="required">
	                                                    *
	                                                </span>
	                                            </label>
	                                            <div class="controls">
	                                                <input type="text" class="span6 m-wrap" name="address" id="address"/>
	                                                <span class="help-inline">
	                                                    企业详细地址。
	                                                </span>
	                                            </div>
	                                        </div>
											<div class="control-group">
	                                            <label class="control-label">
	                                                邮编
	                                            </label>
	                                            <div class="controls">
	                                                <input type="text" class="span6 m-wrap" name="yzbm" id="yzbm"/>
	                                                <span class="help-inline">
	                                                     邮编。
	                                                </span>
	                                            </div>
	                                        </div> 
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                商户信息简介
	                                            </label>
	                                            <div class="controls">
	                                                <textarea class="span6 m-wrap" rows="3" name="remarks" id="remarks"></textarea>
	                                            </div>
	                                        </div>
	                                    </div>
	                                    <div class="tab-pane" id="tab4">
	                                        <h3 class="block">
	                                           	确认填写的信息，点击提交注册商户!
	                                        </h3>
	                                        <h4 class="form-section">
	                                            基本信息
	                                        </h4>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                商户名称
	                                            </label>
	                                            <div class="controls">
	                                                <span class="text display-value" data-display="merchantsname">
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                用户名
	                                            </label>
	                                            <div class="controls">
	                                                <span class="text display-value" data-display="username">
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                联系人
	                                            </label>
	                                            <div class="controls">
	                                                <span class="text display-value" data-display="lxr">
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                手机号码
	                                            </label>
	                                            <div class="controls">
	                                                <span class="text display-value" data-display="lxrmobile">
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                邮箱
	                                            </label>
	                                            <div class="controls">
	                                                <span class="text display-value" data-display="lxremail">
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <h4 class="form-section">
	                                            企业资质信息
	                                        </h4>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                地区:
	                                            </label>
	                                            <div class="controls">
	                                                <span class="text display-value" data-display="areainfo">
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                行业:
	                                            </label>
	                                            <div class="controls">
	                                                <span class="text display-value" data-display="tradeinfo">
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                营业执照注册号:
	                                            </label>
	                                            <div class="controls">
	                                                <span class="text display-value" data-display="yyzzzch">
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                税务登记代码:
	                                            </label>
	                                            <div class="controls">
	                                                <span class="text display-value" data-display="swdjdm">
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                纳税人识别号:
	                                            </label>
	                                            <div class="controls">
	                                                <span class="text display-value" data-display="nsrsbh">
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                法人代表:
	                                            </label>
	                                            <div class="controls">
	                                                <span class="text display-value" data-display="frdb">
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <h4 class="form-section">
	                                            其他信息
	                                        </h4>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                常用电话:
	                                            </label>
	                                            <div class="controls">
	                                                <span class="text display-value" data-display="cydh">
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                常用邮箱:
	                                            </label>
	                                            <div class="controls">
	                                                <span class="text display-value" data-display="cyyx">
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                网址:
	                                            </label>
	                                            <div class="controls">
	                                                <span class="text display-value" data-display="weburl">
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                邮编:
	                                            </label>
	                                            <div class="controls">
	                                                <span class="text display-value" data-display="yzbm">
	                                                </span>
	                                            </div>
	                                        </div>
	                                        <div class="control-group">
	                                            <label class="control-label">
	                                                商户信息简介:
	                                            </label>
	                                            <div class="controls">
	                                                <span class="text display-value" data-display="remarks">
	                                                </span>
	                                            </div>
	                                        </div>
	                                    </div>
	                                </div>
	                                <div class="form-actions clearfix">
	                                    <a href="javascript:;" class="btn button-previous">
	                                        <i class="m-icon-swapleft">
	                                        </i>
	                                        上一步
	                                    </a>
	                                    <a href="javascript:;" class="btn green button-next">
	                                        下一步
	                                        <i class="m-icon-swapright m-icon-white">
	                                        </i>
	                                    </a>
	                                    <a href="javascript:;" class="btn green button-submit">
	                                        提交
	                                        <i class="m-icon-swapright m-icon-white">
	                                        </i>
	                                    </a>
	                                </div>
	                            </div>
	                        </form>
	                    </div>
	                </div>
	            </div>
	        </div>
	        <!-- 底部copyright -->
			<nav class="navbar navbar-inverse" role="navigation" style="background-color:black;margin-bottom:0px;">
		        <div class="container">
		            <div class="row" style="margin-top:0px;">
		                <div class="col-md-12 ">
		                    <h6 style="color: #fff;text-align:center;">
		                        ©版权所有：用友网络科技股份有限公司  Copyright © 2014 - 2017 All Rights Reserved 
								<br>联系地址：北京市海淀区北清路68号用友软件园 技术支持热线：010-62430508 Email：liujmc@yonyou.com</h6>
		                </div>
		            </div>
		        </div>
		    </nav>
        </div>
		<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
		<!-- BEGIN CORE PLUGINS -->
		<script src="<%= basePath %>static/lib/media/js/jquery-1.10.1.min.js" type="text/javascript"></script>
		<script src="<%= basePath %>static/lib/media/js/jquery-migrate-1.2.1.min.js" type="text/javascript"></script>
		<!-- IMPORTANT! Load jquery-ui-1.10.1.custom.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->
		<script src="<%= basePath %>static/lib/media/js/jquery-ui-1.10.1.custom.min.js" type="text/javascript"></script>      
		<script src="<%= basePath %>static/lib/media/js/bootstrap.min.js" type="text/javascript"></script>
		<!--[if lt IE 9]>
		<script src="<%= basePath %>static/lib/media/js/excanvas.min.js"></script>
		<script src="<%= basePath %>static/lib/media/js/respond.min.js"></script>  
		<![endif]-->   
		<script src="<%= basePath %>static/lib/media/js/jquery.slimscroll.min.js" type="text/javascript"></script>
		<script src="<%= basePath %>static/lib/media/js/jquery.blockui.min.js" type="text/javascript"></script>  
		<script src="<%= basePath %>static/lib/media/js/jquery.cookie.min.js" type="text/javascript"></script>
		<script src="<%= basePath %>static/lib/media/js/jquery.uniform.min.js" type="text/javascript" ></script>
		<!-- END CORE PLUGINS -->
		<!-- BEGIN PAGE LEVEL PLUGINS -->
		<script type="text/javascript" src="<%= basePath %>static/lib/media/js/jquery.validate.min.js"></script>
		<script type="text/javascript" src="<%= basePath %>static/lib/media/js/additional-methods.min.js"></script>
		<script type="text/javascript" src="<%= basePath %>static/lib/media/js/jquery.validate.message_cn.js"></script>
		<script type="text/javascript" src="<%= basePath %>static/lib/media/js/jquery.bootstrap.wizard.min.js"></script>
		<script type="text/javascript" src="<%= basePath %>static/lib/media/js/chosen.jquery.min.js"></script>
		<script type="text/javascript" src="<%= basePath %>static/lib/media/js/select2.min.js"></script>
		<!-- END PAGE LEVEL PLUGINS -->
		<!-- BEGIN PAGE LEVEL SCRIPTS -->
		<script src="<%= basePath %>static/lib/media/js/app.js"></script>
		<script src="<%= basePath %>static/lib/media/js/form-wizard.js"></script>    
		        
		<script>
		// 增加自定义参数
		jQuery.validator.addMethod("stringCheck", function(value, element) {      
		    return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);      
		}, "只能包括中文字、英文字母、数字和下划线");  
		
		jQuery(document).ready(function() {    
		   App.init();
		   FormWizard.init();
		   
		   /*
		   var options = {
                url: '/portal/pt/meplogin/getRegisterInitInfo',
                type: 'get',
                dataType: 'json',
                data: {} , 
                success: function (json) {
					if("success" == json.flag){
						//alert(json.message);
						initPage(json);
					} else {
						alert("初始化失败!");
					}
                }
            };
            $.ajax(options);
            */
		});
		
    	// 提交form到商户平台，调用运营平台的远程service保存商户信息
		$('#form_wizard_1 .button-submit').click(function () {
            //第一步
            var merchantsname = $("#merchantsname").val();
            var merchantsclass = $("#merchantsclass").val();
            var username = $("#username").val();
            var lxr = $("#lxr").val();
            var password = $("#submit_form_password").val();
            var lxremail = $("#lxremail").val();
            var lxrmobile = $("#lxrmobile").val();
            //第二步
            var areainfo = $("#areainfo").val();
            var tradeinfo = $("#tradeinfo").val();
            var yyzzzch = $("#yyzzzch").val();
            var swdjdm = $("#swdjdm").val();
            var nsrsbh = $("#nsrsbh").val();
            var frdb = $("#frdb").val();
            //第三步
            var cydh = $("#cydh").val();
            var cyyx = $("#cyyx").val();
            var weburl = $("#weburl").val();
            var address = $("#address").val();
            var yzbm = $("#yzbm").val();
            var remarks = $("#remarks").val();
            var formData = {
            	merchantsname:merchantsname,
            	merchantsclass:merchantsclass,
            	username:username,
            	lxr:lxr,
            	password:password,
            	lxremail:lxremail,
            	lxrmobile:lxrmobile,
            	
            	areainfo:areainfo,
            	tradeinfo:tradeinfo,
            	yyzzzch:yyzzzch,
            	swdjdm:swdjdm,
            	nsrsbh:nsrsbh,
            	frdb:frdb,
            	
            	cydh:cydh,
            	cyyx:cyyx,
            	weburl:weburl,
            	address:address,
            	yzbm:yzbm,
            	remarks:remarks
            };
            
            var shopInfo = {
            		"companyName" : merchantsname,
            		"shopTitle" : merchantsname,
            		"shopName" : merchantsname,
            		"status" : "0",
            		"customerCode" : "88888",
            		"busProducts" : "ordinary"
            }
            var realurl = "<%= basePath %>cxf/jaxrs/shopinfo/register";
            var options = {
                url: realurl,
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(shopInfo) , 
                success: function (json) {
                	if(json>0){
                		jConfirm("注册成功!请关注短信和邮件对应的审批结果!", '确认窗口', function(r) {
						    if(r){
								window.close();
						    } 
						});
                	} else {
                		jAlert("注册失败!请正确输入各项信息!","错误");
                	}
                },
                error: function(req, textStatus, errorThrown){
					if(req.responseJSON){
						var validateObj = req.responseJSON;
						
						jAlert(JSON.stringify(validateObj),"错误");
						jAlert("注册失败!请正确输入各项信息!","错误");
					} 
					//jAlert("保存失败!","错误");
				}
            };
            $.ajax(options);
        }).hide();
        
        /**
         * 初始化下拉
         */
        function initPage(initInfo){
       		for (var i=0; i<initInfo.classarray.length; i++) {
				var optstr = initInfo.classarray[i];
				var optarray = optstr.split(":");
				var opthtml = '<option value="'+ optarray[0] +'">'+ optarray[1] +'</option>';
				$("#merchantsclass").append(opthtml);
			}
       		for (var i=0; i<initInfo.regionarray.length; i++) {
				var optstr = initInfo.regionarray[i];
				var optarray = optstr.split(":");
				var opthtml = '<option value="'+ optarray[0] +'">'+ optarray[1] +'</option>';
				$("#areainfo").append(opthtml);
			}
       		for (var i=0; i<initInfo.industryarray.length; i++) {
				var optstr = initInfo.industryarray[i];
				var optarray = optstr.split(":");
				var opthtml = '<option value="'+ optarray[0] +'">'+ optarray[1] +'</option>';
				$("#tradeinfo").append(opthtml);
			}
        }
		</script>        
    </body>
</html>