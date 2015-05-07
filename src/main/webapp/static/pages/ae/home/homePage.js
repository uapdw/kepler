define([ 'jquery', 'knockout', 'text!static/pages/ae/home/homePage.html' ],
		function($, ko, template) {

			var infoUrl = "/ae/home/homePage";

			// 添加详细信息页路由
			addRouter(infoUrl);

			var homeViewModel = {
				info : ko.observable("")
			}

			var init = function() {
				$.ajax({
					type : 'GET',
					dataType : 'json',
					data : {
						param : "uap"
					},
					url : 'ae/homepage/initInfo',
					success : function(data) {
						homeViewModel.info(data["name"] + " from "
								+ data["city"]);
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						jAlert(errorThrown, "错误");
					},
				});
			}
			return {
				'model' : homeViewModel,
				'template' : template,
				'init' : init
			};

		});