define(
		[ 'jquery', 'knockout', 'text!static/pages/emall/huo/huoindex.html' ],
		function($, ko, template) {
			
			var infoUrl = "/emall/huo/huoinfo/:code";

			// 添加详细信息页路由
			addRouter(infoUrl);

			var dmViewModel = {
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

			dmViewModel.addGood = function() {
				window.router.setRoute('/emall/huo/huoinfo/0');
			};
			// 删除
			dmViewModel.removeGood = function() {
				var id = this.id;
				var name = this.goodName;

				var result = dmViewModel.deleteById(id);
				if (result != null && result) {
					jAlert("删除成功!", "提示");
					var pageNum = dmViewModel.pageinfo.number();
					dmViewModel.pageinfo.content.remove(this);
					loadData(pageNum);
				}
			};
			
			dmViewModel.showGoodInfo = function() {
				// jAlert(this.id);
				debugger;
				window.router.setRoute(infoUrl);
			};

			dmViewModel.deleteById = function(deleteId) {
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
			

			dmViewModel.searchPage = function() {
				loadData(1);
			};

			var loadData = function(pageindex) {
				$.ajax({
					type : 'GET',
					url : $ctx + '/emall/huo/loadTreeData',
					data : '',
					dataType : 'json',
					success : function(data) {
						// 初始化树
						var treeData = new Array(data.length);
						$.each(data, function(index, model) {
							var node = null;
							if (model.pkWfGroup == undefined) {
								// 项目
								node = {id:'prj^' + model.pkProject, pid:'root', title:model.projectName, href:'#'};
							} else {
								// 分组
								var groupParent = null;
								if (model.pkParent == null) {
									groupParent = 'prj^' + model.pkProject;
								} else {
									groupParent = 'grp^' + model.pkParent;
								}
								node = {id:'grp^' + model.pkWfGroup, pid:groupParent, title:model.groupName, href:'#'};
							}
							treeData[index] = node;
						});
			            $('#ex-tree-basic').tree({//model-tree
			            	data: treeData,
			            	loadingHTML: '<div class="static-loader">Loading...</div>',
			            	multiSelect: false,
			            	cacheItems: true,
			            	onSelected:function(){
			            		loadWfByProjectOrGroup();
			            	},
			            });
					}
				});
			}
			
			var loadWfByProjectOrGroup = function() {
//				debugger;
//				$("#contentTableBody").remove();
//				dmViewModel.pageinfo.number(0);
				var id = $('.tree-selected').attr("id");
//				alert(id);
				$.ajax({
					type : 'GET',
					url : $ctx + '/emall/huo/loadWorkflow',
					data : {
						id : id,
					},
					dataType : 'json',
					success : function(data) {
//						alert(data.content.length);
						if (data.content.length == 0) {
							return;
						}
						dmViewModel.pageinfo.content(data.content);
//						dmViewModel.pageinfo.number(data.number + 1);
					},
					error : function() {
						alert("error");
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
				'model' : dmViewModel,
				'template' : template,
				'init' : init
			};

		});