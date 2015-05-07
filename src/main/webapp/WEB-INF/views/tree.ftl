<!DOCTYPE html>
<html>

	<head>
		<meta http-equiv="content-type" content="text/html;charset=UTF-8" />
		<meta charset="utf-8" />
		<title>tree</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<meta content="" name="description" />
		<meta content="" name="author" />

		<link href="${ctx}/static/lib/uui/css/u.min.css" rel="stylesheet">
<script src="${ctx}/static/lib/jquery/jquery-1.11.2.js"></script>
	</head>

	<body>
<p></p><p></p>
<div class="container">
	<div class="tree" id="ex-tree-basic"></div>
</div>
<script type="text/javascript">
$(function(){
var treeData = [];
for(var i=1;i<=100;i++){
	var p1 = {};
	p1.pid = "root";
	p1.id = "" + i;
	p1.title = "节点" + i;
	p1.href="#";
	p1.children = [];
	for(var j=1;j<=10;j++){
		var child = {};
		child.pid = i;
		child.title = "节点" + i * 100 + j;
		child.id = "" + i * 100 + j;
		child.href = "#";
		child.children = [];
		
		p1.children.push(child);
	}
	
	treeData.push(p1);
}	
	
	
	$('#ex-tree-basic').tree({
		data: treeData,
		loadingHTML: '<div class="static-loader">Loading...</div>',
		multiSelect: true,
		cacheItems: true,
		useChkBox:true
	});
})

function onSelect(obj){
	console.info(obj);
}
</script>

		
		<script src="${ctx}/static/lib/uui/js/u.js"></script>
	</body>

</html>