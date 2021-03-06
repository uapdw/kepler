define([ 'jquery', 'knockout', 'text!static/pages/emall/shop/registershoplist.html' ], function($, ko, template) {

 var infoUrl = "/emall/shop/shopinfo/:id";
	
	var addUrl = '/emall/shop/shopinfo/0';
	
	var deleteUrl = '/emall/shop/delete/';
	
	var pageUrl = '/emall/shop/page?page=';
	
	var checkUrl = '/emall/shop/checkinfo';

	// 添加详细信息页路由
	addRouter(infoUrl);
	
	addRouter(checkUrl+"/:id");
	
	var controller = {
		infoUrl : infoUrl,
		addUrl : addUrl,
		deleteUrl : deleteUrl,
		pageUrl : pageUrl
	};
	
	viewModel =  new baseViewModel(controller);

	viewModel.shopTitle = ko.observable("");
	viewModel.email = ko.observable("");
	viewModel.phone = ko.observable("");
	viewModel.companyName = ko.observable("");
	viewModel.status = ko.observable("");
	viewModel.load = function(pageIndex){
		$.ajax({
			type : 'GET',
			url : $ctx + this.pageUrl + pageIndex + "&shopTitle=" + this.shopTitle() + "&email=" + this.email() +"&companyName=" + this.companyName()+ "&phone=" + this.phone()+ "&status=0" + this.status() ,
			data : '',
			dataType : 'json',
			success : function(data) {
				viewModel.setData(data);
				$("#pagination").pagination({
					totalPages : viewModel.data.totalPages(),
					currentPage : viewModel.data.number(),
					page : function(page) {
						viewModel.load(page);
					}
				})							
			}
		});
		
	}
	
	viewModel.check = function(){
		window.router.setRoute(checkUrl + "/" + this.id);	
	}
	
	var init = function() {
		var pageNum = viewModel.data.number();
		if(pageNum > 0){
			viewModel.load(pageNum);
		} else {
			viewModel.load(1);
		}
	};
	
	return {
		'model' : viewModel,
		'template' : template,
		'init' : init
	};

});