define(['jquery', 'knockout', 'text!static/pages/emall/category/catindex.html'], function($, ko, template) {
	
	var infoUrl = "/emall/category/categoryinfo/:id";
	
	var addUrl = '/emall/category/categoryinfo/0';
	
	var deleteUrl = '/emall/cat/delete/';
	
	var pageUrl = '/emall/cat/page?page=';

	// 添加详细信息页路由
	addRouter(infoUrl);

	var viewModel = $.extend(true,{}, app.baseModel,{
		infoUrl : infoUrl,
		addUrl : addUrl,
		deleteUrl : deleteUrl,
		pageUrl : pageUrl
	});
	
	var init = function() {
		viewModel.load(1);
	}
	return {
		'model' : viewModel,
		'template' : template,
		'init' : init
	};
});