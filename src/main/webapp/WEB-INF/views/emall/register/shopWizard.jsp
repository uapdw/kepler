<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c" %>
<% 
	String path=request.getContextPath(); 
	String basePath=request.getScheme()+"://"+request.getServerName()+ ":"+request.getServerPort()+path+ "/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link href="<%= basePath %>static/lib/uui/css/u.base.css" rel="stylesheet">
		<link href="<%= basePath %>static/lib/uui/css/u.ext.css" rel="stylesheet">
		<link href="<%= basePath %>static/lib/jQueryAlert/jquery.alerts.css" rel="stylesheet" type="text/css" media="screen" />
		<title>店铺注册</title>
		<style type="text/css">
			.grid-title{ text-align: center;}
			.grid-title h4{font-size: 25px; font-family:"宋体";}
			.control-label {float: left; padding-top: 5px;text-align: right;width: 160px;}
            .control-label .required {color: #e02222;font-size: 12px; padding-left: 2px;}
            .form-horizontal .controls { margin-left: 180px;}
            input,select,textarea{ margin-bottom: 10px; width: 500px;}
            .help-inline{color: #595959; margin-top: 6px;padding-left: 5px;display: inline-block;margin-bottom: 0;vertical-align: middle;} 
            .span-center{display: inline-block;margin-top:6px;} 
            .qText{font-size:14px;line-height: 20px; font-weight: normal;display:inline-block;margin-bottom:5px;}
                             
		</style>
	</head>

	<body>
	<div class="content">
		<div class="row">
			<div class="col-md-12">
				<div class="grid simple transparent">
					<div class="grid-title">
						<h4>店铺注册</h4>
					</div>
					<div class="grid-body ">
						<div class="row">
							<form id="commentForm"  class="form-horizontal" action="" method="post">
								<div class="col-md-12" id="rootwizard">
									<div class="form-wizard-steps">
										<ul class="wizard-steps form-wizard">
											<li data-target="#step1" class="active">
												<a data-toggle="tab" href="#tab1"> <span class="step">1</span> <span class="title">商户基本信息</span> </a>
											</li>
											<li class="" data-target="#step2">
												<a data-toggle="tab" href="#tab2"> <span class="step">2</span> <span class="title">企业资质</span> </a>
											</li>
											<li class="" data-target="#step3">
												<a data-toggle="tab" href="#tab3"> <span class="step">3</span> <span class="title">其他信息</span> </a>
											</li>
											<li class="" data-target="#step4">
												<a data-toggle="tab" href="#tab4"> <span class="step">4</span> <span class="title">提交申请 <br>

                          </span> </a>
											</li>
										</ul>
										<div class="clearfix"></div>
									</div>
									<div class="tab-content transparent">
										<div id="tab1" class="tab-pane active">
											<br>
											<div class="tab-content">
												<div id="tab1" class="tab-pane active">
													<h3 class="block">

	                                           商户基本信息

	                                        </h3>
													<div class="control-group">
														<label class="control-label">
															商户名称
															<span class="required">

	                                                    *

	                                                </span>
														</label>
														<div class="controls">
															<input type="text"  id="merchantsname" name="merchantsname"  datatype="*3-50" nullmsg="请输入3-50个字符！">
															<span class="Validform_checktip span-center" > 

	                                                    输入商户名称,3~50个字符，推荐使用中文名称。                                                
	                                                </span>
														</div>
													</div>
													<div class="control-group">
														<label class="control-label">商户分类<span class="required">*</span>
														</label>
														<div class="controls">
															<select id="merchantsclass" name="merchantsclass" class="">
																<option value="">请选择商户分类...</option>
															</select>
															<span class="Validform_checktip ">

	                                                    商户所属的类别。

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
															<input type="text" id="username" name="username" datatype=" /^\w{4,20}$/" nullmsg="请输入4~20个字符,不支持中文！">
															<span class="Validform_checktip span-center">

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
															<input type="password" id="submit_form_password" name="password" datatype="*6-16" nullmsg="请输入6~16个字符！">
															<span class="Validform_checktip span-center">

	                                                    6~16个字符，建议使用字母加数字的组合密码。

	                                                </span>
														</div>
													</div>
													<div class="control-group success">
														<label class="control-label">
															确认密码
															<span class="required">

	                                                    *

	                                                </span>
														</label>
														<div class="controls">
															<input type="password" id="rpassword" name="rpassword" datatype="*" recheck="password" nullmsg="请再输入一次密码！" errormsg="您两次输入的账号密码不一致！"><span for="rpassword" class="validate-inline ok valid"></span>
															<span class="Validform_checktip span-center">

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
															<input type="text" id="lxr" name="lxr" datatype="*6-16" nullmsg="请输入联系人名称！" errormsg="请输入6-16位字符！">
															<span class="Validform_checktip span-center">

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
															<input type="text" id="lxrmobile" name="lxrmobile" datatype="/^\d{11}$/" nullmsg="请输入手机号码！" errormsg="请输入11位数字！">
															<span class="Validform_checktip span-center">

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
															<input type="text" id="lxremail" name="lxremail" datatype="/^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i" nullmsg="请输入电子邮箱！" errormsg="请输入正确的电子邮箱！">
															<span class="Validform_checktip span-center">

	                                                    联系人邮箱地址。

	                                                </span>
														</div>
													</div>
												</div>



											</div>
										</div>
										<div id="tab2" class="tab-pane">
											<h3 class="block">

	                                            企业资质信息

	                                        </h3>
											<div class="control-group">
												<label class="control-label">
													地区
												</label>
												<div class="controls">
													<select id="areainfo" name="areainfo" class="">
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
													<select id="tradeinfo" name="tradeinfo" class="">
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
													<input type="text" id="yyzzzch" name="yyzzzch" datatype="/\d{15}/" errormsg="请输入15位数字！" ignore="ignore">
													<span class="Validform_checktip span-center">

	                                                    商户的营业执照号码。

	                                                </span>
												</div>
											</div>
											<div class="control-group">
												<label class="control-label">
													税务登记代码
												</label>
												<div class="controls">
													<input type="text" id="swdjdm" name="swdjdm" datatype="/\d{15}/" errormsg="请输入15位数字！" ignore="ignore">
													<span class="Validform_checktip span-center">

	                                                    商户的税务登记代码。

	                                                </span>
												</div>
											</div>
											<div class="control-group">
												<label class="control-label">
													纳税人识别号
												</label>
												<div class="controls">
													<input type="text" id="nsrsbh" name="nsrsbh" datatype="/\d{15}/" errormsg="请输入15位数字！" ignore="ignore">
													<span class="Validform_checktip span-center">

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
													<input type="text" id="frdb" name="frdb" datatype="/^[\u4E00-\u9FA5\uf900-\ufa2d]{2,10}$/" nullmsg="请输入法人代表名字！" errormsg="请输入2-10中文！">
													<span class="Validform_checktip span-center">

	                                                    法人代表。

	                                                </span>
												</div>
											</div>
										</div>
										<div id="tab3" class="tab-pane">
											<h3 class="block">

	                                            商户详细信息

	                                        </h3>
											<div class="control-group">
												<label class="control-label">
													常用电话
												</label>
												<div class="controls">
													<input type="text" id="cydh" name="cydh" datatype="/^\d{11}$/" errormsg="请输入11位数字！" ignore="ignore">
													<span class="Validform_checktip span-center">

	                                                     常用电话。

	                                                </span>
												</div>
											</div>
											<div class="control-group">
												<label class="control-label">
													常用邮箱
												</label>
												<div class="controls">
													<input type="text" id="cyyx" name="cyyx" datatype="/^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i"  errormsg="请输入正确的电子邮箱！" ignore="ignore">
													<span class="Validform_checktip span-center">

	                                                     常用邮箱。

	                                                </span>
												</div>
											</div>
											<div class="control-group">
												<label class="control-label">
													网址
												</label>
												<div class="controls">
													<input type="text" id="weburl" name="weburl" datatype="/^[a-zA-z]+://[^\s]*$/" errormsg="请输入正确的网址！" ignore="ignore">
													<span class="Validform_checktip span-center">

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
													<input type="text" id="address" name="address" datatype="/^[\u4E00-\u9FA5\uf900-\ufa2d]{5,30}$/" nullmsg="请输入企业地址！" errormsg="请输入5-30位中文！">
													<span class="Validform_checktip span-center">

	                                                    企业详细地址。

	                                                </span>
												</div>
											</div>
											<div class="control-group">
												<label class="control-label">
													邮编
												</label>
												<div class="controls">
													<input type="text" id="yzbm" name="yzbm" datatype="/^[1-9][0-9]{5}$/" errormsg="请输入正确的邮编！" ignore="ignore">
													<span class="Validform_checktip span-center">

	                                                     邮编。

	                                                </span>
												</div>
											</div>
											<div class="control-group">
												<label class="control-label">
													商户信息简介
												</label>
												<div class="controls">
													<textarea id="remarks" name="remarks" rows="3" datatype="/^[\u4E00-\u9FA5\uf900-\ufa2d]{0,100}$/" errormsg="请输入不大于100位的中文！" ignore="ignore"></textarea>
												</div>
											</div>
										</div>
										<div id="tab4" class="tab-pane" style="padding-left:130px;">
											<h3 class="block">

	                                           	确认填写的信息，点击提交注册商户!

	                                        </h3>
											<h4 class="form-section">

	                                            基本信息

	                                        </h4>
											<div class="control-group">
												<span class="qText">
													商户名称
												</span>
												
													<span id="merchantsname1" style="padding-left:5px;" >

	                                                </span>
												
											</div>
											<div class="control-group">
												<span class="qText">
													用户名
												</span>
											
													<span id="username1" style="padding-left:5px;">

	                                                </span>
												
											</div>
											<div class="control-group">
												<span class="qText">
													联系人
												</span>
												
													<span id="lxr1" style="padding-left:5px;">

	                                                </span>
												
											</div>
											<div class="control-group">
												<span class="qText">
													手机号码
												</span>
												
													<span id="lxrmobile1" style="padding-left:5px;">

	                                                </span>
												
											</div>
											<div class="control-group">
												<span class="qText">
													邮箱
												</span>
												
													<span id="lxremail1" style="padding-left:5px;">

	                                                </span>
												
											</div>
											<h4 class="form-section">

	                                            企业资质信息

	                                        </h4>
											<div class="control-group">
												<span class="qText">
													地区:
												</span>
												
													<span id="areainfo1" style="padding-left:5px;">

	                                                </span>
												
											</div>
											<div class="control-group">
												<span class="qText">
													行业:
												</span>
												
													<span id="tradeinfo1" style="padding-left:5px;">

	                                                </span>
												
											</div>
											<div class="control-group">
												<span class="qText">
													营业执照注册号:
												</span>
												
													<span id="yyzzzch1" style="padding-left:5px;">

	                                                </span>
												
											</div>
											<div class="control-group">
												<span class="qText">
													税务登记代码:
												</span>
												
													<span id="swdjdm1" style="padding-left:5px;">

	                                                </span>
												
											</div>
											<div class="control-group">
												<span class="qText">
													纳税人识别号:
												</span>
												
													<span id="nsrsbh1" style="padding-left:5px;">

	                                                </span>
												
											</div>
											<div class="control-group">
												<span class="qText">
													法人代表:
												</span>
												
													<span id="frdb1" style="padding-left:5px;">

	                                                </span>
												
											</div>
											<h4 class="form-section">

	                                            其他信息

	                                        </h4>
											<div class="control-group">
												<span class="qText">
													常用电话:
												</span>
												
													<span id="cydh1" style="padding-left:5px;">

	                                                </span>
												
											</div>
											<div class="control-group">
												<span class="qText">
													常用邮箱:
												</span>
												
													<span id="cyyx1" style="padding-left:5px;">

	                                                </span>
												
											</div>
											<div class="control-group">
												<span class="qText">
													网址:
												</span>
												
													<span id="weburl1" style="padding-left:5px;">

	                                                </span>
												
											</div>
											<div class="control-group">
												<span class="qText">
													邮编:
												</span>
												
													<span id="yzbm1" style="padding-left:5px;">

	                                                </span>
												
											</div>
											<div class="control-group">
												<span class="qText">
													商户信息简介:
												</span>
												
													<span id="remarks1" style="padding-left:5px;">

	                                                </span>
												
											</div>
										</div>
									
										<ul class=" wizard wizard-actions" style="padding-left: 200px;">											
											<li class="previous disabled"><a class="btn btn-default" href="javascript:;">&nbsp;&nbsp;上一步&nbsp;&nbsp;</a>
											</li>									
											<li id="next" class="next"><a class="btn btn-primary" href="javascript:;">&nbsp;&nbsp;下一步&nbsp;&nbsp;</a>								
											<li id="submita" style="display:none;">
											  	<!--<a class="btn btn-danger" id="asbumit" href="javascript:;">

                               &nbsp;&nbsp;提 交&nbsp;&nbsp; 

                            </a>-->  <button type="submit" class="btn btn-danger" id="shopinfoSubmit">&nbsp;&nbsp;提 交&nbsp;&nbsp;</button>
											</li>
										</ul>
										
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>

		</div>
		
	</div>
		<script src="<%= basePath %>static/lib/requirejs/require.debug.js"></script>
		<script src="<%= basePath %>static/js/wizard.js"></script>
		<script src="<%= basePath %>static/lib/jQueryAlert/jquery.js" type="text/javascript"></script>
		<script src="<%= basePath %>static/lib/jQueryAlert/jquery.ui.draggable.js" type="text/javascript"></script>
		<script src="<%= basePath %>static/lib/jQueryAlert/jquery.alerts.js" type="text/javascript"></script>
		
	</body>

</html>