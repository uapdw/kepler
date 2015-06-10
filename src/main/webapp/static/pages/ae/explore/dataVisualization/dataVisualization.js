define(
		[ 'jquery', 'knockout', 
				'text!static/pages/ae/explore/dataVisualization/dataVisualization.html','echarts', 'd3.v3.min', 'd3.cloud' ],
		function($, ko, template) {
			var dataViewModel = {
					info : ko.observable(""),
					fileurl : ko.observable("")
			}
			
			var inited = false;
			var dataUrl = "";
			
			dataViewModel.sharemail = function(){
				if($("#checkCY").is(':checked') || $("#checkQP").is(':checked')){
					exportD3Image(dataUrl);
				}else {
					exportImage(dataUrl);
				}
				window.open(getlocalUrl() + "static/pages/ae/explore/dataVisualization/sendmail.html?fileurl="+dataViewModel.fileurl(), "newwindow", "height=500, width=600, toolbar=no, menubar=no, scrollbars=no, location=no");
			}
			
			dataViewModel.shareweibo = function(){
				if($("#checkCY").is(':checked') || $("#checkQP").is(':checked')){
					exportD3Image(dataUrl);
				}else {
					exportImage(dataUrl);
				}
				window.open("http://widget.weibo.com/dialog/PublishWeb.php?default_text=请填写内容&default_image="+getlocalUrl()+dataViewModel.fileurl()+"&refer=y&language=zh_cn&app_src=5E4yWv&button=pubilish", "newwindow", "height=500, width=600, toolbar=no, menubar=no, scrollbars=no, location=no");				
			}
			
			function getlocalUrl(){
				var url = window.location.href;
				var index = url.indexOf("#");
				var localurl = url;
				if(index > 0){
					localurl = url.substring(0, index);
				}
				index = localurl.indexOf(";");
				if(index > 0){
					localurl = localurl.substring(0, index);
				}
			    return localurl;
			}
			
			function exportImage(dataurl){
			    var data = "a=" + dataurl;
			    $.ajax({
					type : 'POST',
					url : 'ae/explore/saveAsImage',
					async : false,
					data: {
						data : data
					},
					ContentType: "application/x-www-form-urlencoded",
					success : function(data) {
						dataViewModel.fileurl(data);
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
						async : false,
						data: {
							data : dataurl
						},
						ContentType: "application/x-www-form-urlencoded",
						success : function(data) {
							dataViewModel.fileurl(data);
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
			
			//饼图展示
			function successGetScatterView(datatype, data){
				$("#newscharts div").remove();
				$("#newscharts").append("<div style='height:500px'></div>")
				var newsChart = echarts.init($("#newscharts div")[0],'macarons');
				var option = {
					    title : {
					        text : '招聘数据散点图',
					    },
					    tooltip : {
					        trigger: 'axis',
					        axisPointer:{
					            show: true,
					            type : 'cross',
					            lineStyle: {
					                type : 'dashed',
					                width : 1
					            }
					        }
					    },
					    toolbox: {
					        show : true,
					        feature : {
					            mark : {show: true},
					            dataView : {show: true, readOnly: false},
					            restore : {show: true},
					            saveAsImage : {show: true}
					        }
					    },
					    dataZoom: {
					        show: true,
					        start : 30,
					        end : 70
					    },
					    dataRange: {
					        min: 0,
					        max: 30000,
					        orient: 'horizontal',
					        y: 30,
					        x: 'center',
					        //text:['30000元/月','0元/月'],           // 文本，默认为数值文本				       
					        color:['#ff3333','lightgreen','orange','yellow', 'aqua'],
					        splitNumber: 6
					    },
					    xAxis : [
					        {
					            type : 'category',
					            axisLabel: {
					                formatter : function(v) {
					                    return data[0][v];
					                }
					            },
					            data : function (){
					                var list = [];
					                var len = 0;	
					                while (len < data[0].length) {
					                    list.push(len);   
					                    len++;
					                }
					                return list;
					            }()
					        }
					    ],
					    yAxis : [
					        {
					            type : 'value'
					        }
					    ],
					    animation: false,
					    series : [
					        {
					            name:'series1',
					            type:'scatter',
					            tooltip : {
					                trigger: 'item',
					                formatter : function (params) {
					                    return '职位： ' + data[0][params.value[0]] +'<br/>'
					                           + '薪资水平：'+(params.value[2]-1000)+'-'+(params.value[2]+1000) + '元/月<br/>' 
					                           + '招聘人数：'+params.value[1]; 
					                },
					                axisPointer:{
					                    show: true
					                }
					            },
					            symbolSize: function (value){
					                return Math.round(value[2]/1000);
					            },
					            data: (function () {
					                var d = [];
					                var len = 0;
					                var s = 0;
					                while (len < data[1].length) {				                	
					                	d.push([    
					                        parseInt(data[1][len]),
					                	    parseInt(data[4][len]),
					                        parseInt(data[2][len])					                       
					                    ]);
					                    len++;				                    
					                }
					                return d;
					            })()
					        }
					    ]
					};
				newsChart.setOption(option);
				return newsChart.getDataURL("png");
				
			}
			//气泡图展示
			function successGetBubbleView(datatype, data){
				$("#newscharts div").remove();
				$("#newscharts").append("<div style='height:500px'></div>")
				var diameter = 500,
				    format = d3.format(",d"),
				    color = d3.scale.category20c();
				
				var bubble = d3.layout.pack()
				    .sort(null)
				    .size([diameter, diameter])
				    .padding(1.5);
				
				var svg = d3.select("#newscharts div").append("svg")
				    .attr("width", diameter)
				    .attr("height", diameter)
				    .attr("class", "bubbles");	
				
				var node = svg.selectAll(".node")
				      .data(bubble.nodes(classes(data))
				      .filter(function(d) { return !d.children; }))
				    .enter().append("g")
				      .attr("class", "node")
				      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
				
				  node.append("title")
				      .text(function(d) { return d.className + ": " + format(d.value); });
				
				  node.append("circle")
				      .attr("r", function(d) { return d.r; })
				      .style("fill", function(d, i) { return color(i); });
				
				  node.append("text")
				      .attr("dy", ".3em")
				      .style("text-anchor", "middle")
				      .text(function(d) { return d.className.substring(0, d.r / 5); });
				  
				  dataUrl = d3.select("svg")
			        .attr("version", 1.1)
			        .attr("xmlns", "http://www.w3.org/2000/svg")
			        .node().parentNode.innerHTML;
				  
				// Returns a flattened hierarchy containing all leaf nodes under the root.
				function classes(root) {
				  var classes = [];
				
				  function recurse(name, node) {
				    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
				    else classes.push({packageName: name, className: node.name, value: node.size});
				  }
				
				  recurse(null, root);
				  return {children: classes};
				}
				
				d3.select(self.frameElement).style("height", diameter + "px");

				 return dataUrl;				
			}
			
			//地图展示
			function successGetMapView(datatype, data){
				$("#newscharts div").remove();
				$("#newscharts").append("<div style='height:500px'></div>")
				var newsChart = echarts.init($("#newscharts div")[0],'macarons');
				var option = {
					    title : {
					        x:'center'
					    },
					    tooltip : {
					        trigger: 'item'
					    },
					    legend: {
					        orient: 'vertical',
					        x:'left',
					        data:[]
					    },
					    dataRange: {
					        min: 0,
					        max: 2500,
					        x: 'left',
					        y: 'bottom',
					        text:['高','低'],           // 文本，默认为数值文本
					        calculable : true
					    },
					    toolbox: {
					        show: true,
					        orient : 'vertical',
					        x: 'right',
					        y: 'center',
					        feature : {
					            mark : {show: true},
					            dataView : {show: true, readOnly: false},
					            restore : {show: true},
					            saveAsImage : {show: true}
					        }
					    },
					    roamController: {
					        show: true,
					        x: 'right',
					        mapTypeControl: {
					            'china': true
					        }
					    },
					    series : [
					        {
					            name: '区域数量分布',
					            type: 'map',
					            mapType: 'china',
					            roam: false,
					            itemStyle:{
					                normal:{label:{show:true}},
					                emphasis:{label:{show:true}}
					            },
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
				      .rotate(function() { return ~~(Math.random() * 2) * 60; })
				      .font("Impact")
				      .fontSize(function(d) { return d.size; })
				      .on("end", draw)
				      .start();

				  function draw(words) {
				    d3.select("#newscharts div").append("svg")
				        .attr("width", 1700)
				        .attr("height", 500)
				      .append("g")
				        .attr("transform", "translate(850,250)")
				      .selectAll("text")
				        .data(words)
				      .enter().append("text")
				        .style("font-size", function(d) { return d.size + "px"; })
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
						}else if(datatype == "scatter"){
							dataUrl = successGetScatterView(datatype, data);
						}else if(datatype == "bubble"){
							dataUrl = successGetBubbleView(datatype, data[0]);
						}else if(datatype == "map"){
							dataUrl = successGetMapView(datatype, data);
						}
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						jAlert(errorThrown, "获取详细信息失败!")
					}
				});
			}
			
			var init = function() {
				inited = true;
				var datatype = "bar";
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
								//dataUrl = successGetScatterView(datatype);
							}else if($("#checkCY").is(':checked')){
								datatype = "wordscloud";
							}else if($("#checkBT").is(':checked')){
								datatype = "pie";
							}else if($("#checkQP").is(':checked')){
								datatype = "bubble";
								//dataUrl = successGetBubbleView(datatype);
							}else{
								datatype = "map";
								dataUrl = successGetMapView(datatype);
							}
							getView(datatype);
						}else{
							$(this).attr('checked',false).siblings().attr('checked',false);
						}
					}); 
				});
				
			}
			return {
				'model' : dataViewModel,
				'template' : template,
				'init' : init,
				'inited' : inited
			};
		});