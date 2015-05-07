define([ 'jquery', 'knockout', 'text!static/pages/emall/shopgoods/goodrelease.html','jquery.file.upload'],
		function($, ko, template) {
		var viewModel = {
				good : ko.observable({})
		}
		
		viewModel.submitForm = function(){
			var saveUrl = $ctx + '/emall/shopgoods/create';
			if(viewModel.good().id != 0){
				saveUrl = $ctx + '/emall/shopgoods/update';
			} 
			//alert(JSON.stringify(viewModel.data()));
			$.ajax({
				type: 'POST',
				contentType: 'application/json', 
				url: saveUrl,
				data: JSON.stringify(viewModel.good()),
				dataType: 'json',
				success: function(data) {
					//alert(JSON.stringify(data));
					if(data!=null){
						jAlert("保存成功!","提示");
					}
				},
				error: function(req, textStatus, errorThrown){
					if(req.responseJSON){
						var validateObj = req.responseJSON;
						if(validateObj.code){q
							jAlert(validateObj.code,"错误");
						}
					} 
					//jAlert("保存失败!","错误");
				}
			});
		}
	
		var loadData = function(id) {
			var infoUrl = $ctx + '/emall/shopgoods/create';
			if(id && id!=0){
				infoUrl = $ctx + '/emall/shopgoods/update/' + id;
			}
			$.ajax({
				type: 'GET',
				url: infoUrl,
				dataType: 'json',
				success: function(data) {
					viewModel.good(data);
				},
				error: function() {
					jAlert("获取详细信息失败!","错误");
				}
			});
		}
	
		var init = function(id) {
			var url = 'file/upload/image';
			var downurl = 'file/down/image/'
			loadData(id);
			$('#fileupload').fileupload({
					url: url,
					dataType: 'json',
					done: function(e, data) {
						$('#progress').hide();
						var d = viewModel.good();
						d.imgLarge = downurl + data.result ;
						viewModel.good(d);
					},
					progressall: function(e, data) {
						var progress = parseInt(data.loaded / data.total * 100, 10);
						$('#progress .progress-bar').css(
							'width',
							progress + '%'
						);
					}
				});
			
		}
		
		return {
			'model' : viewModel,
			'template' : template,
			'init' : init
		};
	});