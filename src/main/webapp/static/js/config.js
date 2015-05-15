require.config({
	baseUrl: ".",
	paths: {
		text: "static/lib/requirejs/text",
		css: "static/lib/requirejs/css",
		jquery: "static/lib/jquery/jquery-1.11.2",
		knockout: "static/lib/knockout/knockout-3.2.0.debug",
		'u.base': "static/lib/uui/js/u.base",
		'u.ext': "static/lib/uui/js/u.ext",
		'u.grid': "static/lib/uui/js/u.grid",
		'u.tree':"static/lib/uui/js/u.tree",
		wizard:"static/lib/jquery-bootstrap-wizard/jquery.bootstrap.wizard",
		director:"static/lib/director/director",
		'jquery.file.upload' : "static/lib/juqery-file-upload/9.9.2/js/jquery.fileupload",
		'jquery.ui.widget':"static/lib/jquery-ui/jquery.ui.widget",
		'jquery.iframe.transport':"static/lib/jquery-iframe-transport/jquery.iframe-transport",
		echarts:"static/lib/echarts/echarts-all",
		
		'solr.core':"static/lib/ajax-solr-master/core/Core",
		'AbstractManager':"static/lib/ajax-solr-master/core/AbstractManager",
		'manager.jquery':"static/lib/ajax-solr-master/managers/Manager.jquery",
		'Parameter':"static/lib/ajax-solr-master/core/Parameter",
		'ParameterStore':"static/lib/ajax-solr-master/core/ParameterStore",
		'AbstractWidget':"static/lib/ajax-solr-master/core/AbstractWidget",
		'utils':"static/lib/ajax-solr-master/utils",
		'bootstrap.min':"static/lib/ajax-solr-master/bootstrap.min",
		'docs.min':"static/lib/ajax-solr-master/docs.min",
		'jquery-ui.min':"static/lib/ajax-solr-master/jquery-ui.min",
	},
	shim: {
		'u.base':{
			deps: ["jquery"]
		},
		'u.ext':{
			deps: ["jquery"]
		},
		'u.grid':{
			deps: ["jquery"]
		},
		'u.tree':{
			deps: ["jquery"]
		},
		'jquery.file.upload':{
			deps: ["jquery","jquery.ui.widget","jquery.iframe.transport","css!static/lib/juqery-file-upload/9.9.2/css/jquery.fileupload.css"]
		}
	}
});
