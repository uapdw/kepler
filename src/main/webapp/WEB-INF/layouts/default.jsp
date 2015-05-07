<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="sitemesh" uri="http://www.opensymphony.com/sitemesh/decorator" %>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
<title><sitemesh:title/></title>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<!--<meta name="viewport" content="width=device-width, initial-scale=1">-->

		<link href="${ctx}/static/bootstrap/3.3.1/css/bootstrap.min.css" rel="stylesheet">
		<link rel="stylesheet" href="${ctx}/static/styles/common.css">
		<link rel="stylesheet" href="${ctx}/static/styles/index.css">
		<script src="${ctx}/static/jquery/jquery-1.11.2.js"></script>
	</head>


<sitemesh:head/>
</head>

<body>
		<%@ include file="/WEB-INF/layouts/header.jsp"%>
		<div class="container bs-docs-container" id="content"  style="padding-top:70px;">
			<sitemesh:body/>
		</div>
		<%@ include file="/WEB-INF/layouts/footer.jsp"%>
</body>		
</html>