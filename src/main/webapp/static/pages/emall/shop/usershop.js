define([ 'jquery', 'knockout', 'text!static/pages/emall/shop/usershop.html',
		'jquery.file.upload' ], function($, ko, template) {
	var viewModel = {
		shop : ko.observable({})
	}

	viewModel.submitForm = function() {

		var saveUrl = $ctx + '/emall/shop/create';
		if (viewModel.shop().id != 0) {
			saveUrl = $ctx + '/emall/shop/update';
		}
		// alert(JSON.stringify(viewModel.data()));
		$.ajax({
			type : 'POST',
			contentType : 'application/json',
			url : saveUrl,
			data : JSON.stringify(viewModel.shop()),
			dataType : 'json',
			success : function(data) {
				if (data != null) {
					jAlert("保存成功!", "提示");
				}
			},
			error : function(req, textStatus, errorThrown) {
				if (req.responseJSON) {
					var validateObj = req.responseJSON;
					if (validateObj.code) {
						q
						jAlert(validateObj.code, "错误");
					}
				}
				// jAlert("保存失败!","错误");
			}
		});
	}

	var loadData = function() {
		var shopid = 1411;
		var infoUrl = $ctx + '/emall/shop/update/' + shopid;
		$.ajax({
			type : 'GET',
			url : infoUrl,
			dataType : 'json',
			success : function(data) {
				viewModel.shop(data);
			},
			error : function() {
				jAlert("获取详细信息失败!", "错误");
			}
		});
	}

	var init = function(id) {
		var url = 'file/upload/image';
		var downurl = 'file/down/image/'

		loadData();

		$('#fileupload').fileupload({
			url : url,
			dataType : 'json',
			done : function(e, data) {
				$('#progress').hide();
				var d = viewModel.shop();
				d.shopLogo = downurl + data.result;
				viewModel.shop(d);
			},
			progressall : function(e, data) {
				var progress = parseInt(data.loaded / data.total * 100, 10);
				$('#progress .progress-bar').css('width', progress + '%');
			}
		});

	}

	return {
		'model' : viewModel,
		'template' : template,
		'init' : init
	};
});