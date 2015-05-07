define([ 'jquery', 'knockout', 'text!static/pages/emall/demo/demolist.html' ], function($, ko, template) {

	var infoUrl = "/emall/demo/demoinfo/:id";
	
	var addUrl = '/emall/demo/demoinfo/0';
	
	var deleteUrl = '/emall/demo/delete/';
	
	var pageUrl = '/emall/demo/page?page=';

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