define([ 'jquery', 'knockout', 'text!static/pages/mgr/advert/checkinfo.html' ,'jquery.file.upload'],
		function($, ko, template) {
			var viewModel = {
				data : ko.observable({})
			}
			viewModel.submitForm = function() {

				var id = viewModel.data().id;
				var approveUrl = $ctx + '/mgr/advert/approve/' + id;
				
				$.ajax({
					type : 'POST',
					contentType : 'application/json',
					url : approveUrl,
					data : JSON.stringify(viewModel.data()),
					dataType : 'json',
					success : function(data) {
						if (data) {
							jAlert("审核成功!", "提示");
						} else {
							jAlert("审核失败!", "错误");
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
					}
				});

			}

			var loadData = function(id) {
				var infoUrl = $ctx + '/mgr/advert/update/' + id;
				$.ajax({
					type : 'GET',
					url : infoUrl,
					dataType : 'json',
					success : function(data) {
						viewModel.data(data);
					},
					error : function() {
						jAlert("获取详细信息失败!", "错误");
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
						var d = viewModel.data();
						d.image = downurl + data.result ;
						viewModel.data(d);
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