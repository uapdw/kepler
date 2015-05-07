<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<link href="${ctx}/static/lib/uui/css/u.css" rel="stylesheet">
	<link href="${ctx}/static/css/index.css" rel="stylesheet">	
	<title>cate list</title>
</head>
	<body>
		<div style="text-align:right;margin:10px;">
			<form class="form-search" action="#">
				<input type="text" name="search_LIKE_title" class="input-medium" value="${param.search_LIKE_title}">&nbsp;&nbsp;
				<button type="submit" class="btn" id="search_btn">Search</button>
		    </form>
	    </div>
		<div class="table-responsive" style="margin:10px;">
			<table id="contentTable" class="table table-bordered table-condensed table-hover">
				<thead>
					<tr>
						<th>编码</th>
						<th>名称</th>
						<th>名称</th>
						<th>描述</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
				<c:forEach items="${cateList.content}" var="category">
					<tr>
						<td><a href="#">${category.catCode}</a></td>
						<td><a href="#">${category.catName}</a></td>
						<td><a href="#">${category.catName}</a></td>
						<td><a href="#">${category.catDesc}</a></td>
						<td><a href="${ctx}/emall/cate/delete?cateId=${category.id}">删除</a></td>
					</tr>
				</c:forEach>
				</tbody>
			</table>
		</div>
		<div style="text-align:center">
			<tags:pagetag page="${cateList}" paginationSize="10" url="emall/cat"/>			
		</div>
	</body>
</html>