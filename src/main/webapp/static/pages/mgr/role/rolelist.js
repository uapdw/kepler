define([ 'jquery', 'knockout', 'text!static/pages/mgr/role/rolelist.html' ], function($, ko, template) {

	var infoUrl = "/mgr/role/roleinfo/:id";
	
	var addUrl = '/mgr/role/roleinfo/0';
	
	var deleteUrl = '/mgr/role/delete/';
	
	var pageUrl = '/mgr/role/page?page=';

	// 添加详细信息页路由
	addRouter(infoUrl);
	
	var controller = {
		infoUrl : infoUrl,
		addUrl : addUrl,
		deleteUrl : deleteUrl,
		pageUrl : pageUrl
	}
	
	viewModel =  new baseViewModel(controller);
	
	var init = function() {
		var pageNum = viewModel.data.number();
		if(pageNum > 0){
			viewModel.load(pageNum);
		} else {
			viewModel.load(1);
		}
	}
	
	return {
		'model' : viewModel,
		'template' : template,
		'init' : init
	};

});