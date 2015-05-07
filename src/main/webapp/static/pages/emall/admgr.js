define(['jquery', 'knockout', 'text!static/pages/emall/admgr.html', 'jquery.file.upload'], function($, ko, template) {
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
		var url = 'file/upload/image';
		$('#fileupload').fileupload({
				url: url,
				dataType: 'json',
				done: function(e, data) {
					alert('上传完成')
					$('#progress').hide();
				},
				progressall: function(e, data) {
					var progress = parseInt(data.loaded / data.total * 100, 10);
					$('#progress .progress-bar').css(
						'width',
						progress + '%'
					);
				}
			});


		//_model.datas([{'name':'a','age':3},{'name':'a','age':3}]);
		//		loadData(0);
	}
	return {
		'model': _model,
		'template': template,
		'init': init
	};
});