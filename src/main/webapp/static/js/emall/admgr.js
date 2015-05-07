define(['jquery', 'knockout', 'text!static/js/emall/admgr.html'], function($, ko, template) {
	debugger;
	var _model = {
		datas: ko.observableArray([])
	}
	

	var loadData = function(index) {
		$.ajax({
			type: 'GET',
			url: $ctx + '/emall/admgr/ad?page=' + index,
			data: '',
			dataType: 'json',
			success: function(data) {
				_model.datas(data);
			}
		});
	}

	var init = function() {
		
		//_model.datas([{'name':'a','age':3},{'name':'a','age':3}]);
		loadData(0);
	}
	return {
		'model': _model,
		'template': template,
		'init':init
	};
});