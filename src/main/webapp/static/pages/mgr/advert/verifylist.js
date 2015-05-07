define([ 'jquery', 'knockout', 'text!static/pages/mgr/advert/verifylist.html' ], function($, ko, template) {

 var infoUrl = "/mgr/advert/adinfo/:id";
	
	var addUrl = '/mgr/advert/adinfo/0';
	
	var deleteUrl = '/mgr/advert/delete/';
	
	var pageUrl = '/mgr/advert/page?page=';
	
	var checkUrl = '/mgr/advert/checkinfo';

	// 添加详细信息页路由
	addRouter(infoUrl);
	
	addRouter(checkUrl+"/:id");
	
	var controller = {
		infoUrl : infoUrl,
		addUrl : addUrl,
		deleteUrl : deleteUrl,
		pageUrl : pageUrl
	};
	
	verifyviewModel =  new baseViewModel(controller);

	verifyviewModel.title = ko.observable("");
	verifyviewModel.name = ko.observable("");
	verifyviewModel.type = ko.observable("");
	verifyviewModel.createtime = ko.observable("");
	verifyviewModel.isactive = ko.observable("");
	verifyviewModel.load = function(pageIndex){
		$.ajax({
			type : 'GET',
			//url : $ctx + this.pageUrl + pageIndex + "&shopTitle=" + this.shopTitle() + "&email=" + this.email() +"&companyName=" + this.companyName()+ "&phone=" + this.phone()+ "&status=0" + this.status() ,
			url : $ctx + this.pageUrl + pageIndex + "&isactive=" + this.isactive() + "&title=" + this.title() + "&name=" + this.name() + "&type=" + this.type(),
			data : '',
			dataType : 'json',
			success : function(data) {
				verifyviewModel.setData(data);
				//alert(data.totalElements);
				$("#verifypagination").pagination({
					totalPages : verifyviewModel.data.totalPages(),
					currentPage : verifyviewModel.data.number(),
					page : function(page) {
						verifyviewModel.load(page);
					}
				})							
			}
		});
		
	}
	
	verifyviewModel.check = function(){
		window.router.setRoute(checkUrl + "/" + this.id);	
	}
	verifyviewModel.fastcheck = function(){
		var infoUrl = $ctx + '/mgr/advert/fastcheck/' + this.id;
		$.ajax({
			type : 'GET',
			url : infoUrl,
			dataType : 'json',
			success : function(data) {
				 alert("通过审核");
			},
			error : function() {
				jAlert("获取详细信息失败!", "错误");
			}
		});
	}
	
	var init = function() {
		var pageNum = verifyviewModel.data.number();
		if(pageNum > 0){
			verifyviewModel.load(pageNum);
		} else {
			verifyviewModel.load(1);
		}
	};
	
	return {
		'model' : verifyviewModel,
		'template' : template,
		'init' : init
	};

});