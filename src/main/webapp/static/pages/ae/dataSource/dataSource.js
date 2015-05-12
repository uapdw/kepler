define(
		[ 'jquery', 'knockout', 'text!static/pages/ae/dataSource/dataSource.html', 'jquery.file.upload'],
		function($, ko, template) {

			var infoUrl = "/ae/dataSource/dataSource";

			// 添加详细信息页路由
			addRouter(infoUrl);

			var dsViewModel = {

			}

			var init = function() {
				var uploadUrl = 'ae/dataSource/upload';
				$('#fileupload').fileupload({
					url: uploadUrl,
					dataType: 'json',
					done: function(e, data) {
						if(data.result.msg == 'success'){
							$('#uploadmsg').removeClass().addClass("alert alert-success");
							$('#uploadmsg').html("上传成功");
							$('#uploadmsg').show();
						}else{
							$('#uploadmsg').removeClass().addClass("alert alert-danger");
							$('#uploadmsg').html("上传失败");
							$('#uploadmsg').show();
						}
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
				'model' : dsViewModel,
				'template' : template,
				'init' : init
			};
		});