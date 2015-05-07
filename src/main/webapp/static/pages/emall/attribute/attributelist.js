define(['jquery', 'knockout', 'text!static/pages/emall/attribute/attrindex.html'], function($, ko, template) {
	
	var infoUrl = "/emall/attribute/attributeinfo/:id";
	
	//添加详细信息页路由
	addRouter(infoUrl);
	
	var attrViewModel = {
		pageinfo : {
			content: ko.observableArray([]),
			firstPage : ko.observable(true),
			lastPage : ko.observable(false),
			totalPages : ko.observable(0),
			totalElements : ko.observable(0),
			last : ko.observable(false),
			size : ko.observable(10),
			number : ko.observable(0),
			numberOfElements : ko.observable(10),
			first : ko.observable(true)
		},
		searchText : ko.observable("")
	}
	
	attrViewModel.addAttribute = function() {
		window.router.setRoute('/emall/attribute/attributeinfo/0');
	};
	
	// 删除
	attrViewModel.removeAttribute = function() {
		var id = this.id;
		var name = this.attrName;
		
		var result = attrViewModel.deleteById(id);
		if( result != null && result){
			jAlert("删除成功!", "提示");
			var pageNum = attrViewModel.pageinfo.number();
			attrViewModel.pageinfo.content.remove(this);
			loadData(pageNum);
		}
	};
	
	attrViewModel.showAttributeInfo = function(){
		//jAlert(this.id);
		debugger;
		window.router.setRoute(infoUrl);
	};
	
	attrViewModel.deleteById = function(deleteId) {
		var result = null;
		$.ajax({
			type: 'DELETE',
			dataType: 'json',
			async: false,
			url: $ctx + '/emall/attr/delete/'+deleteId,
			success: function(data) {
				if(data){
					result = data;
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				jAlert("调用删除服务报错!!", "错误");
				//alert("调用删除服务报错!");
            },
		});
		return result;
	};
	
	attrViewModel.searchPage = function() {
		loadData(1);
	};
	
	attrViewModel.loadNextPage = function() {
		loadData(attrViewModel.pageinfo.number() + 1);
	};
	
	attrViewModel.loadLastPage = function() {
		loadData(attrViewModel.pageinfo.number() - 1);
	};
	
	var loadData = function(pageindex) {
		$.ajax({
			type: 'GET',
			url: $ctx + '/emall/attr/page?page=' + pageindex + "&searchText=" + attrViewModel.searchText(),
			data: '',
			dataType: 'json',
			success: function(data) {
				attrViewModel.pageinfo.content(data.content);
				// alert(data.number);
				attrViewModel.pageinfo.number(data.number + 1 );
			}
		});
	}

	var init = function() {
		$("#attrpagenition").pagination({
			totalPages: 20,
			currentPage: 1,
			page: function(page) {
				loadData(page);
			}
		})		
		loadData(1);
	}
	return {
		'model': attrViewModel,
		'template': template,
		'init':init
	};
});