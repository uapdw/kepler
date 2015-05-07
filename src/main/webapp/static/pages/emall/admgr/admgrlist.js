define(
		[ 'jquery', 'knockout', 'text!static/pages/emall/admgr/admgrindex.html' ],
		function($, ko, template) {

			var infoUrl = "/emall/admgr/admgrinfo/:id";

			// 添加详细信息页路由
			addRouter(infoUrl);

			var viewModel = $.extend(true,{},app.baseModel,{
				add: function(){
					window.router.setRoute('/emall/admgr/admgrinfo/0');	
				},
				update: function(){
					
				},
				'delete': function() {
					var me = this;
					$.ajax({
						type : 'DELETE',
						dataType : 'json',
						async : false,
						url : $ctx + '/emall/admgr/delete/' + this.id,
						success : function(data) {
							if (data){
								alert('删除成功')
								var pageNum = me.pageinfo.number();
//								me.pageinfo.content.remove(me);
								me.load(pageNum);
							}
						},
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							alert("调用删除服务报错!!");
						}
					});
					
				},
				load: function(pageIndex){
					var me = this;
					$.ajax({
						type : 'GET',
						url : $ctx + '/emall/admgr/page?page=' + pageIndex + "&searchText=" + this.searchText(),
						data : '',
						dataType : 'json',
						success : function(data) {
							me.setData(data);
							$("#goodpagenition").pagination({
								totalPages : me.data.totalPages(),
								currentPage : me.data.number(),
								page : function(page) {
									me.load(page);
								}
							})							
						}
					});
					
				},
				showAdmgrInfo : function() {
					window.router.setRoute(infoUrl);
				},
				searchPage : function() {
					this.load(1);                                                                                          
				}
				
			});


			var init = function() {
				viewModel.load(1);
			}
			return {
				'model' : viewModel,
				'template' : template,
				'init' : init
			};

		});