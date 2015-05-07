define([ 'jquery', 'knockout', 'text!static/pages/mgr/function/functionlist.html' ], function($, ko, template) {

	var infoUrl = "/mgr/function/functioninfo/:id";
	
	var addUrl = '/mgr/function/functioninfo/0';
	
	var deleteUrl = '/mgr/function/delete/';
	
	var pageUrl = '/mgr/function/page?page=';

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