define(
		[ 'jquery', 'knockout', 'text!static/pages/ae/explore/explore.html' ],
		function($, ko, template) {

			var infoUrl = "/ae/explore/explore";

			// 添加详细信息页路由
			addRouter(infoUrl);

			var exploreViewModel = {
			}

			var init = function() {
			}
			return {
				'model' : exploreViewModel,
				'template' : template,
				'init' : init
			};

		});