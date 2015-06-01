define(
		[ 'jquery', 'knockout',
				'text!static/pages/ae/explore/dataVisualization/dataVisualization.html','echarts', 'd3.cloud' ],
		function($, ko, template) {
			var dataViewModel = {
					info : ko.observable(""),
					mailinfo : ko.observable({})
			}
			
			var inited = false;
			var dataUrl = "";
			
			dataViewModel.sharemail = function(){
				if($("#checkCY").is(':checked')){
					exportD3Image(dataUrl);
				}else {
					exportImage(dataUrl);
				}
				window.open("#/ae/explore/dataVisualization/sendmail", "newwindow", "height=500, width=600, toolbar=no, menubar=no, scrollbars=no");
			}
			
			dataViewModel.shareweibo = function(){
				if($("#checkCY").is(':checked')){
					exportD3Image(dataUrl);
				}else {
					exportImage(dataUrl);
				}				
			}
			
			dataViewModel.sendmail = function(){
				if(this.mailinfo().toList == null || this.mailinfo().toList == ''){
					jAlert("收件人未填写", "错误");
					return;
				}
				var sendUrl = "ae/explore/sendmail";
				$.ajax({
					type : 'POST',
					contentType : 'application/json',
					url : sendUrl,
					data : JSON.stringify(dataViewModel.mailinfo()),
					dataType : 'json',
					success : function(data) {
						if (data == null || data.msg != 'success') {
							jAlert("发送失败!", "错误");
						}else{
							jAlert("发送成功!", "提示");
						}
					},
					error : function() {
						jAlert("发送失败!", "错误");
					}
				});
				
			}
			
			function exportImage(dataurl){
			    var data = "a=" + dataurl;
			    $.ajax({
					type : 'POST',
					url : 'ae/explore/saveAsImage',
					data: {
						data : data
					},
					ContentType: "application/x-www-form-urlencoded",
					success : function(data) {
						console.log(data);
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						jAlert(errorThrown, "获取详细信息失败!")
					}
				}); 
			}
			
			function exportD3Image(dataurl){			 
				  $.ajax({
						type : 'POST',
						url : 'ae/explore/saveAsImageD3',
						data: {
							data : dataurl
						},
						ContentType: "application/x-www-form-urlencoded",
						success : function(data) {
							console.log(data);
						},
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							jAlert(errorThrown, "获取详细信息失败!")
						}
				  }); 
			}
			//柱状图和折线图展示
			function successGetView(datatype, data){
				$("#newscharts div").remove();
				$("#newscharts").append("<div style='height:500px'></div>")
				var newsChart = echarts.init($("#newscharts div")[0],'macarons');
				var option = {
					    title : {
					        text: '网站发布新闻数量分析',
					    },
					    tooltip : {
					        trigger: 'axis'
					    },
					    legend: {
					        data:['网站发布频率']
					    },
					    toolbox: {
					        show : true,
					        feature : {
					            mark : {show: true},
					            dataView : {show: true, readOnly: false},
					            //magicType : {show: true, type: ['line', 'bar']},
					            restore : {show: true},
					            saveAsImage : {show: true}
					        }
					    },
					    calculable : true,
					    animation: false,
					    xAxis : [
					        {
					            type : 'category',
					            data : data.title,
					            axisLabel : {
					                show:true,
					                interval: 'auto',    // {number}
					                rotate: 45,
					                margin: 8,
					                textStyle: {
					                    color: 'blue',
					                    fontFamily: 'sans-serif',
					                    fontSize: 15,
					                    fontStyle: 'italic',
					                    fontWeight: 'bold'
					                }
					            }
					        }
					    ],
					    yAxis : [
					        {
					            type : 'value'
					        }
					    ],
					    series : [
					        {
					            name:'网站发布频率',
					            type: datatype,
					            data: data.freq					            
					        }
					    ]
					};
				newsChart.setOption(option);
				return newsChart.getDataURL("png");
			}
			
			//饼图展示
			function successGetPieView(datatype, data){
				$("#newscharts div").remove();
				$("#newscharts").append("<div style='height:500px'></div>")
				var newsChart = echarts.init($("#newscharts div")[0],'macarons');
				var option = {
					    title : {
					        text: '发布新闻网站数量分析',
					        x:'center'
					    },
					    tooltip : {
					        trigger: 'item',
					        formatter: "{a} <br/>{b} : {c} ({d}%)"
					    },
					    animation: false,
					    legend: {
					        orient : 'vertical',
					        x : 'left',
					        data: data.map(function(d) {
						        return d.name;
						      })
					    },
					    toolbox: {
					        show : true,
					        feature : {
					            mark : {show: true},
					            dataView : {show: true, readOnly: false},
					            magicType : {
					                show: true, 
					                type: ['pie', 'funnel'],
					                option: {
					                    funnel: {
					                        x: '25%',
					                        width: '50%',
					                        funnelAlign: 'left',
					                        max: 1548
					                    }
					                }
					            },
					            restore : {show: true},
					            saveAsImage : {show: true}
					        }
					    },
					    calculable : true,
					    series : [
					        {
					            name:'访问来源',
					            type:'pie',
					            radius : '55%',
					            center: ['50%', '60%'],
					            data: data
					        }
					    ]
					};
				newsChart.setOption(option);
				return newsChart.getDataURL("png");
				
			}
			
			//词云图展示
			function successGetWordsCloudView(datatype, data){
				$("#newscharts div").remove();
				$("#newscharts").append("<div style='height:500px'></div>")
				 var fill = d3.scale.category20();
				  d3.layout.cloud().size([1500, 500])
				      .words(data.map(function(d) {
				        return {text: d.text, size:d.size>10? d.size:(d.size+20)};
				      }))
				      .padding(0)
				      .rotate(function() { return ~~(Math.random() * 2) * 90; })
				      .font("Impact")
				      .fontSize(function(d) { return d.size; })
				      .on("end", draw)
				      .start();

				  function draw(words) {
				    d3.select("#newscharts div").append("svg")
				        .attr("width", 1500)
				        .attr("height", 500)
				      .append("g")
				        .attr("transform", "translate(680,250)")
				      .selectAll("text")
				        .data(words)
				      .enter().append("text")
				        .style("font-size", function(d) { return d.size*0.9 + "px"; })
				        .style("font-family", "Courier")
				        .style("font-weight", "bold")
				        .style("fill", function(d, i) { return fill(i); })
				        .attr("text-anchor", "middle")
				        .attr("transform", function(d) {
				          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
				        })
				        .text(function(d) { return d.text; });
				  }
				  
				  var html = d3.select("svg")
			        .attr("version", 1.1)
			        .attr("xmlns", "http://www.w3.org/2000/svg")
			        .node().parentNode.innerHTML;
				  return html;
			}
			
			//通过已选择的展示类型从后台获取相应的数据格式
			function getView(datatype){				
				$.ajax({
					type : 'GET',
					url : 'ae/explore/getViewedData',
					data: {
						data : datatype
					},
					success : function(data) {
						if(datatype == "line" ||datatype == "bar"){
							dataUrl = successGetView(datatype, data[0]);	
						}else if(datatype == "wordscloud"){
							dataUrl = successGetWordsCloudView(datatype, data);
						}else if(datatype == "pie"){
							dataUrl = successGetPieView(datatype, data);
						}else{
							$("#newscharts div").remove();
							$("#newscharts").append("<div style='height:500px'>数据不支持此图</div>")
						}
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						jAlert(errorThrown, "获取详细信息失败!")
					}
				});
			}
			
			
			var init = function() {
				var infoUrl = "/ae/explore/dataVisualization/sendmail";
				// 添加详细信息页路由
				addRouter(infoUrl);
				
				var datatype = "bar";
				$("#sharemailPane").hide();
				$("#checkZZ").attr('checked',true);
				getView(datatype);
				$(':checkbox[name=dataview]').each(function(){ 
					$(this).click(function(){ 
						if($(this).is(':checked')){ 
							$(this).attr('checked',true).siblings().attr('checked',false);
							if($("#checkZX").is(':checked')){
								datatype = "line";
							}else if($("#checkZZ").is(':checked')){
								datatype = "bar";
							}else if($("#checkSD").is(':checked')){
								datatype = "scatter";
							}else if($("#checkCY").is(':checked')){
								datatype = "wordscloud";
							}else if($("#checkBT").is(':checked')){
								datatype = "pie";
							}else{
								datatype = "map";
							}
							getView(datatype);
						}else{
							$(this).attr('checked',false).siblings().attr('checked',false);
						}
					}); 
				});
				inited = true;
			}
			return {
				'model' : dataViewModel,
				'template' : template,
				'init' : init,
				'inited' : inited
			};
		});