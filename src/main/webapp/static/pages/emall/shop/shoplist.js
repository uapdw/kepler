define([ 'jquery', 'knockout', 'text!static/pages/emall/shop/shoplist.html' ],
		function($, ko, template) {

			var infoUrl = "/emall/shop/shopinfo/:id";

			var addUrl = '/emall/shop/shopinfo/0';

			var deleteUrl = '/emall/shop/delete/';

			var pageUrl = '/emall/shop/page?page=';

			// 添加详细信息页路由
			addRouter(infoUrl);

			var controller = {
				infoUrl : infoUrl,
				addUrl : addUrl,
				deleteUrl : deleteUrl,
				pageUrl : pageUrl
			};
			// var str={"status" : "0"};
			viewModel = new baseViewModel(controller);

			viewModel.shopTitle = ko.observable("");
			viewModel.email = ko.observable("");
			viewModel.phone = ko.observable("");
			viewModel.companyName = ko.observable("");
			viewModel.status = ko.observable("");
			viewModel.load = function(pageIndex) {
				$.ajax({
					type : 'GET',
					url : $ctx + this.pageUrl + pageIndex + "&shopTitle="
							+ this.shopTitle() + "&email=" + this.email()
							+ "&companyName=" + this.companyName() + "&phone="
							+ this.phone() + "&status=6" + this.status(),
					data : '',
					dataType : 'json',
					success : function(data) {
						viewModel.setData(data);
						$("#pagination").pagination({
							totalPages : viewModel.data.totalPages(),
							currentPage : viewModel.data.number(),
							page : function(page) {
								viewModel.load(page);
							}
						})
					}
				});

			}

			var init = function() {
				var pageNum = viewModel.data.number();
				if (pageNum > 0) {
					viewModel.load(pageNum);
				} else {
					viewModel.load(1);
				}
			};

			return {
				'model' : viewModel,
				'template' : template,
				'init' : init
			};

		});