define(['jquery', 'knockout', 'text!static/pages/emall/brand/brandlist.html'], function($, ko, template) {
	
	var infoUrl = "/emall/brand/brandinfo/:id";
	
	//添加详细信息页路由
	addRouter(infoUrl);
	
	var brandViewModel = {
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
	
	brandViewModel.addBrand = function() {
	window.router.setRoute('/emall/brand/brandinfo/0');
	};
	
	// 删除
	brandViewModel.removeBrand = function() {
	var id = this.id;
		var name = this.brandName;
		
		var result = brandViewModel.deleteById(id);
		if( result != null && result){
			jAlert("删除成功!", "提示");
			var pageNum = brandViewModel.pageinfo.number();
			brandViewModel.pageinfo.content.remove(this);
			loadData(pageNum);
		}
	};
	
	// 推荐
	brandViewModel.recommend = function() {
		var id = this.id;
		var name = this.goodName;
		$.ajax({
			type : 'GET',
			dataType : 'json',
			async : false,
			url : $ctx + '/mgr/advert/recommend/' + id + '?type=' + 3,
			success : function(data) {
				if (data) {
					 alert("推荐成功!");
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				jAlert("调用推荐服务报错!!", "错误");
				// alert("调用删除服务报错!");
			},
		});

	};
	
	brandViewModel.deleteById = function(deleteId) {
		var result = null;
		$.ajax({
			type: 'DELETE',
			dataType: 'json',
			async: false,
			url: $ctx + '/emall/brand/delete/'+deleteId,
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
	brandViewModel.showBrandInfo = function(){
	
		debugger;
		window.router.setRoute(infoUrl);
	};
	
	
	brandViewModel.searchPage = function() {
		loadData(1);
	};
	
	brandViewModel.loadNextPage = function() {
		loadData(brandViewModel.pageinfo.number() + 1);
	};
	
	brandViewModel.loadLastPage = function() {
		loadData(brandViewModel.pageinfo.number() - 1);
	};
	
	loadData = function(pageindex) {
		$.ajax({
			type: 'GET',
			url: $ctx + '/emall/brand/page?page=' + pageindex + "&searchText=" + brandViewModel.searchText(),
			data: '',
			dataType: 'json',
			success: function(data) {
				brandViewModel.pageinfo.content(data.content);
				
				brandViewModel.pageinfo.number(data.number + 1 );
			}
		});
	};
	
	var init = function() {
		$("#brandpagenition").pagination({
			totalPages: 20,
			currentPage: 1,
			page: function(page) {
				loadData(page);
			}
		})		
		loadData(1);
	}
	
	return {
		'model': brandViewModel,
		'template': template,
		'init':init
	};
});