require(['jquery', 'knockout', 'u.base', 'u.ext', 'u.grid', 'u.tree', 'director'], function($, ko) {

	window.addRouter = function(path, func) {

		var pos = path.indexOf('/:')
		var truePath = path
		if (pos != -1)
			truePath = path.substring(0,pos)
		
		func = func || function() {
			var params = arguments						
			initPage('static/pages/ae' + truePath + truePath,params)
			
		}
		
		router.on(path, func)
	}

	window.router = Router();
	
//	window.router.init();
	
	initMenuTree = function(){
		$('#show_side').click(function() {
			var $leftpanel = $('.leftpanel');
			//展开
			if ($leftpanel.hasClass('leftpanel-collapse')) {
				$leftpanel.removeClass('leftpanel-collapse')
				$('.content').removeClass('content-collapse')
				$('.left-menu').children('li').children('a').children('.title').show();
				$('.left-menu').children('li').children('a').children('.arrow').show();
			} else {
				//合闭
				$leftpanel.addClass('leftpanel-collapse')
				$('.content').addClass('content-collapse')
				$('.left-menu').children('li').children('a').children('.title').hide();
				$('.left-menu').children('li').children('a').children('.arrow').hide();
				$('.left-menu').children('li.open').children('a').children('.arrow').removeClass('open').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-left');
				$('.left-menu').children('li.open').children('a').children('.arrow').removeClass('active');
				$('.left-menu').children('li.open').children('.sub-menu').slideUp(200);
			}
		});

		$('.left-menu li > a').on('click', function(e) {
			if ($(this).children('.title').length > 0 && !$(this).children('.title').is(':visible')) {
				$('#show_side').click();
			}
			if ($(this).next().hasClass('sub-menu') === false) {
				return;
			}
			var parent = $(this).parent().parent();
			parent.children('li.open').children('a').children('.arrow').removeClass('open').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-left');
			parent.children('li.open').children('a').children('.arrow').removeClass('active');
			parent.children('li.open').children('.sub-menu').slideUp(200);
			parent.children('li').removeClass('open');
			//  parent.children('li').removeClass('active');

			var sub = $(this).next();
			if (sub.is(":visible")) {
				$('.arrow', $(this)).removeClass("open").removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-left');
				$(this).parent().removeClass("active");
				sub.slideUp(200);
			} else {
				$('.arrow', $(this)).addClass("open").removeClass('glyphicon-chevron-left').addClass('glyphicon-chevron-down');
				$(this).parent().addClass("open");
				sub.slideDown(200);
			}

			e.preventDefault();
		})		
	}
	
	$(function(){
		$.ajax({
			type : 'GET',
			url : $ctx + "/mgr/function/rootmenu",
			data : '',
			dataType : 'json',
			success : function(data) {
				initFuncTree(data);
				window.router.init();
				
			}
		});
		require(['static/pages/ae/homePage/homePage.js'], function(module) {
			app.baseModel.data.content = ko.observableArray([]);
			ko.cleanNode($('.content')[0]);
			
			$('.content').html('');
			$('.content').html(module.template);
			
			ko.applyBindings(module.model, $('.content')[0]);
			module.init();
		})
	})
	
	initFuncTree = function(menuData){
		if(menuData.id == 0){
			var rootMenuArray = menuData.children;
			
			//var liObj = $("<li class=''");
			var liObj = $("<li class='' style='border-bottom:1px solid #FFFFFF'>");
			var aObj = $("<a href='#/homePage'> <i class='fa fa-file-text'>" +
					"</i> <span class='title'  style=\"color:#555;font-family: 微软雅黑,宋体; font-size: 0.9em\">首页</span> <span class='arrow glyphicon glyphicon-chevron-left'></span> </a>");
			//var aObj = $("<a href='#/ae/home/homePage'> <i class='fa fa-file-text'>" +
					//"</i> <span class='title'>首页</span> <span class='arrow glyphicon glyphicon-chevron-left'></span> </a>");
			$(liObj).append(aObj);
			$(".left-menu").append(liObj);
			
			for (var i = 0; i < rootMenuArray.length; i++) {
				var menu = rootMenuArray[i];
				var liObj = $("<li class=\"\">");
				//var aObj = $("<a href=\"javascript:;\"> <i class=\"fa fa-file-text\"></i> <span class=\"title\">"+menu.funcName+"</span> <span class=\"arrow glyphicon glyphicon-chevron-left\"></span> </a>");
				var aObj = $("<a href=\"javascript:;\"> <i class=\"fa fa-file-text\"></i> <span class=\"title\" style=\"color:#555;  font-size: 0.9em;font-family: 微软雅黑,宋体\">"+menu.funcName+"</span> <span class=\"arrow glyphicon glyphicon-chevron-left\"></span> </a>");
				//var ulObj = $("<ul class=\"sub-menu\">");
				var ulObj = $("<ul class=\"sub-menu\" style=\"background-color:#E7E7E7;padding-top:0px\">");
				if(menu.children.length > 0){
					for (var j = 0; j < menu.children.length; j++) {
						var subMenuObj = menu.children[j];
						//var subLiObj = $("<li> <a href=\"#"+ subMenuObj.funcUrl +"\">"+ subMenuObj.funcName +"</a> </li>");
						var subLiObj = $("<li style=\"border-top:1px solid #FFFFFF; line-height: 32px;\"> <a href=\"#"+ subMenuObj.funcUrl +"\" style=\"color:#555;  font-size: 0.9em;font-family: 微软雅黑,宋体\">"+ subMenuObj.funcName +"</a> </li>");
						$(ulObj).append(subLiObj);
						
//						recursionInitTreeNode($(ulObj), subMenuObj);
					}
				}
				
				$(liObj).append(aObj).append(ulObj);
				$(".left-menu").append(liObj);
			}
		}
		initMenuTree();
		
		// huoqi
		addRouter("/homePage");
		
		$('.left-menu').find("a[href*='#']").each(function() {
			var path = this.hash.replace('#', '');
			addRouter(path);
		});
		
	}
	
	function recursionInitTreeNode(parentNode, nodeData) {
		var liObj = $("<li class=\"\">");
		var aObj = $("<a href=\"#\">" + nodeData.funcName + "</a>");
		var ulObj = $("<ul class=\"\">");
		if (nodeData.children.length > 0) {
			for (var j = 0; j < nodeData.children.length; j++) {
				var subMenuObj = nodeData.children[j];
				recursionInitTreeNode(ulObj, subMenuObj);
			}
		}
		$(liObj).append(aObj).append(ulObj);
		parentNode.append(liObj);
	}

	function initPage(p, params) {
		var module = p;
		
		if (params.length == 1)
			params = params[0]	
		debugger;
		require([module], function(module) {
			app.baseModel.data.content = ko.observableArray([]);
			ko.cleanNode($('.content')[0]);
			
			//if(module != app.lastHash  || params.length == 0){
			//app.lastHash = module;
			$('.content').html('');
			//			if (window._oldModel)
			//				ko.removeNode(window._oldModel)
			$('.content').html(module.template);
//			$('.content').find('input, textarea').placeholder({customClass:'placeholder'});
			//			window._oldModel = module.model;
			//}
			ko.applyBindings(module.model, $('.content')[0]);
			module.init(params);
			
		})
	}

	window.app = {};
	
	app.baseModel = {
		data : {
			content : ko.observableArray([]),
			firstPage : ko.observable(true),
			lastPage : ko.observable(false),
			totalPages : ko.observable(0),
			totalElements : ko.observable(0),
			last : ko.observable(false),
			size : ko.observable(10),
			number : ko.observable(0),
			numberOfElements : ko.observable(10),
			first : ko.observable(true)
		},
		searchText : ko.observable(""),
		setData : function(data) {
			this.data.content(data.content);
			this.data.firstPage(data.firstPage);
			this.data.lastPage(data.lastPage);
			this.data.totalPages(data.totalPages);
			this.data.totalElements(data.totalElements);
			this.data.last(data.last);
			this.data.size(data.size);
			this.data.number(data.number + 1);
			this.data.numberOfElements(data.numberOfElements);
			this.data.first(data.first);
		},
		infoUrl : "",
		addUrl : "",
		deleteUrl : "",
		pageUrl : ""
	};

	app.baseModel.add = function(){
		window.router.setRoute(this.addUrl);	
	}
	
	app.baseModel.update = function(){
	}
	
	app.baseModel.del = function() {
		var me = this;
		$.ajax({
			type : 'DELETE',
			dataType : 'json',
			async : false,
			url : $ctx + this.deleteUrl + this.id,
			success : function(data) {
				if (data){
					jAlert('删除成功!')
					var pageNum = me.data.number();
					me.data.content.remove(me);
					me.load(pageNum);
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				jAlert("调用删除服务报错!!");
			}
		});
		
	}
	
	app.baseModel.load = function(pageIndex){
		var me = this;
		$.ajax({
			type : 'GET',
			url : $ctx + this.pageUrl + pageIndex + "&searchText=" + this.searchText(),
			data : '',
			dataType : 'json',
			success : function(data) {
				me.setData(data);
				$("#pagination").pagination({
					totalPages : me.data.totalPages(),
					currentPage : me.data.number(),
					page : function(page) {
						me.load(page);
					}
				})							
			}
		});
		
	}
	
	app.baseModel.searchPage = function() {
		this.load(1);                                                                                          
	}
	
	baseViewModel = function(controller) {
		var base = this;
		this.data = {};
		this.data.content = ko.observableArray([]);
		
		this.data.firstPage = ko.observable(true);
		this.data.lastPage = ko.observable(false);
		this.data.totalPages = ko.observable(0);
		this.data.totalElements = ko.observable(0);
		this.data.last = ko.observable(false);
		this.data.size = ko.observable(10);
		this.data.number = ko.observable(0);
		this.data.numberOfElements = ko.observable(10);
		this.data.first = ko.observable(true);
		
		this.searchText = ko.observable("");
		
		this.setData = function(data) {
			base.data.content(data.content);
			base.data.firstPage(data.firstPage);
			base.data.lastPage(data.lastPage);
			base.data.totalPages(data.totalPages);
			base.data.totalElements(data.totalElements);
			base.data.last(data.last);
			base.data.size(data.size);
			base.data.number(data.number + 1);
			base.data.numberOfElements(data.numberOfElements);
			base.data.first(data.first);
		};
	 
		this.infoUrl = controller.infoUrl;
		this.addUrl = controller.addUrl;
		this.deleteUrl = controller.deleteUrl;
		this.pageUrl = controller.pageUrl;
	 
		this.add = function(){
			//alert(base.addUrl);
			window.router.setRoute(base.addUrl);	
		}
		
		this.update = function(){
		}
		
		this.del = function() {
			var me = this;
			$.ajax({
				type : 'DELETE',
				dataType : 'json',
				async : false,
				url : $ctx + base.deleteUrl + this.id,
				success : function(data) {
					if (data){
						jAlert('删除成功!')
						var pageNum = base.data.number();
						base.data.content.remove(me);
						base.load(pageNum);
					}
				},
				error : function(req, textStatus, errorThrown) {
					jAlert("调用删除服务报错!!");
				}
			});
			
		}
		
		this.load = function(pageIndex){
			$.ajax({
				type : 'GET',
				url : $ctx + this.pageUrl + pageIndex + "&searchText=" + this.searchText(),
				data : '',
				dataType : 'json',
				success : function(data) {
					base.setData(data);
					$("#pagination").pagination({
						totalPages : base.data.totalPages(),
						currentPage : base.data.number(),
						page : function(page) {
							base.load(page);
						}
					})							
				}
			});
			
		}
		
		this.searchPage = function() {
			base.load(1);                                                                                          
		}
	};
	/*
	window.router.on('/.*', initPage('static/pages/emall/admgr'));
	window.router.on('/.*', function(path){
		debugger;
		alert(path);
	});
	*/
});