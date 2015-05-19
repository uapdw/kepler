define(
		[ 'jquery', 'knockout',
				'text!static/pages/ae/explore/selectDataSource/selectDataSource.html', 'ParameterStore',
				'manager.jquery', 'AbstractWidget', 'bootstrap.min' ],
		
		function($, ko, template) {
			
			var searchViewModel = {
				listinfo : ko.observableArray([])
			}
			
			$.extend({

				//启用solr搜索管理器，设置搜索参数，执行搜索过程
				/***************************************************************************
				 * 参数说明： q: 查询， hl: 是否高亮显示查询词， sort: 定义排序的域及排序方式， hl.fl: 高亮的域，
				 * hl.simple.pre: 高亮词前的添加(样式)， hl.simple.post: 高亮词后的添加， rows: 检索结果显示的行数。
				 **************************************************************************/
				search: function(query){			
					Manager = new AjaxSolr.Manager({
				      solrUrl: 'http://172.20.8.84:8983/solr/other_articles/'
				    });
					Manager.addWidget(new AjaxSolr.ResultWidget({
				      id: 'result',
				      target: '#dataTable'
				    }));
				    Manager.init();
				    Manager.store.addByValue('q', query);
				    if(query != '*:*'){
						Manager.store.addByValue('hl', true);
						Manager.store.addByValue('hl.simple.pre', '<em class="hlt1">');
						Manager.store.addByValue('hl.simple.post', '</em>');
						Manager.store.addByValue('hl.fl', 'other_articles_title');
				    }
				    Manager.store.addByValue('sort', 'other_articles_publishtime desc');
					Manager.store.addByValue('rows', 50);
				    Manager.doRequest();
				},
			
				//将以空格分割的多个检索词进行拆分，组合后返回solr可识别的查询
				keywordSeg: function(query){
					var keywords = "";
					query = query.trim();
					if(query.indexOf(" ")!=-1){
						var queries = query.split(" ");
						for(var i = 0; i < queries.length; i++){
							keywords +=  'other_articles_title:“'+ queries[i] + '” ';
						}
					}else{
						keywords = 'other_articles_title:“' + query + '”';
					}
					return keywords;
				}
			});
			
			//AjaxSolr搜索结果处理程序
			AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
				  beforeRequest: function () {
					$(this.target.tbody).html($('<img>').attr('src', 'static/images/ajax-loader.gif'));
				  },
				  //获取检索结果数据
				  afterRequest: function () {		 
					$("#dataTable tbody tr").remove();
					$("#dataTable thead tr").remove();
					$("thead").append("<tr><th>标题</th><th>网站名称</th><th>发布时间</th></tr>");
				    if(this.manager.highlighting != undefined){
				      for (var i = 0, l = this.manager.response.docs.length; i < l; i++) {
				        var doc = this.manager.response.docs[i];
				        $(this.target).append(this.templateHL(doc, this.manager.highlighting));
				      }
				    }else{
				      for (var i = 0, l = this.manager.response.docs.length; i < l; i++) {
				        var doc = this.manager.response.docs[i];
				        $(this.target).append(this.template(doc));
				      }
				   }
				  },
				  //检索数据显示格式处理
				  template: function (data) {
					var title = data.other_articles_title;
					var sitename = data.other_articles_sitename;
					var publishtime = (data.other_articles_publishtime).substring(0,data.other_articles_publishtime.indexOf("T"));
					var url = data.other_articles_url;
					var newRow = "<tr><td><a href='"+url+"' target='_blank'>"+title+"</a></td><td>"+sitename+"</td><td>"+publishtime+"</td></tr>"
					var strNewRow = "<tr><td><div class='media'><div class='media-body'> <h4 class='media-heading'><a href='" + url + "'>" + title + "</a></h4><p class='txt-green'>" + publishtime + " - " + sitename  + "</p></div> </div></td></tr>";
					return newRow;
			
				  },
				  //需要高亮显示的检索结果
				  templateHL: function (data, highlightingInfo) {
					  var id = data.id;
					  var title = highlightingInfo[id].other_articles_title;
					  var sitename = data.other_articles_sitename;
					  var publishtime = (data.other_articles_publishtime).substring(0,data.other_articles_publishtime.indexOf("T"));
					  var url = data.other_articles_url;
					  var newRow = "<tr><td><a href='"+url+"' target='_blank'>"+title+"</a></td><td>"+sitename+"</td><td>"+publishtime+"</td></tr>"
					  var strNewRow = "<tr><td><div class='media'><div class='media-body'> <h4 class='media-heading'><a href='" + url + "'>" + title + "</a></h4><p class='txt-green'>" + publishtime + " - " + sitename  + "</p></div> </div></td></tr>";
					  return newRow;
				  }
			});
			
			searchViewModel.info = function(){
				var id = this.id;
				if(id > 0){
					$.ajax({
						type : 'GET',
						dataType : 'json',
						url : 'ae/dataSource/info/' + id,
						success : function(data) {
							if(data.msg == 'success'){
								var detailContent = "<div class=\"table-responsive\"><table class=\"table table-bordered table-condensed table-hover\">";
								//header
								detailContent += "<thead><tr>";
								for(var i = 0; i < data.colnum; i++){
									detailContent += "<th style='background-color:#51A2A2'>";
									if(data.data[0][i]){
										detailContent += data.data[0][i];
									}else{
										detailContent += "#null";
									}
									detailContent += "</th>";
								}
								detailContent += "</tr></thead>";
								//body
								detailContent += "<tbody>";
								for(var i = 1; i < data.rownum; i++){
									detailContent += "<tr>";
									for(var j = 0; j < data.colnum; j++){
										detailContent += "<td>";
										if(data.data[i][j]){
											detailContent += data.data[i][j];
										}else{
											detailContent += "#null";
										}
										detailContent += "</td>"
									}
									detailContent += "</tr>";
								} 
								detailContent += "</tbody>";
								detailContent += "</table></div>";
				
								$("#detail").html(detailContent);
							}else{
								jAlert(data.msg, "错误");
							}
						},
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							jAlert("获取详细信息失败!", "错误");
						},
					});
				}else{
					jAlert("未选择条目", "错误");
				}
			};
			
			searchViewModel.search = function(){
				if($("#txtKeyword").val() == ''){
					alert("请输入关键词！");	
				}else{
					keyword = $("#txtKeyword").val();
					$.search($.keywordSeg(keyword));
				}
			}
			
			var loadData = function() {
				var infoUrl = 'ae/dataSource/list';
				$.ajax({
					type : 'GET',
					url : infoUrl,
					dataType : 'json',
					success : function(data) {
						if(data.msg == 'success'){
							searchViewModel.listinfo(data.data);
						}else{
							jAlert("获取详细信息失败!", "错误");
						}
					},
					error : function() {
						jAlert("获取详细信息失败!", "错误");
					}
				});
			}
							
			var inited = false;
			
			var init = function() {
				loadData();					
				inited = true;
			}
			
			return {
				'model' : searchViewModel,
				'template' : template,
				'init' : init,
				'inited' : inited
			};
		});