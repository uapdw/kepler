define(
		[ 'jquery', 'knockout', 'text!static/pages/ae/publish/publish.html' ],
		function($, ko, template) {

			var infoUrl = "/ae/publish/publish";

			// 添加详细信息页路由
			addRouter(infoUrl);

			var publishViewModel = {
			}

			var init = function() {
			}
			return {
				'model' : publishViewModel,
				'template' : template,
				'init' : init
			};

		});