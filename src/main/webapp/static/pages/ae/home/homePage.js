define(
		[ 'jquery', 'knockout', 'text!static/pages/ae/home/homePage.html',
				'echarts', 'd3.v3.min' ],// ,'echarts.line'
		function($, ko, template) {
			var dm0 = [];
			var dm1 = [];

			function dataFormatGDP(obj) {
				debugger;
				var pList = [ '北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江',
						'上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北',
						'湖南', '广东', '广西', '海南', '重庆', '四川', '贵州', '云南', '西藏',
						'陕西', '甘肃', '青海', '宁夏', '新疆' ];
				var temp;
				var max = 0;
				for (var year = 2002; year <= 2011; year++) {
					temp = obj[year];
					for (var i = 0, l = temp.length; i < l; i++) {
						max = Math.max(max, temp[i]);
						obj[year][i] = {
							name : pList[i],
							value : temp[i]
						}
					}
					obj[year + 'max'] = Math.floor(max / 100) * 100;
				}
				return obj;
			}

			function dataMix(list) {
				var mixData = {};
				for (var i = 0, l = list.length; i < l; i++) {
					for ( var key in list[i]) {
						if (list[i][key] instanceof Array) {
							mixData[key] = mixData[key] || [];
							for (var j = 0, k = list[i][key].length; j < k; j++) {
								mixData[key][j] = mixData[key][j] || {
									name : list[i][key][j].name,
									value : []
								};
								mixData[key][j].value
										.push(list[i][key][j].value);
							}
						}
					}
				}
				return mixData;
			}

			function dataFormatter(obj) {
				var year = obj["YEAR"];
				var month = obj["MONTH"];
				var m1 = obj["M1"];
				var m1percent = obj["M1.PERCENT"];
				var m0 = obj["M0"];
				var m0percent = obj["M0.PERCENT"];

				for (var i = 1; i <= year.length; i++) {
					dm0.push([ new Date(year[i], month[i], 1, 0, 0), 
							m1percent[i],m1[i] ]);
					dm1.push([ new Date(year[i], month[i], 1, 0, 0), 
							m0percent[i],m0[i] ]);
				}

			}

			var infoUrl = "/ae/home/homePage";

			// 添加详细信息页路由
			addRouter(infoUrl);

			var homeViewModel = {
				info : ko.observable("")
			}

			function getForceView(){
				var width = 850,
			    height = 800;

				var color = d3.scale.category20();
	
				var force = d3.layout.force()
				    .charge(-50)
				    .linkDistance(200)
				    .size([width, height])
					.gravity(.05);
	
				var svg = d3.select("#weibo").append("svg")
				    .attr("width", width)
				    .attr("height", height);
	
				d3.json("static/json/weibo.json", function(error, graph) {
				  force
				      .nodes(graph.nodes)
				      .links(graph.links)
				      .start();
	
				  var link = svg.selectAll(".link")
				      .data(graph.links)
				    .enter().append("line")
				      .attr("class", "link")
				      .style("stroke-width", function(d) { return Math.sqrt(d.value); });
	
				  var node = svg.selectAll(".node")
				      .data(graph.nodes)
				    .enter().append("circle")
				      .attr("class", "node")
				      .attr("r", 7)
				      .style("fill", function(d) { return color(d.group); })
				      .call(force.drag);
	
				  node.append("title")
				      .text(function(d) { return d.name; });
	
				  force.on("tick", function() {
				    link.attr("x1", function(d) { return d.source.x; })
				        .attr("y1", function(d) { return d.source.y; })
				        .attr("x2", function(d) { return d.target.x; })
				        .attr("y2", function(d) { return d.target.y; });
	
				    node.attr("cx", function(d) { return d.x; })
				        .attr("cy", function(d) { return d.y; });
				  });
				});
			}
			var init = function() {
				getForceView();
				$.ajax({
							type : 'GET',
							dataType : 'json',
							data : {
								param : "uap"
							},
							url : 'ae/homepage/initInfo',
							success : function(data) {
								console.log(data);
								var myChart = echarts.init($("#main")[0],'macarons');
								var gdpChart = echarts.init($("#gdp")[0],'macarons');
								//var weiboChart = echarts.init($("#weibo")[0],'macarons');
								var pm25Chart = echarts.init($("#pm25map")[0],'macarons');
								dataFormatter(data[0]);

								var option = {
									title : {
										text : '时间坐标折线图',
										subtext : '现金流量分析'
									},
									tooltip : {
										trigger : 'item',
										formatter : function(params) {
											var date = new Date(params.value[0]);
											data = date.getFullYear() + '-'
													+ (date.getMonth() + 1)
													+ '-' + date.getDate()
													+ ' ' + date.getHours()
													+ ':' + date.getMinutes();
											return data + '<br/>'
													+ params.value[1] + ', '
													+ params.value[2];
										}
									},
									toolbox : {
										show : true,
										feature : {
											mark : {
												show : true
											},
											dataView : {
												show : true,
												readOnly : false
											},
											restore : {
												show : true
											},
											saveAsImage : {
												show : true
											}
										}
									},
									dataZoom : {
										show : true,
										start : 70
									},
									legend : {
										data : [ '现金流通量', '货币供应量' ]
									},
									grid : {
										y2 : 80
									},
									xAxis : [ {
										type : 'time',
										splitNumber : 10
									} ],
									yAxis : [ {
										type : 'value'
									} ],
									series : [
											{
												name : '现金流通量',
												type : 'line',
												showAllSymbol : true,
												symbolSize : function(value) {
													return Math
															.round(value[2] / 100000);
												},
												data : dm0
											},
											{
												name : '货币供应量',
												type : 'line',
												showAllSymbol : true,
												symbolSize : function(value) {
													return Math
															.round(value[2] / 10000);
												},
												data : dm1
											} ]

								};

								// 为echarts对象加载数据
								myChart.setOption(option);

								// 加载GDP图表
								var dataMap = {};
								dataMap.dataGDP = dataFormatGDP(data[1][0]);
								dataMap.dataPI = dataFormatGDP(data[1][1]);
								dataMap.dataSI = dataFormatGDP(data[1][2]);
								dataMap.dataTI = dataFormatGDP(data[1][3]);
								dataMap.dataEstate = dataFormatGDP(data[1][4]);
								dataMap.dataFinancial = dataFormatGDP(data[1][5]);
								dataMap.dataGDP_Estate = dataMix([
										dataMap.dataEstate, dataMap.dataGDP ]);

								var optionGDP = {
									timeline : {
										data : [ '2002-01-01', '2003-01-01',
												'2004-01-01', '2005-01-01',
												'2006-01-01', '2007-01-01',
												'2008-01-01', '2009-01-01',
												'2010-01-01', '2011-01-01' ],
										label : {
											formatter : function(s) {
												return s.slice(0, 4);
											}
										},
										autoPlay : true,
										playInterval : 1000
									},
									options : [
											{
												title : {
													'text' : '2002全国宏观经济指标',
													'subtext' : '数据来自国家统计局'
												},
												tooltip : {
													'trigger' : 'axis'
												},
												legend : {
													x : 'right',
													'data' : [ 'GDP', '金融',
															'房地产', '第一产业',
															'第二产业', '第三产业' ],
													'selected' : {
														'GDP' : true,
														'金融' : false,
														'房地产' : true,
														'第一产业' : false,
														'第二产业' : false,
														'第三产业' : false
													}
												},
												toolbox : {
													'show' : true,
													orient : 'vertical',
													x : 'right',
													y : 'center',
													'feature' : {
														'mark' : {
															'show' : true
														},
														'dataView' : {
															'show' : true,
															'readOnly' : false
														},
														'magicType' : {
															'show' : true,
															'type' : [ 'line',
																	'bar',
																	'stack',
																	'tiled' ]
														},
														'restore' : {
															'show' : true
														},
														'saveAsImage' : {
															'show' : true
														}
													}
												},
												calculable : true,
												grid : {
													'y' : 80,
													'y2' : 100
												},
												xAxis : [ {
													'type' : 'category',
													'axisLabel' : {
														'interval' : 0
													},
													'data' : [ '北京', '\n天津',
															'河北', '\n山西',
															'内蒙古', '\n辽宁',
															'吉林', '\n黑龙江',
															'上海', '\n江苏', '浙江',
															'\n安徽', '福建',
															'\n江西', '山东',
															'\n河南', '湖北',
															'\n湖南', '广东',
															'\n广西', '海南',
															'\n重庆', '四川',
															'\n贵州', '云南',
															'\n西藏', '陕西',
															'\n甘肃', '青海',
															'\n宁夏', '新疆' ]
												} ],
												yAxis : [ {
													'type' : 'value',
													'name' : 'GDP（亿元）',
													'max' : 53500
												}, {
													'type' : 'value',
													'name' : '其他（亿元）'
												} ],
												series : [
														{
															'name' : 'GDP',
															'type' : 'bar',
															'markLine' : {
																symbol : [
																		'arrow',
																		'none' ],
																symbolSize : [
																		4, 2 ],
																itemStyle : {
																	normal : {
																		lineStyle : {
																			color : 'orange'
																		},
																		barBorderColor : 'orange',
																		label : {
																			position : 'left',
																			formatter : function(
																					params) {
																				return Math
																						.round(params.value);
																			},
																			textStyle : {
																				color : 'orange'
																			}
																		}
																	}
																},
																'data' : [ {
																	'type' : 'average',
																	'name' : '平均值'
																} ]
															},
															'data' : dataMap.dataGDP['2002']
														},
														{
															'name' : '金融',
															'yAxisIndex' : 1,
															'type' : 'bar',
															'data' : dataMap.dataFinancial['2002']
														},
														{
															'name' : '房地产',
															'yAxisIndex' : 1,
															'type' : 'bar',
															'data' : dataMap.dataEstate['2002']
														},
														{
															'name' : '第一产业',
															'yAxisIndex' : 1,
															'type' : 'bar',
															'data' : dataMap.dataPI['2002']
														},
														{
															'name' : '第二产业',
															'yAxisIndex' : 1,
															'type' : 'bar',
															'data' : dataMap.dataSI['2002']
														},
														{
															'name' : '第三产业',
															'yAxisIndex' : 1,
															'type' : 'bar',
															'data' : dataMap.dataTI['2002']
														} ]
											},
											{
												title : {
													'text' : '2003全国宏观经济指标'
												},
												series : [
														{
															'data' : dataMap.dataGDP['2003']
														},
														{
															'data' : dataMap.dataFinancial['2003']
														},
														{
															'data' : dataMap.dataEstate['2003']
														},
														{
															'data' : dataMap.dataPI['2003']
														},
														{
															'data' : dataMap.dataSI['2003']
														},
														{
															'data' : dataMap.dataTI['2003']
														} ]
											},
											{
												title : {
													'text' : '2004全国宏观经济指标'
												},
												series : [
														{
															'data' : dataMap.dataGDP['2004']
														},
														{
															'data' : dataMap.dataFinancial['2004']
														},
														{
															'data' : dataMap.dataEstate['2004']
														},
														{
															'data' : dataMap.dataPI['2004']
														},
														{
															'data' : dataMap.dataSI['2004']
														},
														{
															'data' : dataMap.dataTI['2004']
														} ]
											},
											{
												title : {
													'text' : '2005全国宏观经济指标'
												},
												series : [
														{
															'data' : dataMap.dataGDP['2005']
														},
														{
															'data' : dataMap.dataFinancial['2005']
														},
														{
															'data' : dataMap.dataEstate['2005']
														},
														{
															'data' : dataMap.dataPI['2005']
														},
														{
															'data' : dataMap.dataSI['2005']
														},
														{
															'data' : dataMap.dataTI['2005']
														} ]
											},
											{
												title : {
													'text' : '2006全国宏观经济指标'
												},
												series : [
														{
															'data' : dataMap.dataGDP['2006']
														},
														{
															'data' : dataMap.dataFinancial['2006']
														},
														{
															'data' : dataMap.dataEstate['2006']
														},
														{
															'data' : dataMap.dataPI['2006']
														},
														{
															'data' : dataMap.dataSI['2006']
														},
														{
															'data' : dataMap.dataTI['2006']
														} ]
											},
											{
												title : {
													'text' : '2007全国宏观经济指标'
												},
												series : [
														{
															'data' : dataMap.dataGDP['2007']
														},
														{
															'data' : dataMap.dataFinancial['2007']
														},
														{
															'data' : dataMap.dataEstate['2007']
														},
														{
															'data' : dataMap.dataPI['2007']
														},
														{
															'data' : dataMap.dataSI['2007']
														},
														{
															'data' : dataMap.dataTI['2007']
														} ]
											},
											{
												title : {
													'text' : '2008全国宏观经济指标'
												},
												series : [
														{
															'data' : dataMap.dataGDP['2008']
														},
														{
															'data' : dataMap.dataFinancial['2008']
														},
														{
															'data' : dataMap.dataEstate['2008']
														},
														{
															'data' : dataMap.dataPI['2008']
														},
														{
															'data' : dataMap.dataSI['2008']
														},
														{
															'data' : dataMap.dataTI['2008']
														} ]
											},
											{
												title : {
													'text' : '2009全国宏观经济指标'
												},
												series : [
														{
															'data' : dataMap.dataGDP['2009']
														},
														{
															'data' : dataMap.dataFinancial['2009']
														},
														{
															'data' : dataMap.dataEstate['2009']
														},
														{
															'data' : dataMap.dataPI['2009']
														},
														{
															'data' : dataMap.dataSI['2009']
														},
														{
															'data' : dataMap.dataTI['2009']
														} ]
											},
											{
												title : {
													'text' : '2010全国宏观经济指标'
												},
												series : [
														{
															'data' : dataMap.dataGDP['2010']
														},
														{
															'data' : dataMap.dataFinancial['2010']
														},
														{
															'data' : dataMap.dataEstate['2010']
														},
														{
															'data' : dataMap.dataPI['2010']
														},
														{
															'data' : dataMap.dataSI['2010']
														},
														{
															'data' : dataMap.dataTI['2010']
														} ]
											},
											{
												title : {
													'text' : '2011全国宏观经济指标'
												},
												series : [
														{
															'data' : dataMap.dataGDP['2011']
														},
														{
															'data' : dataMap.dataFinancial['2011']
														},
														{
															'data' : dataMap.dataEstate['2011']
														},
														{
															'data' : dataMap.dataPI['2011']
														},
														{
															'data' : dataMap.dataSI['2011']
														},
														{
															'data' : dataMap.dataTI['2011']
														} ]
											} ]
								};
								gdpChart.setOption(optionGDP);
								
								/*var weiboOption = {
									    title : {
									        text: '微博关系网络',
									        subtext: '数据来自网络',
									        x:'right',
									        y:'bottom'
									    },
									    tooltip : {
									        trigger: 'item',
									        formatter : '{b}'
									    },
									    toolbox: {
									        show : true,
									        feature : {
									            restore : {show: true},
									            magicType: {
									                show: true,
									                type: ['force', 'chord'],
									                option: {
									                    chord: {
									                        minRadius : 8,
									                        maxRadius : 15,
									                        ribbonType: false,
									                        itemStyle: {
									                            normal: {
									                                label: {
									                                    show: true,
									                                    rotate: true
									                                },
									                                chordStyle: {
									                                    opacity: 0.2
									                                }
									                            }
									                        }
									                    },
									                    force: {
									                        minRadius : 5,
									                        maxRadius : 8,
									                        itemStyle : {
									                            normal : {
									                                label: {
									                                    show: false
									                                },
									                                linkStyle : {
									                                    opacity : 0.5
									                                }
									                            }
									                        }
									                    }
									                }
									            },
									            saveAsImage : {show: true}
									        }
									    },
									    legend : {
									        data : ['跑男官微', '跑男成员', '其他人'],
									        orient : 'vertical',
									        x : 'left'
									    },
									    noDataEffect: 'none',
									    series :[{
									        //FIXME No data
									        type: 'force',
									    }],
									};
									weiboOption.series[0] = {
							            type: 'force',
							            name: 'webkit-dep',
							            itemStyle: {
							                normal : {
							                    linkStyle : {
							                        opacity : 0.5
							                    }
							                }
							            },
							            categories: data[2].category,
							            nodes: data[2].node,
							            links: data[2].link,
							            minRadius: 8,
							            maxRadius: 28,
							            gravity: 2,
							            scaling: 3.5,
							            steps: 20,
							            large: true,
							            useWorker: true,
							            coolDown: 0.995,
							            centripetal: 0.1,
							            attractiveness: 10,
							            ribbonType: false
									}
								
								weiboChart.setOption(weiboOption);
								weiboChart.hideLoading();*/
								var Pm25_option = {
									    title : {
									        text: '全国主要城市空气质量（pm2.5）',									   
									        x:'center'
									    },
									    tooltip : {
									        trigger: 'item'
									    },
									    legend: {
									        orient: 'vertical',
									        x:'left',
									        data:['pm2.5']
									    },
									    dataRange: {
									        min : 0,
									        max : 700,
									        calculable : true,
									        color: ['black','brown', 'maroon','purple','red','orange','yellow','lightgreen']
									    },
									    toolbox: {
									        show : true,
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
									    series : [
									        {
									            name: 'pm2.5',
									            type: 'map',
									            mapType: 'china',
									            hoverable: false,
									            data : [],
									            markPoint : {
									                symbolSize: 5,       // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
									                itemStyle: {
									                    normal: {
									                        borderColor: '#87cefa',
									                        borderWidth: 1,            // 标注边线线宽，单位px，默认为1
									                        label: {
									                            show: false
									                        }
									                    },
									                    emphasis: {
									                        borderColor: '#1e90ff',
									                        borderWidth: 5,
									                        label: {
									                            show: false
									                        }
									                    }
									                },
									                data : data[3].pm_25
									            },
									            geoCoord: data[4]
									        },
									        {
									            name: 'Top5',
									            type: 'map',
									            mapType: 'china',
									            data:[],
									            markPoint : {
									                symbol:'emptyCircle',
									                symbolSize : function (v){
									                    return 10 + v/100
									                },
									                effect : {
									                    show: true,
									                    shadowBlur : 0
									                },
									                itemStyle:{
									                    normal:{
									                        label:{show:false}
									                    }
									                },
									                data : [
									                    {name: "银川", value: 617},
									                    {name: "兰州", value: 607},
									                    {name: "唐山", value: 602},
									                    {name: "呼和浩特", value: 473},
									                    {name: "芜湖", value: 401}
									                ]
									            }
									        }
									    ]
									};
									                    
								pm25Chart.setOption(Pm25_option);
							},
							error : function(XMLHttpRequest, textStatus,
									errorThrown) {
								jAlert(errorThrown, "错误");
							},
						});

			}
			return {
				'model' : homeViewModel,
				'template' : template,
				'init' : init
			};

		});