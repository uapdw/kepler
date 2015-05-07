define(
		[ 'jquery', 'knockout', 'text!static/pages/emall/goods/goodindex.html' ],
		function($, ko, template) {

			var infoUrl = "/emall/goods/goodinfo/:id";

			// 添加详细信息页路由
			addRouter(infoUrl);

			var goodViewModel = {
				pageinfo : {
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
				searchText : ko.observable("")
			}

			goodViewModel.addGood = function() {
				window.router.setRoute('/emall/goods/goodinfo/0');
			};
			// 删除
			goodViewModel.removeGood = function() {
				var id = this.id;
				var name = this.goodName;

				var result = goodViewModel.deleteById(id);
				if (result != null && result) {
					jAlert("删除成功!", "提示");
					var pageNum = goodViewModel.pageinfo.number();
					goodViewModel.pageinfo.content.remove(this);
					loadData(pageNum);
				}
			};
			
			// 推荐
			goodViewModel.recommend = function() {
				var id = this.id;
				var name = this.goodName;
				$.ajax({
					type : 'GET',
					dataType : 'json',
					async : false,
					url : $ctx + '/mgr/advert/recommend/' + id + '?type=' + 2,
					success : function(data) {
						if (data) {
							 alert("推荐成功!");
						}
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						jAlert("调用推荐服务报错!!", "错误");
						// alert("调用删除服务报错!");
					},
				});
		
			};

			goodViewModel.showGoodInfo = function() {
				// jAlert(this.id);
				debugger;
				window.router.setRoute(infoUrl);
			};

			goodViewModel.deleteById = function(deleteId) {
				var result = null;
				$.ajax({
					type : 'DELETE',
					dataType : 'json',
					async : false,
					url : $ctx + '/emall/goods/delete/' + deleteId,
					success : function(data) {
						if (data) {
							result = data;
						}
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						jAlert("调用删除服务报错!!", "错误");
						// alert("调用删除服务报错!");
					},
				});
				return result;
			};
			

			goodViewModel.searchPage = function() {
				loadData(1);
			};

			var loadData = function(pageindex) {
				$.ajax({
					type : 'GET',
					url : $ctx + '/emall/goods/page?page=' + pageindex
							+ "&searchText=" + goodViewModel.searchText(),
					data : '',
					dataType : 'json',
					success : function(data) {
						goodViewModel.pageinfo.content(data.content);
						// alert(data.totalElements);
						goodViewModel.pageinfo.number(data.number + 1);
					}
				});
			}

			var init = function() {
				$("#goodpagenition").pagination({
					totalPages : 20,
					currentPage : 1,
					page : function(page) {
						loadData(page);
					}
				})
				loadData(1);
			}
			return {
				'model' : goodViewModel,
				'template' : template,
				'init' : init
			};

		});