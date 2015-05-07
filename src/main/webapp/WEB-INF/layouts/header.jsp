<%@ page language="java" pageEncoding="UTF-8" %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
		<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
			<c:set var="ctx" value="${pageContext.request.contextPath}" />
			<div class="navbar navbar-static-top bs-docs-nav header" id="top" role="banner">
				<div class="container">
					<div class="navbar-header">
						<button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target=".bs-navbar-collapse">
							<span class="sr-only">Toggle navigation</span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</button>
						<dl class="top-left" style="padding-top: 18px;">
							<dt>
				                <a href="${ctx}" class="logo-1"><img src="${ctx}/static/images/logo_06.jpg" width="124" height="36" style="display: inline-block; height: 36px;"></a>
				                <i class="i"></i>
				                <a href="${ctx}" class="logo-1"><img src="${ctx}/static/images/logo_03.jpg" width="124" height="36" style="display: inline-block; height: 36px;"></a>
            				</dt>
							<dd>
								<div class="location" style="width: inherit;height: inherit;border: none;">北京站</div>
							</dd>
						</dl>
					</div>
					<div class="collapse navbar-collapse bs-navbar-collapse" role="navigation">
						<ul class="nav navbar-nav">
							<li id="design">
								<a href="../getting-started/">设计</a>
								<div class="sub-nav" style="height: 0px;">
									<div class="inner">
										<ul class="list cf">
											<li><a href="http://jia.juran.cn/sheji/design_effect.htm">找灵感</a>
											</li>
											<li><a href="http://jia.juran.cn/sheji/designerlist.htm">找设计师</a>
											</li>
											<li><a href="http://jia.juran.cn/sheji/nowtopicinfo.htm">热门话题</a>
											</li>
											<li><a href="http://jia.juran.cn/sheji/tender_detail_list.htm ">招标公告</a>
											</li>
											<li><a href="http://jia.juran.cn/sheji/knowledge_list.htm">家装课堂</a>
											</li>
										</ul>
									</div>
								</div>
							</li>
							<li id="diy">
								<a href="../css/">DIY</a>
							</li>
							<li id="decoration">
								<a href="../components/">装修</a>
							</li>
							<li id="mall">
								<a href="${ctx}/mall">商城</a>
							</li>
						</ul>
						<div class="nav navbar-nav navbar-right">
							<div class="form-group search-input">
								<div class="input-group">
									<input class="form-control" placeholder="欧式">
									<div class="input-group-addon glyphicon glyphicon-search" style="top: 0px;"></div>
								</div>
							</div>
							<p class="top-user-entrance">
								<a href="${ctx}/member/login">登录</a>
								<span class="s-line"></span>
								<a href="${ctx}/member/regist">注册</a>
							</p>
						</div>
					</div>
				</div>
			</div>