define(
		[ 'jquery', 'knockout',
				'text!static/pages/ae/explore/dataVisualization/dataVisualization.html','echarts' ],
		function($, ko, template) {
			var dataViewModel = {
					info : ko.observable("")
			}
			
			var inited = false;

			function getView(datatype){
				var newsChart = echarts.init($("#newscharts")[0],'macarons');
				$.ajax({
					type : 'GET',
					url : 'ae/explore/getViewedData',
					data: {
						data : "uap"
					},
					success : function(data) {	
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
							            magicType : {show: true, type: ['line', 'bar']},
							            restore : {show: true},
							            saveAsImage : {show: true}
							        }
							    },
							    calculable : true,
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
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						jAlert(errorThrown, "获取详细信息失败!")
					}
				});
			}
			var init = function() {
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