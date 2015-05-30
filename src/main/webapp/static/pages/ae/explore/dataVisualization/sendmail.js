define(
		[ 'jquery', 'knockout', 'text!static/pages/ae/explore/dataVisualization/sendmail.html'],
		function($, ko, template) {

			var dsViewModel = {

			}
			
			var init = function() {
				
			}
			return {
				'model' : dsViewModel,
				'template' : template,
				'init' : init
			};
		});