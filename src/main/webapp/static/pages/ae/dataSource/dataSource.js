define(
		[ 'jquery', 'knockout', 'text!static/pages/ae/dataSource/dataSource.html' ],
		function($, ko, template) {

			var infoUrl = "/ae/dataSource/dataSource";

			// 添加详细信息页路由
			addRouter(infoUrl);

			var dsViewModel = {
					showinfo : ko.observable("")
			}
			
			dsViewModel.show = function() {
				$.ajax({
					type : 'GET',
					dataType : 'text',
					data : '',
					url : 'ae/datasource/show',
					success : function(data) {
						dsViewModel.showinfo(data);
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						jAlert(errorThrown, "错误");
					},
				});
			}

			var init = function() {
			}
			return {
				'model' : dsViewModel,
				'template' : template,
				'init' : init
			};

		});