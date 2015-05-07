define(['jquery', 'knockout', 'text!static/pages/emall/category/bindtemplate.html'], function($, ko, template) {
	
	var testModel = {
		availableMeals : ko.observableArray([]),
		selectMeal : ko.observable("9.95"),
		email : ko.observable("liujmc@yonyou.com"),
		password : ko.observable("yonyou1"),
		shouldShowMessage : ko.observable(true),
		price : ko.observable(20),
		myclass : ko.observable("btn btn-primary"),
		mycolor : ko.observable("blue"),
		url : ko.observable("www.baidu.com"),
		details : ko.observable("百度"),
		ischecked : ko.observable(true),
		wantsSpam: ko.observable(true),
        spamFlavors: ko.observableArray(["cherry", "almond"]),
        availableCountries: ko.observableArray([
            {"cname":"UK", "area":65000000},
            {"cname":"USA", "area":320000000},
            {"cname":"Sweden", "area":29000000}
        ]),
        selectedCountry: ko.observable(),
        docs : ko.observableArray([]),
        searchText : ko.observable(),
        filterText : ko.observable()
	}
	
	testModel.priceRating = ko.dependentObservable(function () {
        return this.price() > 50 ? "expensive" : "affordable";
    }, testModel);

	testModel.testSolr = function(){
	  
		mycallback = function(data){
			//alert(data.response.docs.length);
			//alert(JSON.stringify(data.response.docs));
			testModel.docs(data.response.docs);
		}
		
		var searchStr = testModel.searchText();
		var filterText = testModel.filterText();
		$.ajax({
			type: 'get',
			contentType: 'application/json', 
			url: "http://localhost:8983/solr/emall/select",
			async: false,
			data: { 
				"q": "title:"+searchStr, 
				"start":0,
				"rows":10,
				"indent":"on",
				"wt":"json",
				"json.wrf":"mycallback"
			},
			jsonp: "callback",
			jsonpCallback: "mycallback",
			dataType: 'jsonp',
			error: function() {
				alert("调用solr搜索引擎报错!");
			}
		});
	}
	
	testModel.viewProduct = function(){
		alert(this.id);
		window.open("http://20.12.6.204/goods/" + this.id + ".shtml");
	}
	
	var init = function() {
		var selectsArray = new Array();
		selectsArray.push({ mealName: 'Standard', description: 'Dry crusts of bread', extraCost: 0 });
		selectsArray.push({ mealName: 'Premium', description: 'Fresh bread with cheese', extraCost: 9.95 });
		selectsArray.push({ mealName: 'Deluxe', description: 'Caviar and vintage Dr Pepper', extraCost: 18.50 });
		
		testModel.availableMeals(selectsArray);
		testModel.email("licza@yonyou.com");
		testModel.selectMeal("9.95");
		//testModel.shouldShowMessage(false);
		testModel.price(90);
		
		testModel.spamFlavors.push("msg");
		
		
		$( "#city" ).autocomplete({
			source: function( request, response ) {
				$.ajax({
					url: "http://localhost:8983/solr/ec/select",
					dataType: "jsonp",
					contentType: 'application/json',
					type: 'get',
					async: false,
					data: { 
						"q": "name:*" + request.term + "*", 
						"fq": "",
						"start":0,
						"rows":10,
						"indent":"on",
						"wt":"json",
						"json.wrf":"success"
					},
					jsonp: "callback",
					jsonpCallback: "success",
					error: function() {
						alert("调用solr搜索引擎报错!");
					},
					success: function( data ) {
						response( $.map( data.response.docs, function( item ) {
							return {
								label: item.name,
								value: item.code
							}
						}));
					}
				});
			},
			minLength: 2,
			select: function( item ) {
				alert("您的选择是：" + item.label);
			}
		});
		
		
		$( "#goods" ).autocomplete({
			source: function( request, response ) {
				$.ajax({
					url: "http://localhost:8983/solr/emall/select",
					dataType: "jsonp",
					contentType: 'application/json',
					type: 'get',
					async: false,
					data: { 
						"q": "title:" + request.term + "", 
						"fq": "",
						"start":0,
						"rows":10,
						"indent":true,
						"wt":"json",
						"json.wrf":"success"
					},
					jsonp: "callback",
					jsonpCallback: "success",
					error: function() {
						alert("调用solr搜索引擎报错!");
					},
					success: function( data ) {
						response( $.map( data.response.docs, function( item ) {
							return {
								label: item.title,
								value: item.title
							}
						}));
					}
				});
			},
			minLength: 2,
			select: function( item ) {
				alert("您的选择是：" + item.label);
			}
		});
		
	}
	
	testModel.myFunction = function(p1,p2){
		var jsonData = ko.toJSON(testModel);
		alert(jsonData);
	}
	
	return {
		'model': testModel,
		'template': template,
		'init':init
	};
});