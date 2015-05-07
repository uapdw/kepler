define([ 'jquery', 'knockout', 'text!static/pages/emall/admgr/admgrinfo.html' ,'jquery.file.upload'],
		function($, ko, template) {
			var viewModel = {
				data : ko.observable({}),
				submitForm : function() {
					var saveUrl = $ctx + '/emall/admgr/create';
					if (this.data().id && this.data().id != 0)
						saveUrl = $ctx + '/emall/admgr/update';
					$.ajax({
						type : 'POST',
						contentType : 'application/json',
						url : saveUrl,
						data : JSON.stringify(viewModel.data()),
						dataType : 'json',
						success : function(data) {
							if (data != null) {
								jAlert("保存成功!", "提示");
							}
						},
						error : function() {
							jAlert("保存失败!", "错误");
						}
					});
				}
			}

			var loadData = function(id) {
				var infoUrl = $ctx + '/emall/admgr/create';
				if (id && id != 0) {
					infoUrl = $ctx + '/emall/admgr/update/' + id;
				}
				$.ajax({
					type : 'GET',
					url : infoUrl,
					dataType : 'json',
					success : function(data) {
//						data.sendFlag=data.sendFlag.toString();
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
							d.href = downurl + data.result ;
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