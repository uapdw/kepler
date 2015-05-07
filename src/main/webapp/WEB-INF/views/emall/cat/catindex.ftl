<a href="javascript:loadTreeData();">加载测试</a>
<div class="row">
    <div class="col-xs-6 col-md-4">
		<div class="tree" id="ex-tree-basic" style="width:100%;height:400px;margin-left:10px;"></div>
    </div>
    <div class="col-xs-12 col-md-8">
    	<div id="catItemForm" style="border:1px solid gray;margin-right:10px;height:400px;overflow:auto;">
        	.col-xs-12 .col-md-8
        </div>
    </div>
</div>
<script type="text/javascript">
	var treeDatas = [];
	
	$(function(){
		loadTreeData();
	
		p0 = {
			id:"root0",
			pid:"root",
			title:"树",
			href:"javescript: alert('');"
		};
		
		p0.children = treeDatas;
		treeData.push(p0);
		
		
		tree111 = $('#ex-tree-basic').tree({
			data: treeData,
			loadingHTML: '<div class="static-loader">Loading...</div>',
			multiSelect: false,
			cacheItems: true,
			useChkBox:true
		});
	});
	
	function loadTreeData(){
		$.ajax( { 
            type : "GET", 
            url : "${ctx}/emall/cat/tree", 
            data : "parentNodeCode=-1", 
            dataType: "json", 
            success : function(data) { 
            	processTreeData(data);
            } 
        }); 			
	}
	
	function processTreeData(jsonData){
		// $("#catItemForm").html(JSON.stringify(data));
		var treeNodesDatas = [];
		$(jsonData).each(function(i){
			debugger;
			var item = {};
			item.pid = this.parentCode;
			item.id = this.catCode;
			item.title = this.catName;
			item.href="#";
			item.children = [];
			
			treeNodesDatas.push(item);
		});
		
		treeDatas = treeNodesDatas;
	}
</script>