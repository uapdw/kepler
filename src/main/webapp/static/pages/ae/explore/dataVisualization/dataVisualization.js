define(
		[ 'jquery', 'knockout',
				'text!static/pages/ae/explore/dataVisualization/dataVisualization.html' ],
		function($, ko, template) {
			var exploreViewModel = {}
			
			var inited = false;

			var init = function() {
				inited = true;
			}
			return {
				'model' : exploreViewModel,
				'template' : template,
				'init' : init,
				'inited' : inited
			};
		});